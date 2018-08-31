import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Table, Button, Loader, Segment, Dimmer, Confirm, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import * as actions  from '../actions';
import hex2ascii from 'hex2ascii';
import axios from 'axios';
import Constants from '../constants';


// this should come from Metamask I think
const ethAddr = '0x895aE68111DA9323632e783671b451C867378155'
const ScriptStatus = [ "Authorized", "Cancelled", "Claimed", "Countered", "Released", "Completed"];

class MyM3DashBoard extends Component {
    
    constructor(props){
        super(props);
        this.state = { 
            openCancelConfirm: false,
            selectedScriptId: ''};
    }

    componentDidMount() {
        this.props.fetchM3Prescriptions(ethAddr);
    }
 
    handleCancelButton = (e) => {
        this.setState({openCancelConfirm: true, selectedScriptId: e.target.value});
    }



    handleConfirmConfirm = () => {
        this.setState({openCancelConfirm: false});
        
        axios.put(Constants.ROOT_URL + '/api/m3/' + ethAddr +'/cancelscript',{
            scriptId: this.state.selectedScriptId
        })
        .then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    
    handleConfirmCancel = () => {
        this.setState({openCancelConfirm: false});
    }


    renderRows() {
        var index=0;
        const { mym3prescriptions } = this.props.mym3prescriptions;
        const { Row, Cell } = Table;

        return _.map(mym3prescriptions, prescription => {
            var priceInDollars = parseInt(prescription.price) /100
            var dateInMs = parseInt(prescription.dateAdded) * 1000;
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
                    <Cell>{ScriptStatus[prescription.status] !== 'Cancelled' ?
                        <Button primary onClick={this.handleCancelButton}
                            value={prescription.scriptId}>Cancel Prescription</Button> :
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
        
        return (
            <div>
            <Table>
            <Table.Header>
                 <Table.Row>
                     <Table.HeaderCell colSpan='6'>MyMedMarket Prescriptions</Table.HeaderCell>
                 </Table.Row>
             </Table.Header>
             <Table.Body>
                 <Table.Row>
                     <Table.Cell><b>Drug Name</b></Table.Cell>
                     <Table.Cell><b>Form/Strength/Qty</b></Table.Cell>
                     <Table.Cell><b>Date Added</b></Table.Cell>
                     <Table.Cell><b>Price</b></Table.Cell>
                     <Table.Cell><b>Status</b></Table.Cell>
                     <Table.Cell ><b>Action</b></Table.Cell>

               </Table.Row>
                 {this.renderRows()}
             </Table.Body>
 
             </Table>

            <Confirm 
                open={this.state.openCancelConfirm}                    
                onConfirm={this.handleConfirmConfirm}
                header='Cancelling Header'
                content='Some cancel stuff'
                confirmButton='I Agree'
                onCancel={this.handleConfirmCancel}
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
