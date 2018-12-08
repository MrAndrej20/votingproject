import React from "react";
import {FormInput, FormWrapper, Header, LoginPageContainer, ButtonWrapper, ErrorMessage} from "./styles";
import {Redirect} from "react-router-dom";
import {constructRequest, getUser} from "../common/helper";

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        const user = getUser();
        this.state = {
            SSN: '',
            password: '',
            logged: user,
            clicked: false
        };
    }

    onSSNChange = event => this.setState({SSN: event.target.value});
    onPasswordChange = event => this.setState({password: event.target.value});
    onEnter = () => {
        const {SSN, password} = this.state;
        fetch(`http://localhost:3000/login`, constructRequest("POST", {embg: SSN, password}))
            .then(res => res.json())
            .then(res => {
              let {logged, clicked} = this.state;

              if (res.status === 200) {
                  logged = true;
              } else {
                  clicked = true;
              }

              this.setState({logged, clicked});
            })
            .catch(msg => console.log(msg));
    };

    render() {
        const newLine = <React.Fragment><br/><br/></React.Fragment>;
        const {SSN, password, logged, clicked} = this.state;
        return <LoginPageContainer>
            {logged && <Redirect to='/vote-menu' />}
            <Header>Welcome to eVote</Header>
            <FormWrapper>
                <b>Enter your social security number and password</b>{newLine}
                <div>SSN:</div> <FormInput value={SSN} onChange={this.onSSNChange}/>{newLine}
                <div>Password: </div> <FormInput type="password" value={password} onChange={this.onPasswordChange}/>{newLine}
                <ButtonWrapper><button onClick={this.onEnter}>Enter</button></ButtonWrapper>
                {clicked && !logged && <ErrorMessage>Wrong username or password</ErrorMessage>}
            </FormWrapper>
        </LoginPageContainer>
    }
}