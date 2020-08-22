import React, { Component } from 'react';
import "./SimonGame.css"
import { BrowserRouter, Route, Link, Router } from "react-router-dom"

class SimonGame extends Component {
  constructor(props) {
    super();
    this.state = {
      yellowCir: "yellow",
      redCir: "red",
      blueCir: "blue",
      greenCir: "green",
      disabled: true,
      score: 0,
      currAvg: [0, 0],
      totAvg: [0, 0],
      prevTime: 0,
      level: 1,
      levelVis: 'hidden'
    }
    this.firstM = 1.5;
    this.secM = 50;
    this.firstLevel = 500;
  }

  gameOn = () => {
    clearTimeout(this.a)
    clearTimeout(this.b)
    clearTimeout(this.c);
    clearTimeout(this.d);
    this.simonArr = new Array();
    this.guessArr = new Array();
    this.setState({ score: 0 });
    this.setState({ currAvg: [0, 0] });
    this.setState({ totAvg: [0, 0] });
    this.setState({ level: 1 });
    this.intervalLevel = this.firstLevel;
    this.currLevel = this.intervalLevel;
    this.setState({ yellowCir: "white", redCir: "white", greenCir: "white", blueCir: "white" })
    this.nextTurn();
  }

  nextTurn = () => {
    var newSimonElement = Math.floor(Math.random() * 4);
    this.simonArr = [...this.simonArr, newSimonElement]
    // console.log(this.simonArr);
    var i = 0;
    var newinterv = () => {
      if (i < this.simonArr.length) {
        if (this.currLevel === this.intervalLevel) {
          this.currLevel = this.intervalLevel / 5;
          this.setState({ redCir: "white", blueCir: "white", greenCir: "white", yellowCir: "white" });
        }
        else {
          if (this.currLevel === this.intervalLevel / 5)
            this.currLevel = this.intervalLevel;
          switch (this.simonArr[i]) {
            case 0:
              this.setState({ redCir: "red", blueCir: "white", greenCir: "white", yellowCir: "white" });
              break;
            case 1:
              this.setState({ yellowCir: "yellow", blueCir: "white", greenCir: "white", redCir: "white" });
              break;
            case 2:
              this.setState({ greenCir: "green", blueCir: "white", redCir: "white", yellowCir: "white" });
              break;
            case 3:
              this.setState({ blueCir: "blue", greenCir: "white", redCir: "white", yellowCir: "white" });
              break;
          }
          i++;
        }
        this.b = setTimeout(newinterv, this.currLevel);
      }
      else {
        clearTimeout(this.a);
        clearTimeout(this.b);
        this.setState({ blueCir: "white", yellowCir: "white", redCir: "white", greenCir: "white" });
        this.setState({ prevTime: new Date().getTime() }, this.playerTurn);
      }
    }
    this.a = setTimeout(newinterv, this.currLevel);
  }

  playerTurn = () => {
    this.setState({ disabled: false })
  }

  chooseColor = (colorClicked) => {
    var colorNum;
    clearTimeout(this.c);
    switch (colorClicked) {
      case 'r':
        this.setState({ redCir: "red", blueCir: "white", greenCir: "white", yellowCir: "white" });
        colorNum = 0;
        break;
      case 'y':
        this.setState({ yellowCir: "yellow", blueCir: "white", greenCir: "white", redCir: "white" });
        colorNum = 1;
        break;
      case 'g':
        this.setState({ greenCir: "green", blueCir: "white", redCir: "white", yellowCir: "white" });
        colorNum = 2;
        break;
      case 'b':
        this.setState({ blueCir: "blue", greenCir: "white", redCir: "white", yellowCir: "white" });
        colorNum = 3;
        break;
    }
    this.c = setTimeout(() => this.setState({ blueCir: "white", greenCir: "white", redCir: "white", yellowCir: "white" }), 500);
    return colorNum;
  }

