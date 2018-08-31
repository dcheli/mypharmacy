import React, { Component } from 'react';
import { Button, Table, Dimmer,Loader, Confirm, Accordion, Icon, Form,  Segment  } from 'semantic-ui-react';
import _ from 'lodash';
import * as actions  from '../actions';
import hex2ascii from 'hex2ascii';
import axios from 'axios';
import Constants from '../constants';
import { connect } from 'react-redux';

import states from '../../static/data/stateOptions';
const ScriptStatus = [ "Authorized", "Cancelled", "Claimed", "Countered", "Released", "Completed"];
// this needs to be refactored when you are smarter; it is tightly coupled to dFormFilter
const dFormArray = ["Capsule","Cream" ,"Lotion","OintmentGel","Solution","Sublingual","Tablet"];

class MyMedMarket extends Component {


    constructor(props) {
        super(props);
        this.state = { 
            tClassFilter : [false, true, false, false, true, true, false, true, false, false, false, true, false, true, false, false, false, false ],
            dFormFilter :  [false, true, true, true, true, false, true],
             
           // dFormArray: ["Capsule","Cream" ,"Lotion","OintmentGel","Solution","Sublingual","Tablet"],
            allStates: false,
            stateFilter : [ "MO","IL"],
            activeIndex: 0,
            selectedScriptId: '', 
            popup: false,
            openClaimConfirm: false };
    }

    componentDidMount() {
        this.props.fetchM3Prescriptions();
    }

    handleClick = (event, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }

    handleStateChange = (event, result) => {
        const {name, value} = result;
        this.setState({
            stateFilter: value
        });

    }

    handleAllStates = (event, result) => {
        const { checked } = result;
        this.setState({
            allStates: checked
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
        this.setState({openClaimConfirm: false});
        
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

    updateDForm = (event, result) => {

        const {name, id, checked} = result;
        var dfFilter = this.state.dFormFilter;
        dfFilter[parseInt(id.substring(2))] = checked;
        this.setState({
           dFormFilter: dfFilter 
        });
    }

    renderRows() {
        var index=0;
        const { mym3prescriptions } = this.props.mym3prescriptions;
        const { Row, Cell } = Table;
        
        var filteredScripts = _.filter(mym3prescriptions, (prescription) => {            
            var drugForm = hex2ascii(prescription.drugForm);
            var dFormIndex = dFormArray.indexOf(drugForm);
            
            return ((this.state.allStates || this.state.stateFilter.indexOf(hex2ascii(prescription.state)) > -1) &&
                    (this.state.dFormFilter[dFormIndex]) )
            });

        return _.map(filteredScripts, prescription => {
            var priceInDollars = parseInt(prescription.price) /100
            var dateInMs = parseInt(prescription.dateAdded) * 1000;
            var d = new Date(dateInMs);
            var drugStrength = hex2ascii(prescription.drugStrength);
            var state = hex2ascii(prescription.state);
            var drugForm = hex2ascii(prescription.drugForm);
            var drugQuantity = hex2ascii(prescription.drugQuantity);

            return (
                <Row key={index++} >
                    <Cell>{prescription.drugName}</Cell>
                    <Cell>{drugForm}<Icon name='caret right' />{drugStrength}<Icon name='caret right' />{drugQuantity}</Cell>
                    <Cell>{d.toLocaleDateString()} {d.toLocaleTimeString()}</Cell>
                    <Cell>$ {priceInDollars}</Cell>
                    <Cell>{state}</Cell>
                    <Cell>{ScriptStatus[prescription.status]}</Cell>
                    
                    <Cell>{ScriptStatus[prescription.status] === 'Authorized' ?
                        <div>
                        <Button primary onClick={this.handleClaimButton}
                            value={prescription.scriptId}>Claim</Button> 
                        <Button primary onClick={this.handleCounterButton}
                            value={prescription.scriptId}>Counter</Button></div> :
                        <Icon name='checkmark' color='green' size='large'/>}</Cell>
                </Row>
            );
        });
    }

    render() {

        if(this.props.mym3prescriptions === undefined ||
            _.isEmpty(this.props.mym3prescriptions))
            return(<div><Segment size='large'>
                    <h3>MyMedMarket</h3>
                        <Dimmer active inverted>
                            <Loader>Loading Prescriptions</Loader>
                        </Dimmer>
                        </Segment></div>);

                        
        const { activeIndex } = this.state
        const { Header, Row, HeaderCell, Body } = Table;
        
        return (
            
            <Form>
            <Segment  raised style={{ backgroundColor : '#D3D3D3' }}>
                <h3>Marketplace Filters</h3></Segment>

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

            <Table>
           <Table.Header>
                 <Table.Row>
                     <Table.HeaderCell colSpan='7'>MyMedMarket Place</Table.HeaderCell>
                 </Table.Row>
             </Table.Header>
             <Table.Body>
                 <Table.Row>
                     <Table.Cell><b>Drug Name</b></Table.Cell>
                     <Table.Cell><b>Form/Strength/Qty</b></Table.Cell>
                     <Table.Cell><b>Date Added</b></Table.Cell>
                     <Table.Cell><b>Price</b></Table.Cell>
                     <Table.Cell><b>State</b></Table.Cell>
                     <Table.Cell><b>Status</b></Table.Cell>
                     <Table.Cell ><b>Actions</b></Table.Cell>
               </Table.Row>
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
        );
    }
}


function mapStateToProps({mym3prescriptions={}, isLoading=false}) {
    
    
    return{
        mym3prescriptions: mym3prescriptions
    }
}

export default connect(mapStateToProps, actions)(MyMedMarket);
