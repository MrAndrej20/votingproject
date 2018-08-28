import React, { Component } from 'react';
import './App.css';
import {BrowserRouter, Route, Switch, Redirect} from "react-router-dom";
import LoginPage from './LoginPage';
import VoteMenu from './VoteMenu';

class App extends Component {
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
