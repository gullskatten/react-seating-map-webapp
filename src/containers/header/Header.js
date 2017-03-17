import React, { Component } from 'react';
import Title from '../../components/title/Title'
import './Header.css';
import FontAwesome from 'react-fontawesome';
class Header extends Component {
  render() {
    return (
      <header className="Header">
        <Title title="D4 - Seating Map"/>
        <span onClick={this.props.onClick}>
         <FontAwesome name='ellipsis-h' className="icon"/>
        </span>
      </header>
    );
  }
}

export default Header;
