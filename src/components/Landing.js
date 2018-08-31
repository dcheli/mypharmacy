import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';


class Landing extends Component {

    render() {
        return (
            <Segment.Group>
                <Segment><h2>My Pharmacy</h2></Segment>
                <Segment raised color='blue' >
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
                </Segment>
          </Segment.Group>
        );
    }
}

export default Landing;