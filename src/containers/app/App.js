import React, { Component } from 'react';
import { UrlFindAllMembers } from '../constants/UrlConstants';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar'
import Board from '../board/Board'
import axios from 'axios';
import './App.css';
import { inject, observer } from 'mobx-react';

@inject("store")
@observer
class App extends Component {

  componentDidMount() {
    this.props.store.fetchAllTeams();
  }

  getToday() {
    var today = new Date();
    today.setHours(0,0,0,0);
    return today;
  }


  render() {
    const isMenuOpen = this.props.store.isMenuOpen ? "DisplayMenu" : "";
    return (
      <div>
        <Header onClick={() => this.props.store.toggleMenu()}/>
        <Board seats={this.props.store.seats} originalDate={this.getToday()}/>
        <Sidebar seats={this.props.store.seats} toggleClass={isMenuOpen}/>
      </div>
    );
  }
}

export default App;
