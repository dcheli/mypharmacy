import React, { Component } from 'react'
import { Button, Modal, Icon, Input, Label } from 'semantic-ui-react'

class CounterModal extends Component {
    state = { open: false, disabled: false, loading: false, errorMessage: '', counterOffer: ''}
    
    close = () => {this.setState({ open: false })}
    openCounterModal = () => {
        this.setState({ open: true })
    }

    counterScript = () => {
        //console.log("Ok ", this.props.scriptId, " and ", this.state.counterOffer);
        this.props.callback(this.props.scriptId, this.state.counterOffer);
        this.setState({open:false});
    }


    handleChange = (e) => {
        this.setState({
            counterOffer: e.target.value
        })
    }


    render() {
    const { open } = this.state;
    const { scriptId } = this.props;

        return (
        <span>
            <Button primary onClick={this.openCounterModal}>Counter</Button>
            <Modal open={open} onClose={this.close}>
                <Modal.Header>
                    Counter Prescription Price
                </Modal.Header>
                <Modal.Content>
                <Input
                    onChange={this.handleChange}
                    name='counterPrice' 
                    required
                    icon='dollar'
                    iconPosition='left' />
                    <br /><br />
                Pressing the <em>'Cancel'</em> button will cancel this action.
                </Modal.Content>

                <Modal.Actions>
                    <Button negative
                        onClick={this.close}
                        content='Cancel' />
                    <Button positive 
                        onClick={this.counterScript}
                        loading={this.state.loading}
                        content='Counter Price' />
          </Modal.Actions>

            </Modal>
        </span>
        )
  }
}

export default CounterModal;