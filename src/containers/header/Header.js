import './Header.css';
import React, { Component } from 'react';
import Title from '../../components/title/Title';
import FontAwesome from 'react-fontawesome';
import Modal from '../../components/modal/Modal';
import { UrlAddTeam, UrlAddFloor } from '../constants/UrlConstants';
import axios from 'axios';
import { inject, observer } from 'mobx-react';

@inject('store')
@observer
class Header extends Component {
  newTeamLocationChanged = e => {
    this.props.store.newTeamLocation = e.target.value;
  };

  newTeamChanged = e => {
    this.props.store.newTeamName = e.target.value;
  };

  saveNewTeam = () => {
    return axios
      .post(`${UrlAddTeam}`, {
        teamName: this.props.store.newTeamName,
        floor_id: this.props.store.currentFloor._id,
        members: [],
        size: this.props.store.newTeamSize,
        x: 0,
        y: 0
      })
      .then(response => {
        this.props.store.fetchTeams(this.props.store.currentFloor._id);
        this.props.store.newTeamSize = '50%';
        this.props.store.hideModal();
      })
      .catch(err => {
        console.log(err);
      });
  };

  displayNewTeamModal() {
    this.props.store.isNewTeamModalOpen = true;
  }

  displayNewFloorModal() {
    this.props.store.isNewFloorModalOpen = true;
  }

  onSizeSelected = e => {
    this.props.store.newTeamSize = e.target.value;
  };

  renderNewTeamModal = () => {
    if (this.props.store.isNewTeamModalOpen) {
      return (
        <Modal onExit={this.props.store.hideModal} height="210px">
          <div className="ModalHeader">
            Add new Team
          </div>
          <div className="ModalBody">
            <p>Type in the name of the new team</p>
            <input
              type="text"
              placeholder="Enter team name.."
              onChange={this.newTeamChanged}
            />
            <select onChange={this.onSizeSelected}>
              <option value="50%">2x2</option>
              <option value="25%">4x4</option>
              <option value="33.3333336%">3x3</option>
            </select>
            <button onClick={this.saveNewTeam}>Save</button>
          </div>
        </Modal>
      );
    }
  };

  renderNewFloorModal() {
    if (this.props.store.isNewFloorModalOpen) {
      return (
        <Modal onExit={this.props.store.hideModal} height="210px">
          <div className="ModalHeader">
            Add a new floor
          </div>
          <div className="ModalBody">
            <p>Type in the name of the floor</p>
            <input
              type="text"
              placeholder="Enter a name.. (e.g. Floor 1.. Section A..)"
              onChange={this.newFloorNameChanged}
            />
            <button onClick={this.saveNewFloor}>Save</button>
          </div>
        </Modal>
      );
    }
  }

  newFloorNameChanged = event => {
    this.props.store.newFloorName = event.target.value;
  };

  saveNewFloor = () => {
    axios
      .post(`${UrlAddFloor}`, {
        name: this.props.store.newFloorName
      })
      .then(response => {
        this.props.store.fetchAllFloors();
        this.props.store.currentFloor = response.data;
        this.props.store.hideModal();
        //TODO: this.props.store.goToSlide(this.props.store.floors.length + 1);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const toggleMenuIcon = this.props.store.isMenuOpen ? 'remove' : 'bars';

    return (
      <header className="Header">
        {this.renderNewTeamModal()}
        {this.renderNewFloorModal()}
        <Title title={this.props.store.title} />
        <span onClick={this.props.onClick}>
          <FontAwesome name={toggleMenuIcon} className="icon" />
        </span>
        <div
          className="Header-addFloor"
          onClick={() => this.displayNewFloorModal()}
        >
          + New floor
        </div>
        <div
          className="Header-addTeam"
          onClick={() => this.displayNewTeamModal()}
        >
          + New team
        </div>
      </header>
    );
  }
}

export default Header;
