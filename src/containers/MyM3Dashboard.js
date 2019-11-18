import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Table, Button, Loader, Segment, Menu,
    Dimmer, Confirm, Icon,  Dropdown, Modal } from 'semantic-ui-react';
import _ from 'lodash';
import * as actions  from '../actions';
import hex2ascii from 'hex2ascii';
import axios from 'axios';
import Constants from '../constants';
import ScriptView from '../components/ScriptView';
import 'babel-polyfill';

const ethAddresses =[{key: 0, text: '0x1daa654cfbc28f375e0f08f329de219fff50c765', value: 0}]
const labelStyle = {
    color: 'black',
    backgroundColor: '#cfebfd',
    fontSize: '16px',
    fontWeight: 'bold',
    paddingBottom: '3px',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
}


const dStyle = {
    color: 'black',
    fontSize: '16px',
    fontWeight: '500',
    paddingTop: '3px',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
}

const modalNButton = {
    backgroundColor:'transparent',
    float: 'left',
    border: '0',
    color: '#0049db',
    fontSize: '14px',
    fontWeight: '500',
    borderRight: '5px',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}
const displayText = {
    backgroundColor: 'white',
    //color: '#0049db',
    color:'black',
    fontSize: '14px',
    fontWeight: '500',
    borderRight: '5px',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}

const prescriptionStyle = {
    color: 'black',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
  }

const buttonText = {
    color: 'white',
    backgroundColor: '#026119',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
  }

  const modalPText = {
    color: 'white',
    backgroundColor: '#026119',
    fontSize: '16px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'
  }

const headerText = {
    backgroundColor: 'white',
    //color: '#0049db',
    color:'black',
    fontSize: '16px',
    fontWeight: '500',
    borderRight: '5px',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}

const ScriptStatus = [ "Authorized", "Cancelled", "New Prescription", "Countered", "Released", "Completed"];

class MyM3DashBoard extends Component {
    
