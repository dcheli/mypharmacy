import React, {Component} from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _ from 'lodash';

class Medications extends Component {
    renderRows() {
        var index=0;
        const { medications } = this.props.medications;
        const { Row, Cell } = Table
        return _.map(medications, medication => {
            var startDate = new Date(medication.startDate)
            .toISOString().substr(0,10);
    
            return (
                <Row key={index++} >
                    <Cell>{medication.medication}</Cell>
                    <Cell>{medication.directions}</Cell>
                    <Cell>{startDate}</Cell>
                    <Cell>{medication.fillInstructions}</Cell>
                    <Cell>{medication.status}</Cell>
                </Row>
            );
        });

    }

    render() {
        if(this.props.medications === undefined)
           return(<div>Still loading</div>);
        return (
            <Table>
           <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='5'>Medications</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell><b>Medication</b></Table.Cell>
                    <Table.Cell><b>Directions</b></Table.Cell>
                    <Table.Cell><b>Start Date</b></Table.Cell>
                    <Table.Cell><b>Instructions</b></Table.Cell>
                    <Table.Cell><b>Status</b></Table.Cell>
              </Table.Row>
                {this.renderRows()}
            </Table.Body>

            </Table>
        )
    }
}

function mapStateToProps({medications={}, isLoading=false}) {
    return{
        medications: medications
    }
}


export default connect(mapStateToProps)(Medications);