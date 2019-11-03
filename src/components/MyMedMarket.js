import React, { Component } from 'react';
import { Button, Table, Dimmer,Loader, Confirm, Accordion, Icon, Form,  Segment, Message  } from 'semantic-ui-react';
import _ from 'lodash';
import * as actions  from '../actions';
import hex2ascii from 'hex2ascii';
import axios from 'axios';
import Constants from '../constants';
import { connect } from 'react-redux';
import CounterModal from '../components/CounterModal';

import states from '../../static/data/stateOptions';
const ScriptStatus = [ "Authorized", "Cancelled", "Claimed", "Countered", "Released", "Completed"];
// this needs to be refactored when you are smarter; it is tightly coupled to dFormFilter
const dFormArray = ["Capsule","Cream" ,"Lotion","Ointment","Solution","Sublingual","Tablet", "Syrup", "Gel"];

class MyMedMarket extends Component {

    constructor(props) {
        console.log("constructor()")
        super(props);
        this.state = { 
            tClassFilter : [false, true, false, false, true, true, false, true, false, false, false, true, false, true, false, false, false, false ],
            dFormFilter :  [false, true, true, true, true, false, true, true],
            allStates: false,
            stateFilter : [ "MO","IL"],
            activeIndex: 0,
            selectedScriptId: '', 
            popup: false,
            openClaimConfirm: false,
            counterOffer: '',
            action:'',
            column: null,
            data: [],
            direction: null
        };
    }

    componentDidMount() {
        console.log("componentDidMount()");
        this.props.fetchM3Prescriptions();
    }

    static getDerivedStateFromProps(props, state) {
  
        if(state.data && state.data.length == 0){
            var filteredScripts = _.filter(props.m3prescriptions, prescription => {            
                var dFormIndex = dFormArray.indexOf(prescription.form);
    
                return ((state.allStates || state.stateFilter.indexOf(prescription.state) > -1) &&
                        (state.dFormFilter[dFormIndex]) )
            });

            return {data: filteredScripts };
        }

        return null;
    }

