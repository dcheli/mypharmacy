import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Table, Button, Loader, Segment, Dimmer, Confirm, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import * as actions  from '../actions';
import hex2ascii from 'hex2ascii';
import axios from 'axios';
import Constants from '../constants';


// this should come from Metamask I think
const ScriptStatus = [ "Authorized", "Cancelled", "Claimed", "Countered", "Released", "Completed"];

class MyM3DashBoard extends Component {
    
    constructor(props){
        super(props);
        this.state = { 
            openReleaseConfirm: false,
            openCompleteConfirm: false,
            selectedScriptId: ''};
    }

    componentDidMount() {
        this.props.fetchMyM3Prescriptions(Constants.ETH_ADDRESS);
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
        const { mym3prescriptions } = this.props.mym3prescriptions;
        const { Row, Cell } = Table;
        _.map(mym3prescriptions, p => {
            console.log("Price from BC is ", parseInt(p.price._hex));
            console.log("Date from BC is ", p.dateAdded);
            console.log("drug strength from BC is ", p.drugStrength);
    
        });

        return _.map(mym3prescriptions, prescription => {
            var priceInDollars = parseInt(prescription.price._hex,16) /100
            var dateInMs = parseInt(prescription.dateAdded._hex,16) * 1000;
            var d = new Date(dateInMs);
            var drugStrength = hex2ascii(prescription.drugStrength);
            var drugForm = hex2ascii(prescription.drugForm);
            var drugQuantity = hex2ascii(prescription.drugQuantity);
            return (
                <Row key={index++} >
                    <Cell>{prescription.drugName}</Cell>
                    <Cell>{drugForm}<Icon name='caret right' />{drugStrength}<Icon name='caret right' />{drugQuantity}</Cell>
                    <Cell>{d.toLocaleDateString()} {d.toLocaleTimeString()}</Cell>
                    <Cell>$ {priceInDollars}</Cell>
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
        
        return (
            <div>
                <Segment  raised style={{ backgroundColor : '#D3D3D3' }}>
                <h3>My M3 Dashobard</h3></Segment>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell><b>Drug Name</b></Table.HeaderCell>
                            <Table.HeaderCell><b>Form/Strength/Qty</b></Table.HeaderCell>
                            <Table.HeaderCell><b>Date Added</b></Table.HeaderCell>
                            <Table.HeaderCell><b>Price</b></Table.HeaderCell>
                            <Table.HeaderCell><b>Status</b></Table.HeaderCell>
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

function mapStateToProps({mym3prescriptions={}, isLoading=false}) {
    return{
        mym3prescriptions: mym3prescriptions
    }
}

export default connect(mapStateToProps, actions)(MyM3DashBoard);
