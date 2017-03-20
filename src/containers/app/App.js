import React, { Component } from 'react';
import { UrlFindAllMembers } from '../constants/UrlConstants';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar'
import Board from '../board/Board'
import axios from 'axios';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: true,
      seats: []
    };
  }

  componentDidMount() {
    this.fetchAllTeams();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.seats !== nextState.seats) {
      this.fetchAllTeams();
    }
  }

  fetchAllTeams() {
    return axios.get(UrlFindAllMembers).then((response) => {
      this.setState({
        seats: response.data
      });

    }).catch((error) => {

    });
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
        <Board seats={this.state.seats} originalDate={this.getToday()}/>
        <Sidebar seats={this.state.seats} toggleClass={isMenuOpen}/>
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
