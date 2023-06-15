import React, { Component } from 'react'
import {Card, CardTitle, Button, CardText, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import Joi from 'joi';

import loading from '../loading.gif'

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/messages' : '/production';

const MESSAGE_SCHEMA = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(100).required(),
    message: Joi.string().min(1).max(500).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    date: Joi.date(),
});


export default class MessageCard extends Component {
    state = {
        showForm: true,
        loading: false,
        showConfirmation: false,
        user: {
            name: '',
            message: '',
        },
    }

    // Form actions
    toggleForm = () => {
        this.setState({
            showForm: !this.state.showForm
        })
    }

    isFormValid = () => {
        if (!this.props.location) return false;

        let newMessage = { 
            name:  this.state.user.name,
            message: this.state.user.message,
            latitude: this.props.location.lat,
            longitude: this.props.location.long,
        }

        let result = Joi.validate(newMessage, MESSAGE_SCHEMA);

        return !result.error;
    }

    onFormSubmit = (e) => {
        e.preventDefault();
        let form = e.target;

        if (this.isFormValid()) {
            let message = { 
                name:  this.state.user.name,
                message: this.state.user.message,
                latitude: this.props.location.lat,
                longitude: this.props.location.long,
            }

            this.setState({
                loading: true
            });
            
            fetch(API_URL, {
                method: 'POST',
                headers: { 
                    'content-type': 'application/json'
                },
                body: JSON.stringify(message),
            }).then(() => {
                form.reset();

                this.setState({
                    loading: false,
                    showConfirmation: true,
                    user: {},
                })

                setTimeout(() => {
                    this.setState({ 
                        showConfirmation: false });
                }, 1500)
            });
        } else {
            console.log("invalid form data!")
        }
    }

    onInputChanged = (e) => {
        this.setState({
            user: {
                ...this.state.user,
                [e.target.name]: e.target.value,
            }
        })
    }

    render() {
        return (
            <Card body className="message-form">


                <Button color="link" onClick={this.toggleForm}>Toggle Form</Button>

                <CardTitle>Welcome to Guestmap!</CardTitle>
                <CardText>Leave a message with your location!</CardText>
                <CardText>Thanks!</CardText>
                
                <Form ref="form" onSubmit={this.onFormSubmit}  hidden={!this.state.showForm}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input 
                            onChange={this.onInputChanged}
                            type="text" 
                            name="name" 
                            id="name" 
                            placeholder="Enter your name" />
                    </FormGroup> 

                    <FormGroup>
                        <Label for="message">Message</Label>
                        <Input 
                            onChange={this.onInputChanged}
                            type="textarea" 
                            name="message" 
                            id="message" 
                            placeholder="Enter a message" />
                    </FormGroup>

                    <Button type="submit" color="info" disabled={!this.isFormValid()}>Send</Button>

                    {
                        this.state.loading ? <img src={loading} className="loading" alt="loading" /> : ''
                    }

                    {
                        this.state.showConfirmation ? <Alert color="success">Thanks for saying hi!</Alert> : ''
                    }
                </Form>
            </Card>
        )
    }
}
