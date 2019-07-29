import React, {Component} from 'react';
import { Table, Segment, Dimmer, Loader} from 'semantic-ui-react'
import { connect } from 'react-redux';
import * as actions from '../actions';
import _ from 'lodash';
import axios from 'axios';
const ROOT_URL = 'http://localhost:5000';

const myId = '5b71e7a398b69632ac5e6393';
class HealthRecords extends Component {

    constructor(props){
        super(props);
        this.state = { 
            activeIndex: 0,
            hideRxSegment: true,
            drugName: '',
            drugForm: '', 
            drugStrength: '', 
            drugQuantity: '',
            estPrice: '',
            openTermConfirm: false,
            openM3Confirm: false,
            checked: false,
            popup: false };
    }

    componentDidMount() {
        // this kicks off the data loading process
        this.props.fetchMyPatientShares('0xA0031fdBD932CBa7B19426FfD8317F4390831985');
    }
    



    renderRows() {
        var index=0;
        const { patientShares } = this.props;
        console.log("PatientShares ", patientShares);
        const { Row, Cell } = Table;

        _.map(patientShares, (obj) => {
            console.log("url is ", obj.url, " and owner is ", obj.owner);
        });

        return _.map(patientShares, (obj) => {
            return (
                <Row key={index++} >
                    <Cell><a href={obj.url}target="_blank">{obj.url}</a></Cell>
                    <Cell>{obj.owner}</Cell>
                </Row>
            );
        });

    }
   
    render() {
        if(this.props.patientShares === undefined ||
            _.isEmpty(this.props.patientShares))
            return(<div><Segment size='large'>
                    <h3>Health Records</h3>
                        <Dimmer active inverted>
                            <Loader>Loading Patient Data</Loader>
                        </Dimmer>
                        </Segment></div>);
       
        return (
            <div>   
                <Table color='red' key='red'>
                    <Table.Header>
                        <Table.Row>
                        <Table.HeaderCell>Patient Information</Table.HeaderCell>
                        <Table.HeaderCell>Resource Owner</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {this.renderRows()}
                    </Table.Body>
                </Table>
    
            </div>
        );      
    };
}

function mapStateToProps({ patientShares: patientShares}) {

    return ({patientShares:patientShares.patientShares});
}

export default connect(mapStateToProps, actions)(HealthRecords);
