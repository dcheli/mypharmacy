import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Table, Button, Loader, Segment, Dimmer, Confirm, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import * as actions  from '../actions';
import hex2ascii from 'hex2ascii';
import axios from 'axios';
import Constants from '../constants';


const ScriptStatus = [ "Authorized", "Cancelled", "Claimed", "Countered", "Released", "Completed"];

class MyM3DashBoard extends Component {
    
    constructor(props){
        super(props);
        this.state = { 
            openReleaseConfirm: false,
            openCompleteConfirm: false,
            selectedScriptId: '',
            column: null,
            data: [],
            direction: null};
    }

    componentDidMount() {
        this.props.fetchMyM3Prescriptions(Constants.ETH_ADDRESS);
    }

    static getDerivedStateFromProps(props, state) {
        console.log("calling getDerivedStateFromProps()")
        if(state.data && state.data.length == 0) {
            return {data: props.mym3prescriptions };
        }
        return null;
    }
    
    handleSort = (clickedColumn) => () => {

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

    handleReleaseButton = (e) => {
        this.setState({openReleaseConfirm: true, selectedScriptId: e.target.value});
    }

    handleCompleteButton = (e) => {
        this.setState({openCompleteConfirm: true, selectedScriptId: e.target.value});
    }

    handleCompleteConfirm = () => {
        this.setState({openCompleteConfirm: false});

        axios.put(Constants.ROOT_URL + '/api/m3/' + Constants.ETH_ADDRESS + '/completescript', {
            scriptId : this.state.selectedScriptId,
            address: Constants.ETH_ADDRESS
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    handleCompleteCancel = () => {
        this.setState({openCompleteConfirm: false});
    }

    handleReleaseConfirm = () => {
        this.setState({openReleaseConfirm: false});
        
        axios.put(Constants.ROOT_URL + '/api/m3/' + Constants.ETH_ADDRESS +'/releasescript',{
            scriptId: this.state.selectedScriptId
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
    handleReleaseCancel = () => {
        this.setState({openReleaseConfirm: false});
    }

    renderRows() {
        var index=0;
        const {data} = this.state
        const { Row, Cell } = Table;

        return _.map(data, prescription => {   
            return (
                <Row key={index++} >
                    <Cell>{prescription.formula}</Cell>
                    <Cell>{prescription.form}<Icon name='caret right' />{prescription.quantity}</Cell>
                    <Cell>{prescription.dateAdded.toLocaleDateString()} {prescription.dateAdded.toLocaleTimeString()}</Cell>
                    <Cell>$ {prescription.price}</Cell>
                    <Cell>{ScriptStatus[prescription.status]}</Cell>
                    <Cell>{ScriptStatus[prescription.status] === 'Claimed' ?
                    <div>
                        <Button primary onClick={this.handleReleaseButton}
                            value={prescription.scriptId}>Release</Button> 
                        <Button primary onClick={this.handleCompleteButton}
                            value={prescription.scriptId}>Complete</Button> 
                    </div>: ""}
                        {ScriptStatus[prescription.status] === 'Completed' ?
                        <div><Icon name='checkmark' color='green' size='large'/></div>: ""}</Cell>
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

        const {column, direction } = this.state;
        return (
            <div>
                <Segment  raised style={{ backgroundColor : '#D3D3D3' }}>
                <h3>MyMedMarket Dashboard</h3></Segment>
                <Table sortable>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell 
                        width={5}
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
                        width={2}
                        sorted={column === 'status' ? direction : null}
                        onClick={this.handleSort('status')}                                                           
                     ><b>Status</b></Table.HeaderCell>
                     <Table.HeaderCell ><b>Action</b></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderRows()}
                    </Table.Body>
             </Table>

            <Confirm 
                open={this.state.openReleaseConfirm}                    
                onConfirm={this.handleReleaseConfirm}
                header='Release Header'
                content='Some release stuff'
                confirmButton='Release'
                onCancel={this.handleReleaseCancel}
            />

            <Confirm 
                open={this.state.openCompleteConfirm}                    
                onConfirm={this.handleCompleteConfirm}
                header='Complete Header'
                content='Some complete stuff'
                confirmButton='Complete'
                onCancel={this.handleCompleteCancel}
            />
            </div>
        );
    }
};

function mapStateToProps({mym3prescriptions={}}) {
    let displayData = [];
    if(mym3prescriptions) {
        console.log("My scripts are ", mym3prescriptions.mym3prescriptions)
        _.forEach(mym3prescriptions.mym3prescriptions, function(record) 
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
        mym3prescriptions: displayData,
    }
}

export default connect(mapStateToProps, actions)(MyM3DashBoard);
