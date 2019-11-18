import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const t = {
    color: 'black',
    fontSize: '17px',
    fontWeight: '500',
    fontFamily: 'Helvetica Neue, HelveticaNeue, Helvetica, Arial, sans-serif'    
}
class Header extends Component {
    render() {
        return (
            <Menu borderless={true} style={{ marginTop : '10px', backgroundColor: '#ffee66' }}>
                <Menu.Item as={Link} to='/'><h2>MyRx</h2></Menu.Item>
                <Menu.Menu position="right">
                   {/* <Menu.Item as={Link} to='/mymedmarket' style={t}><Icon name='pills' color='blue' size='large' />MyMedMarket</Menu.Item>*/}
                    <Menu.Item as={Link} to='/mym3dashboard'style={t}><Icon name='medkit' color='green' size='large' />My M3 Dashboard</Menu.Item>
                    <Menu.Item as={Link} to='/healthrecords'style={t}><Icon name='heart' color='red' size='large' />Health Records</Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

export default Header;