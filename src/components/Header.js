import React, { Component } from 'react';
import { Menu, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {
        return (
            <Menu borderless={true} style={{ marginTop : '10px' }}>
                    <Menu.Item as={Link} to='/'><Image src="/static/focusscriptlogo.png" size="small" alt="FocusScript" /></Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item as={Link} to='/mymedmarket'><Icon name='pills' color='blue' size='large' />MyMedMarket</Menu.Item>
                    <Menu.Item as={Link} to='/mym3dashboard'><Icon name='medkit' color='green' size='large' />My M3 Dashboard</Menu.Item>
                    <Menu.Item as={Link} to='/healthrecords'><Icon name='heart' color='red' size='large' />Health Records</Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

export default Header;