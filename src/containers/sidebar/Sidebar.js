import React, { Component } from 'react';
import './Sidebar.css';
import MenuList from '../../components/menulist/MenuList';
import { inject, observer } from 'mobx-react';

@inject("store")
@observer
class Sidebar extends Component {
  getTomorrow() {
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);
    tomorrow.setHours(0,0,0,0);
    return tomorrow;
  }

  getToday() {
    var today = new Date();
    today.setHours(0,0,0,0);
    return today;
  }

  render() {
    return (
      <div className={`Sidebar ${this.props.toggleClass}`}>
      <MenuList seats={this.props.seats} today={this.getToday()} tomorrow={this.getTomorrow()}/>
      </div>
    );
  }
}

export default Sidebar;