    handleSort = (clickedColumn) => () => {
        console.log("handle sort")
        
        const {column, data, direction } = this.state;       
        if (column !== clickedColumn) {
            this.setState({
              column: clickedColumn,
              data: _.orderBy(data, [clickedColumn], ['asc']),
              direction: 'ascending',
            })
            return;
        }

        this.setState({
            column: null,
            data: _.orderBy(data, [clickedColumn], ['desc']),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }

    handleClick = (event, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }
    // NOTE: this is NOT React/Redux state, but USA State filter
    handleStateChange = (event, result) => {
        const {name, value} = result;
        this.setState({
            stateFilter: value,
            data:[]
        });

    }

    handleAllStates = (event, result) => {
        const { checked } = result;
        this.setState({
            allStates: checked,
            data:[]
        });
    }

    handleClaimButton = (event) => {
        this.setState({openClaimConfirm: true, selectedScriptId: event.target.value});
    }

    handleCounterButton = (event) => {
        console.log("Counter in progress for script ", event.target.value);
    }

    handleClaimConfirm = () => {
        console.log("Claiming in progress");
        this.setState({openClaimConfirm: false, action: "Claimed"});
        
        axios.put(Constants.ROOT_URL + '/api/m3/' + Constants.ETH_ADDRESS +'/claimscript',{
            scriptId: this.state.selectedScriptId
        })
        .then((response) => {
            this.setState({popup: true});
        })
            .catch(function (error) {
            console.log(error);
        });

    }

    handleClaimCancel = () => {
        this.setState({openClaimConfirm: false});
    }

    handlePopupDismiss = () => {
        this.setState({ popup: false })
    }


    getCounterOffer = (scriptId, counterOffer) => {
        axios.put(Constants.ROOT_URL + '/api/m3/' + Constants.ETH_ADDRESS +'/counterscript',{
            scriptId: scriptId,
            counterOffer: counterOffer
        })
        .then((response) => {
            this.setState({popup: true});
        })
            .catch(function (error) {
            console.log(error);
        });
        this.setState({ counterOffer: counterOffer,
                        selectedScriptId: scriptId,
                        action: "Countered"});
    }

    updateDForm = (event, result) => {
        const {id, checked} = result;
        var dfFilter = this.state.dFormFilter;
        dfFilter[parseInt(id.substring(2))] = checked;
        this.setState({
           dFormFilter: dfFilter,
           data: []
        });
    }

    renderRows() {
        console.log("renderRows()")
        var index=0;
        const  { data }  = this.state
        const { Row, Cell } = Table;
                  
        return _.map(data, prescription => {
            return (
                <Row key={index++} >
                    <Cell>{prescription.formula}</Cell>
                    <Cell>{prescription.form}<Icon name='caret right' />{prescription.quantity}</Cell>
                    <Cell>{prescription.dateAdded.toLocaleDateString()} {prescription.dateAdded.toLocaleTimeString()}</Cell>
                    <Cell>$ {prescription.price}</Cell>
                    <Cell>{prescription.state}</Cell>
                    <Cell>{ScriptStatus[prescription.status]}</Cell>
                    
                    <Cell>{ScriptStatus[prescription.status] === 'Authorized' ?
                        <div>
                        <Button primary onClick={this.handleClaimButton}
                            value={prescription.scriptId}>Claim</Button> 
                        <CounterModal 
                            scriptId = {prescription.scriptId}
                            callback={this.getCounterOffer}
                        />
                        </div> : ""}
                        {ScriptStatus[prescription.status] === "Claimed" ?
                            <div><Icon name='checkmark' color='green' size='large'/></div> : ""}
                        {ScriptStatus[prescription.status] === "Countered" ?
                            <div><CounterModal 
                            scriptId = {prescription.scriptId}
                            callback={this.getCounterOffer}
                        />
                        </div> : ""}
                            
                    </Cell>
                </Row>
            );
        });
       }

    render() {
        console.log("render()")
        if(this.props.m3prescriptions === undefined 
            //||  _.isEmpty(this.props.m3prescriptions)
            )
            return(<div><Segment size='large'>
                    <h3>MyMedMarket</h3>
                        <Dimmer active inverted>
                            <Loader>Loading Prescriptions</Loader>
                        </Dimmer>
                        </Segment></div>);

        const { popup, activeIndex, column, direction } = this.state;
        return (
            <div>
                    {(popup) ?
                <Message 
                    success
                    icon
                    onDismiss={this.handlePopupDismiss}>
                    <Icon name='check' />
                    You have successfully {this.state.action} the prescription.
                </Message>
                : ""}
            <Form>
            <Segment  raised style={{ backgroundColor : '#D3D3D3' }}>
                <h3>MyMedMarket Filters</h3></Segment>

            <Accordion fluid styled>

                 <Accordion.Title   active={activeIndex === 0} index={0} onClick={this.handleClick}>
                    <Icon name='dropdown' />
                    Dosage Form Filter
                </Accordion.Title>

                <Accordion.Content active={activeIndex === 0}>
                <Form.Group>
                    <Form.Checkbox id="df0" name="capsule" onChange={this.updateDForm} checked={this.state.dFormFilter[0]} label="Capsule"></Form.Checkbox>
                    <Form.Checkbox id="df1" name="cream" onChange={this.updateDForm} checked={this.state.dFormFilter[1]} label="Cream"></Form.Checkbox>
                    <Form.Checkbox id="df2" name="lotion" onChange={this.updateDForm} checked={this.state.dFormFilter[2]} label="Lotion"></Form.Checkbox>
                    <Form.Checkbox id="df3" name="ointmentGel" onChange={this.updateDForm} checked={this.state.dFormFilter[3]}  label="Ointment/Gel"></Form.Checkbox>
                    <Form.Checkbox id="df4" name="solution" onChange={this.updateDForm} checked={this.state.dFormFilter[4]}  label="Solution"></Form.Checkbox>
                    <Form.Checkbox id="df5" name="sublingual" onChange={this.updateDForm} checked={this.state.dFormFilter[5]} label="Sublingual"></Form.Checkbox>
                    <Form.Checkbox id="df6" name="tablet" onChange={this.updateDForm} checked={this.state.dFormFilter[6]} label="Tablet"></Form.Checkbox>
                    <Form.Checkbox id="df7" name="syrup" onChange={this.updateDForm} checked={this.state.dFormFilter[7]} label="Syrup"></Form.Checkbox>
                    <Form.Checkbox id="df8" name="patch" onChange={this.updateDForm} checked={this.state.dFormFilter[8]} label="Patch"></Form.Checkbox>                  
                </Form.Group>

                </Accordion.Content>

                <Accordion.Title  active={this.state.activeIndex === 1} index={1} onClick={this.handleClick}>
                    <Icon name='dropdown' />
                    State License Filter
                </Accordion.Title>
                <Accordion.Content  active={this.state.activeIndex === 1}>
                <Form.Group>
                    <Form.Checkbox label="All States" onChange={this.handleAllStates}></Form.Checkbox>
                    <Form.Dropdown label='Select State(s) you are licensed in'
                        multiple selection
                        name='state'
                        onChange={this.handleStateChange}                       
                        options={ states } 
                        defaultValue={this.state.stateFilter}
                />

                </Form.Group>

                </Accordion.Content>
            </Accordion>

            <Table sortable>
           <Table.Header>
                 <Table.Row>
                     <Table.HeaderCell colSpan='7' style={{ backgroundColor : '#D3D3D3' }} ><h3>MyMedMarket Prescriptions</h3></Table.HeaderCell>
                 </Table.Row>
             </Table.Header>
             </Table>
             <Table sortable>
             <Table.Header>
                 <Table.Row>
                     <Table.HeaderCell width={5}
                        sorted={column === 'formula' ? direction : null}
                        onClick={this.handleSort('formula')}                 
                     ><b>Formula</b></Table.HeaderCell>
                     <Table.HeaderCell
                        width={2}
                        sorted={column === 'form' ? direction : null}
                        onClick={this.handleSort('form')}                                      
                     ><b>Form/Qty</b></Table.HeaderCell>
                     <Table.HeaderCell
                        width={2}
                        sorted={column === 'dateAdded' ? direction : null}
                        onClick={this.handleSort('dateAdded')}                                                           
                     ><b>Date Added</b></Table.HeaderCell>
                     <Table.HeaderCell
                        width={1}
                        sorted={column === 'price' ? direction : null}
                        onClick={this.handleSort('price')}                                                                                
                     ><b>Price</b></Table.HeaderCell>
                     <Table.HeaderCell
                        width={1}
                        sorted={column === 'state' ? direction : null}
                        onClick={this.handleSort('state')}                                                                                
                     ><b>State</b></Table.HeaderCell>
                     <Table.HeaderCell
                        width={2}
                        sorted={column === 'status' ? direction : null}
                        onClick={this.handleSort('status')}                                                           
                     ><b>Status</b></Table.HeaderCell>
                     <Table.HeaderCell ><b>Actions</b></Table.HeaderCell>
               </Table.Row>
               </Table.Header>
               <Table.Body>
               {this.renderRows()}
             </Table.Body>                
            </Table>
            <Confirm 
                open={this.state.openClaimConfirm}                    
                onConfirm={this.handleClaimConfirm}
                header='ClaimHeader'
                content='Some Claim stuff'
                confirmButton='I Agree'
                onCancel={this.handleClaimCancel}
            />

            </Form>
            </div>
        );
    }
}


function mapStateToProps({m3prescriptions={}, isLoading=false}) {
    console.log("mapStateToProps()");
    let displayData = [];
    
    if(m3prescriptions) {
        _.forEach(m3prescriptions.m3prescriptions, function(record) 
        {   let r = {};
            r.formula = record.formula;
            r.form = hex2ascii(record.form);
            r.quantity = hex2ascii(record.quantity);
            let dateInMs = parseInt(record.dateAdded._hex, 16) * 1000;
            r.dateAdded= new Date(dateInMs);
            r.status = record.status;
            let price = parseInt(record.price._hex, 16) / 100;
            r.price = price.toFixed(2);
            r.priceCounterOffersCount = record.priceCounterOffersCount;
            r.scriptId = record.scriptId;
            r.state = hex2ascii(record.state);
            displayData.push(r);
        });
    }

    return{
        m3prescriptions: displayData,
    }
}

export default connect(mapStateToProps, actions)(MyMedMarket);
