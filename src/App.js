import React, { Component } from 'react';
import './App.css';
import firebase from './config/Firebase'
import {  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
  Link, } from "react-router-dom"
import SimonGame from "./SimonGame"
import ChooseGame from "./ChooseGame"

class App extends Component {
  constructor(props) {
    super();
    this.state = { }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/home"><ChooseGame/></Route>{" "}
          <Route path="/simon-game"><SimonGame/></Route>{" "}
          <Route exact path="/">
            <Redirect to="/home"/>
          </Route>
        </Switch>
      </Router>

    );
  }
}

export default App;
