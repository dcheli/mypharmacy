import React, {Component} from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _ from 'lodash';

class Allergies extends Component {
    renderRows() {
        var index=0;
        const { allergies } = this.props.allergies;
        return _.map(allergies, allergy => {
            var lastOnsetDate = new Date(allergy.lastOnsetDate)
                .toISOString().substr(0,10);
            return (
                <Table.Row key={index++} >
                    <Table.Cell>{allergy.substance}</Table.Cell>
                    <Table.Cell>{allergy.reaction}</Table.Cell>
                    <Table.Cell>{allergy.status}</Table.Cell>
                    <Table.Cell>{lastOnsetDate}</Table.Cell>
                </Table.Row>
            );
        });

    }

    render() {
        if(this.props.allergies === undefined)
           return(<div>Still loading</div>);
        return (
            <Table>
           <Table.Header>
                <Table.Row>
                    <Table.HeaderCell colSpan='4'>Allergies</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row>
                    <Table.Cell><b>Substance</b></Table.Cell>
                    <Table.Cell><b>Reaction</b></Table.Cell>
                    <Table.Cell><b>Status</b></Table.Cell>
                    <Table.Cell><b>Last Onset Date</b></Table.Cell>
              </Table.Row>
                {this.renderRows()}
            </Table.Body>

            </Table>
        )
    }
}


function mapStateToProps({allergies={}, isLoading=false}) {
    return{
        allergies: allergies
    }
}


export default connect(mapStateToProps)(Allergies);