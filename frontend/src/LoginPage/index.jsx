import React from "react";
import {FormInput, FormWrapper, Header, LoginPageContainer, ButtonWrapper, ErrorMessage} from "./styles";
import {Redirect} from "react-router-dom";

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SSN: '',
            password: '',
            valid: false,
            clicked: false
        }
    }

    onSSNChange = event => this.setState({SSN: event.target.value});
    onPasswordChange = event => this.setState({password: event.target.value});
    onEnter = () => {
        // validate provided credentials on server side and send a response
        const {SSN, password} = this.state;
        fetch(`http://localhost:3000/login`) // should contain the exact url starting with localhost:3000
            .then(response => response.json())
            .catch(msg => console.log(msg));
    };

    render() {
        const newLine = <React.Fragment><br/><br/></React.Fragment>;
        const {SSN, password, valid, clicked} = this.state;
        return <LoginPageContainer>
            {valid && <Redirect to='/vote-menu' />}
            <Header>Welcome to eVote</Header>
            <FormWrapper>
                <b>Enter your social security number and password</b>{newLine}
                <div>SSN:</div> <FormInput value={SSN} onChange={this.onSSNChange}/>{newLine}
                <div>Password: </div> <FormInput value={password} onChange={this.onPasswordChange}/>{newLine}
                <ButtonWrapper><button onClick={this.onEnter}>Enter</button></ButtonWrapper>
                {clicked && !valid && <ErrorMessage>Wrong username or password</ErrorMessage>}
            </FormWrapper>
        </LoginPageContainer>
    }
}