    constructor(props){
        super(props);
        this.state = { 
            openReleaseConfirm: false,
            openCompleteConfirm: false,
            selectedScriptId: '',
            column: null,
            data: [],
            direction: null,
            openViewModal: false,
            selectedHnKey: '',
            firstName:'', lastName: '',
            phone: '',
            gender: '',
            birthDate: '',
            city:'', state:'', addrLine1:'', addrLine2: '',
            formula: '', form: '', daysSupply: '', price:''
        };
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

    handleCompleteCancel = (e, {value}) => {
        this.setState({openCompleteConfirm: false});
    }
    handleCancel = () => {
        console.log("calling cancelViewModal");
        this.setState({openViewModal: false})

    }
    handleAccept = () => {
        console.log("Accepting script");
        this.setState({openViewModal: false});
    }

    handleView = async (e, { prescription }) => {
        
        let response = await axios.get(Constants.ROOT_URL + '/api/healthdrs/geturlfromkey', {});
        console.log("Rsp is ", response);
        let rsp = await axios.get(response.data);

        let rs =await  _.find(rsp.data.entry,  (r) => {
            return r.resource.resourceType == "Patient";

        });
        const {resource } = rs;
        const {name, address, telecom } = resource;

        console.log("returned data is ", resource);
        let addr = await _.find(address, (a) => {
            return a.use == "home";
        });

        let nm = await _.find(name, (n) => {
            return n.use = "official";
        });
        console.log("address is ", addr.city)

        let tel = await _.find(telecom, (t) => {
            return t.system == "home";
        })
       console.log("telecom is ", tel);

        this.setState({openViewModal: true, 
            gender: resource.gender,
            birthDate: resource.birthDate,
            city: addr.city, 
            state: addr.state,
            firstName: nm.given[0],
            lastName: nm.family[0],
            addrLine1: addr.line[0],
            addrLine2: addr.line[1],
            postalCode: addr.postalCode,
            phone: tel.value,
            formula: prescription.formula,
            form: prescription.form,
            daySupply: prescription.daySupply,
            price: prescription.price

        });

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
                    <Cell style={displayText}>{prescription.formula}</Cell>
                    <Cell style={displayText}>{prescription.form}<Icon name='caret right' />{prescription.daySupply}</Cell>
                    <Cell style={displayText}>{prescription.dateAdded.toLocaleDateString()} {prescription.dateAdded.toLocaleTimeString()}</Cell>
                    <Cell style={displayText}>$ {prescription.price}</Cell>
                    <Cell style={displayText}>{ScriptStatus[prescription.status]}</Cell>
                    <Cell style={displayText}>{ScriptStatus[prescription.status] === 'New Prescription' ?
                    <div>
                        <Button 
                            onClick={this.handleView}
                            style={buttonText}
                            scriptid={prescription.scriptId}
                            prescription={prescription}
                            >View</Button> 
                        <Button 
                            onClick={this.handleReleaseButton}
                            style={buttonText}
                            value={prescription.scriptId}>Release</Button> 
                        <Button 
                            onClick={this.handleCompleteButton}
                            style={buttonText}
                            value={prescription.scriptId}>Complete</Button> 
                    </div>: ""}
                        {ScriptStatus[prescription.status] === 'Completed' ?
                        <div><Icon name='checkmark' color='green' size='large'/></div>: ""}</Cell>
                </Row>
            );
        });

    }
    render() {
        if(this.props.mym3prescriptions === undefined //||
           // _.isEmpty(this.props.mym3prescriptions)
           )
            return(<div><Segment size='large'>
                    <h3>MyMedMarket</h3>
                        <Dimmer active inverted>
                            <Loader>Loading Prescriptions</Loader>
                        </Dimmer>
                        </Segment></div>);

        const {column, direction } = this.state;
        return (
            <div>
                <Menu borderless={true} style={{ backgroundColor : 'white' }}>{/**D3D3D3*/}
                    <Menu.Item >
                <font style={{fontSize: '24px', fontWeight: '500', color: '#000000', 
                    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'}}>
                        MyMedMarket Dashboard</font>
                        </Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item>
                <Dropdown 
                    style={{paddingRight: '10px'}}
                    defaultValue={0}
                  options={ethAddresses}
                  float='right'
                    placeholder='pharmacy eth address'/>
                    </Menu.Item>
                </Menu.Menu>
                
                
                </Menu>
                <Table sortable>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell
                        style={headerText} 
                        width={4}
                        sorted={column === 'formula' ? direction : null}
                        onClick={this.handleSort('formula')}                 
                     ><b>Formula</b></Table.HeaderCell>
                     <Table.HeaderCell
                        style={headerText}
                        width={2}
                        sorted={column === 'form' ? direction : null}
                        onClick={this.handleSort('form')}                                      
                     ><b>Form/Day Supply</b></Table.HeaderCell>
                     <Table.HeaderCell
                        style={headerText}
                        width={2}
                        sorted={column === 'dateAdded' ? direction : null}
                        onClick={this.handleSort('dateAdded')}                                                           
                     ><b>Date Added</b></Table.HeaderCell>
                     <Table.HeaderCell
                        style={headerText}
                        width={1}
                        sorted={column === 'price' ? direction : null}
                        onClick={this.handleSort('price')}                                                                                
                     ><b>Price</b></Table.HeaderCell>
                    <Table.HeaderCell
                        style={headerText}
                        width={2}
                        sorted={column === 'status' ? direction : null}
                        onClick={this.handleSort('status')}                                                           
                     ><b>Status</b></Table.HeaderCell>
                     <Table.HeaderCell style={headerText}><b>Action(s)</b></Table.HeaderCell>
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
            <Modal
                open={this.state.openViewModal}
            >
                        <Modal.Header>Patient Information</Modal.Header>
            <Modal.Content>
                    <Segment>
                    <Table>
                        <Table.Header>
                            <Table.Row style={prescriptionStyle}>
                                    <Table.HeaderCell>Formula:&nbsp;&nbsp;{this.state.formula}</Table.HeaderCell>
                                    <Table.HeaderCell>Form:&nbsp;&nbsp;{this.state.form}</Table.HeaderCell>
                                    <Table.HeaderCell></Table.HeaderCell>
                                <Table.HeaderCell>Day Supply:&nbsp;&nbsp;{this.state.daySupply}</Table.HeaderCell>
                                <Table.HeaderCell>Est Price:&nbsp;$&nbsp;{this.state.price}</Table.HeaderCell>
                          </Table.Row>
                      </Table.Header>
                    </Table>
 

                    </Segment>
                    <Segment>
                        <Table>
                        <Table.Header>
                        <Table.Row>
                            <Table.Cell style={labelStyle}>First Name</Table.Cell>
                            <Table.Cell style={labelStyle}>Last Name</Table.Cell>
                            <Table.Cell style={labelStyle}>Gender</Table.Cell>
                            <Table.Cell style={labelStyle}>Date of Birth</Table.Cell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        <Table.Row>
                            <Table.Cell style={dStyle}>{this.state.firstName}</Table.Cell>
                            <Table.Cell style={dStyle}>{this.state.lastName}</Table.Cell>
                            <Table.Cell style={dStyle}>{this.state.gender}</Table.Cell>
                            <Table.Cell style={dStyle}>{this.state.birthDate}</Table.Cell>
                        </Table.Row>
                        </Table.Body>
            </Table>

            <Table>
                        <Table.Header>
                            <Table.Row>
                            <Table.Cell style={labelStyle}>Street Address</Table.Cell>
                            <Table.Cell style={labelStyle}>City</Table.Cell>
                            <Table.Cell style={labelStyle}>State</Table.Cell>
                            <Table.Cell style={labelStyle}>Zip Code</Table.Cell>
                            <Table.Cell style={labelStyle}>Contact</Table.Cell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        <Table.Row>
                            <Table.Cell style={dStyle}>{this.state.addrLine1}&nbsp;{this.state.addrLine2} </Table.Cell>
                            <Table.Cell style={dStyle}>{this.state.city}</Table.Cell>
                            <Table.Cell style={dStyle}>{this.state.state}</Table.Cell>
                            <Table.Cell style={dStyle}>{this.state.postalCode}</Table.Cell>
                            <Table.Cell style={dStyle}>{this.state.phone}</Table.Cell>
                        </Table.Row>
                        </Table.Body>
            </Table>

            </Segment>

             

      
             
            </Modal.Content>

            <Modal.Actions>
            <Button style={modalNButton}
                    onClick={this.handleCancel}>
                    Cancel
                </Button>
            <Button 
                style={modalPText}
                onClick={this.handleAccept}>
                Accept

            </Button>
 
            </Modal.Actions>
            </Modal>
  
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
            r.daySupply = hex2ascii(record.daySupply);
            let dateInMs = parseInt(record.dateAdded._hex, 16) * 1000;
            r.dateAdded= new Date(dateInMs);
            r.status = record.status;
            let price = parseInt(record.price._hex, 16) / 100;
            r.price = price.toFixed(2);
            r.priceCounterOffersCount = record.priceCounterOffersCount;
            r.scriptId = record.scriptId;
            r.state = hex2ascii(record.state);
            r.hnKey = record.hnKey;
            console.log(r.hnKey);
            displayData.push(r);
        });
    }

    return{
        mym3prescriptions: displayData,
    }
}

export default connect(mapStateToProps, actions)(MyM3DashBoard);