  simonClick = (colorClicked) => {
    if (this.state.disabled)
      return;
    var now = new Date().getTime();
    var calc;
    if (this.state.currAvg[1] !== 0) {
      calc = ((this.state.currAvg[0] * (this.state.currAvg[1] - 1)) + ((now - this.state.prevTime) / 1000)) / this.state.currAvg[1];
      // console.log(calc)
      // console.log("calc: (" + this.state.currAvg[0] + " * " + (this.state.currAvg[1] - 1) + " + " + ((now - this.state.prevTime) / 1000) + ") / " + this.state.currAvg[1] + " = " + calc);
      this.setState({ currAvg: [calc, this.state.currAvg[1] + 1] }, this.setState({ prevTime: now }));
    }
    else {
      calc = (now - this.state.prevTime) / 1000;
      this.setState({ currAvg: [calc, 2] }, this.setState({ prevTime: now }));
    }
    var colorNum = this.chooseColor(colorClicked);

    if (this.guessArr.length + 1 === this.simonArr.length) {
      this.setState({ disabled: true });
      this.guessArr = new Array;
      if (colorNum !== this.simonArr[this.simonArr.length - 1]) {
        alert("You Lost!\nYour socre is: " + Math.floor(this.state.score * (this.secM / (calc + 1))) + "\nLevel: " + this.state.level);
        this.setState({ blueCir: "blue", yellowCir: "yellow", redCir: "red", greenCir: "green" });
      }
      else {
        console.log(Math.floor((this.state.score + 1) * (50 / (calc + 1))) + " , " + (100000 / this.intervalLevel))
        if (Math.floor((this.state.score + 1) * (this.secM / (calc + 1))) >= (100000 / this.intervalLevel)) {
          this.intervalLevel /= this.firstM;
          this.currLevel = this.intervalLevel;
          this.setState({ level: this.state.level + 1 });
          this.setState({ levelVis: 'visible' });
          setTimeout(() => this.setState({ levelVis: 'hidden' }), 3000);
        }
        this.setState({ score: this.state.score + 1 });
        this.d = setTimeout(this.nextTurn, 700);
      }
    }
    else {
      // console.log(Math.floor(this.state.score * (50 / (calc + 1))) + " , " + (100000 / this.intervalLevel))
      if (Math.floor((this.state.score) * (this.secM / (calc + 1))) >= (100000 / this.intervalLevel)) {
        this.intervalLevel /= this.firstM;
        this.currLevel = this.intervalLevel;
      }
      this.guessArr = [...this.guessArr, colorNum];
      if (this.guessArr[this.guessArr.length - 1] !== this.simonArr[this.guessArr.length - 1]) {
        alert("You Lost!\nYour socre is: " + Math.floor(this.state.score * (this.secM / (calc + 1))) + "\nLevel: " + this.state.level);
        this.setState({ blueCir: "blue", yellowCir: "yellow", redCir: "red", greenCir: "green" });
        this.setState({ disabled: true });
      }
    }
  }

  render() {
    return (
      <div style={{ 'textAlign': "center" }}>
        <a style={{ 'position': 'relative', 'right': '700px' }} href="/home">back to home</a>
        <h1 style={{ 'lineHeight': '0px' }}><u><b>Simon Game!</b></u></h1>
        <h3 style={{ 'visibility': this.state.levelVis }}>Level up!</h3>
        {/* {this.isLevel()} */}
        <div style={{ 'display': 'flex', 'flexDirection': 'row', 'justifyContent': 'center' }}>
          <div
            className="firstCircle"
            style={{ 'backgroundColor': this.state.redCir }}
            onClick={() => this.simonClick("r")}
          >
          </div>
          <div
            className="secondCircle"
            style={{ 'backgroundColor': this.state.yellowCir }}
            onClick={() => this.simonClick("y")}
          ></div>
        </div>

        <div style={{ 'display': 'flex', 'flexDirection': 'row', 'justifyContent': 'center' }}>
          <div
            className="thirdCircle"
            style={{ 'backgroundColor': this.state.greenCir }}
            onClick={() => this.simonClick("g")}>
          </div>
          <div
            className="fourthCircle"
            style={{ 'backgroundColor': this.state.blueCir }}
            onClick={() => this.simonClick("b")}>
          </div>
        </div>
        <button
          onClick={this.gameOn}
          style={{ 'marginTop': '20px' }}
        >Start Game!</button>
        <h2>Level: {this.state.level}</h2>
        <h1 className="score">Score: {Math.floor(this.state.score * (this.secM / (this.state.currAvg[0] + 1)))}</h1>
      </div>
    );
  }
}

export default SimonGame;