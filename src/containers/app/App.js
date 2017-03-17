import React, { Component } from 'react';
import Header from '../header/Header';
import Sidebar from '../sidebar/Sidebar'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: true
    };
  }

  render() {
    const isMenuOpen = this.state.isMenuOpen ? "DisplayMenu" : "";
    return (
      <div>
        <Header onClick={this.triggerMenu}/>
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
