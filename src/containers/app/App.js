import React, { Component } from 'react';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar'
import Board from '../board/Board'

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: true
    };
  }

  getToday() {
    var today = new Date();
    today.setHours(0,0,0,0);
    return today;
  }


  render() {
    const isMenuOpen = this.state.isMenuOpen ? "DisplayMenu" : "";
    return (
      <div>
        <Header onClick={this.triggerMenu}/>
        <Board originalDate={this.getToday()}/>
        <Sidebar toggleClass={isMenuOpen}/>
      </div>
    );
  }
  triggerMenu = () => {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen
    });
  }
}

export default App;
