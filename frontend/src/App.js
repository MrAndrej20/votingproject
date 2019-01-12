import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import LoginPage from './LoginPage';
import VoteMenu from './VoteMenu';
import { constructRequest } from "./common/helper";

class App extends Component {
    componentDidMount() {
        // document.cookie = "user=exe";
        // document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
        // document.cookie = "jwt=; expires=Thu, 01, Jan 1970 00:00:00 UTC";
        fetch("https://localhost:3000/admin/session", constructRequest("POST", `username=root&password=root`))
            .catch(msg => console.log(msg))
    }

    render() {
        return <BrowserRouter>
            <Switch>
                <Route exact path='/' component={LoginPage} />
                <Route path='/vote-menu' component={VoteMenu} />
                <Redirect to='/' />
            </Switch>
        </BrowserRouter>
    }
}

export default App;
