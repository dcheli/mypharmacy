import React, { Component } from 'react';
import { Form, Select, Input, Checkbox, Button } from 'semantic-ui-react';
const forms = [
    { key: 'm', text: 'Male', value: 'male' },
    { key: 'f', text: 'Female', value: 'female' },
];

const strengths = [
    { key: 'm', text: 'Male', value: 'male' },
    { key: 'f', text: 'Female', value: 'female' },
];
const quantities = [
    { key: 'm', text: 'Male', value: 'male' },
    { key: 'f', text: 'Female', value: 'female' },
];

class CompoundSearch extends Component {
    render() {
        return(
            <Form>
                <Form.Field label='Compounded Drug'  control={Input} />
                <Form.Field label='Form' placeholder='Select Form' control={Select} options={forms} />
                <Form.Field label='Strength' placeholder='Select Strength' control={Select} options={strengths} />
                <Form.Field label='Quantity' placeholder='Select Quantity' control={Select} options={quantities} />
                <Form.Group inline>
                    <Form.Field label='generic' checked control={Input} type='radio' name='rxradios' />
                    <Form.Field label='brand' control={Input} type='radio' name='rxradios' />
                </Form.Group>
                <Form.Field control={Button}>Search</Form.Field>
            </Form>
        );
    }
}

export default CompoundSearch;
