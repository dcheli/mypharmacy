import React, { Component } from 'react'
import { Modal } from 'semantic-ui-react';

class ScriptView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
        <div>
            <Modal.Header>This is the Script and Patient Information </Modal.Header>
            <Modal.Content>
             Hello world
            </Modal.Content>

        </div>
        )
        
    }
}

export default ScriptView;