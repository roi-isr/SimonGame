import React, { Component } from 'react';
import firebase from './config/Firebase'
import { BrowserRouter, Route, Link, Router, Redirect } from "react-router-dom"

class ChooseGame extends Component {
    constructor(props) {
        super();
        this.state = {
            name: [],
            firebase_ids: [],
            currName: "",
            game_mode: "None"
        }
    }

    componentDidMount() {
        this.renderApp();
        firebase.firestore().collection('Users')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'modified') {
                        this.setState({ name: [...this.state.name, change.doc.data().name] });
                        this.setState({ firebase_ids: [...this.state.firebase_ids, "none"] });
                    }
                })
            })
    }

    gameMode = () => {
        if (this.state.game_mode === "Simon")
            return (<Redirect to="/simon-game"></Redirect>);
        else
            return null;
    }

    deleteName = (ind) => {
        var newArr = this.state.name.filter((name, index) => index !== ind);
        this.setState({ name: [...newArr] });
        if (this.state.firebase_ids[ind] !== "none")
            firebase.firestore().collection('Users').doc(this.state.firebase_ids[ind]).delete()
                .then(() => {
                    console.log("doc deleted")
                    var tempArr = this.state.firebase_ids.filter((name, index) => index !== ind);
                    this.setState({ firebase_ids: [...tempArr] });
                });
        else {
            var tempArr = this.state.firebase_ids.filter((name, index) => index !== ind);
            this.setState({ firebase_ids: [...tempArr] });
        }
    }

    renderApp = () => {
        firebase.firestore().collection('Users').get()
            .then(docs => docs.forEach(doc => {
                if (doc.data().name)
                    this.setState({ name: [...this.state.name, doc.data().name] })
                this.setState({ firebase_ids: [...this.state.firebase_ids, doc.id] })
            }));
    }

    updateFirebase = (e) => {
        e.preventDefault();
        var docId;
        firebase.firestore().collection('Users').add({ name: this.state.currName })
            .then(doc => {
                docId = doc.id;
                if (this.state.currName === "Simon" || this.state.currName === "Simon Game")
                    this.setState({ game_mode: "Simon" })
                this.setState({ name: [...this.state.name, this.state.currName] });
                this.setState({ firebase_ids: [...this.state.firebase_ids, docId] })
                this.setState({ currName: "" });
            });
    }

    render() {
        return (
            <form style={{ 'marginLeft': '20px' }} onSubmit={this.updateFirebase}>
                {this.state.name.map((name, index) => {
                    return (
                        <div key={index + "d"} style={{ 'display': 'flex', 'flexDirection': 'row' }}>
                            <h1>{name}</h1>
                            <button
                                type="button"
                                style={{ 'height': '50%', 'marginTop': '35px', 'marginLeft': '20px', 'color': 'red' }}
                                onClick={() => this.deleteName(index)}
                            >Delete</button>
                        </div>)
                })}
                <input
                    style={{ 'marginBottom': '20px' }}
                    placeholder="Enter your name"
                    type="text"
                    value={this.state.currName}
                    onChange={(event) => this.setState({ currName: event.target.value })}
                ></input>
                <button type="submit">Click me</button>
                {this.gameMode()}
            </form>
        );
    }
}

export default ChooseGame;