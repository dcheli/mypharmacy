import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { connect } from 'react-redux';
import _ from 'lodash';

class Providers extends Component{
    renderRows() {
        var hrIndex, rIndex, tIndex = 0;
        const { providers } = this.props.providers;
        const { Header, Row, Cell, Body,HeaderCell } = Table;
        return _.map(providers, provider => {

            const { name, contacts, addresses } = provider;
            var officePhone = _.find(contacts, {type:'office'});
            var ethereum = _.find(contacts, {type:'etherum'});
            var officeAddress = _.find(addresses, {type:'office'});
            return (
                <Table key={tIndex++}>
                    <Header>
                        <Row key={hrIndex++}>
                            <HeaderCell colSpan='4'> 
                                {provider.type} - {provider.organizationName}
                            </HeaderCell>
                            <HeaderCell colSpan='2'>
                                <b>npi:&nbsp;&nbsp;</b>{provider.npi}
                            </HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        <Row key={rIndex++}>
                            <Cell><b>Name:&nbsp;&nbsp;</b>{name.firstName}&nbsp;{name.middleName}&nbsp;{name.lastName},&nbsp;{name.suffix}</Cell>
                            <Cell><b>Phone:&nbsp;&nbsp;</b>{officePhone.number}&nbsp;&nbsp;<b>ext:</b> &nbsp;{officePhone.extension}</Cell>
                            <Cell><b>Address:&nbsp;&nbsp;</b>{officeAddress.address1}&nbsp;{officeAddress.address2}</Cell>
                            <Cell><b>City:&nbsp;&nbsp;</b>{officeAddress.city}</Cell>
                            <Cell><b>State:&nbsp;&nbsp;</b>{officeAddress.state}</Cell>
                            <Cell><b>Zip:&nbsp;&nbsp;</b>{officeAddress.zip}</Cell>
                        </Row>
                    </Body>
                </Table>
            );
        });
    }

    render() {
        if(this.props.providers === undefined)
        return(<div>Still loading</div>);
    
        return(
            <div>
            
            {this.renderRows()}
            </div>
        )
    }
}

function mapStateToProps({providers={}, isLoading=false}) {
    
    return{
        providers: providers
    }
}

export default connect(mapStateToProps)(Providers);