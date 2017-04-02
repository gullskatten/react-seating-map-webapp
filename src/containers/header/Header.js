import './Header.css';
import React, { Component } from 'react';
import Title from '../../components/title/Title'
import FontAwesome from 'react-fontawesome';
import Modal from '../../components/modal/Modal'
import {UrlAddTeam} from '../constants/UrlConstants';
import axios from 'axios';
import { inject, observer } from 'mobx-react';

@inject("store")
@observer
class Header extends Component {

  newTeamLocationChanged = (e) => {
      this.props.store.newTeamLocation = e.target.value;
  }

  newTeamChanged = (e) => {
    this.props.store.newTeamName = e.target.value;
  }

  saveNewTeam = () => {
    this.props.store.newTeamLocation = this.props.store.newTeamLocation == ''
      ? "D4 - Øst (Funksjonell + Markedsoperasjon)"
      : this.props.store.newTeamLocation;

    return axios.
      post(UrlAddTeam, {
        teamName: this.props.store.newTeamName,
        location: this.props.store.newTeamLocation,
        members: []
      })
      .then((response) => {
        this.props.store.fetchAllTeams();
        this.props.store.hideModal();
      })
      .catch((err) => {
        console.log(err);
      })
  }

  displayNewTeamModal() {
    this.props.store.isNewTeamModalOpen = true;
  }

  renderNewTeamModal = () => {
    if (this.props.store.isNewTeamModalOpen) {
      return(
        <Modal onExit={this.props.store.hideModal} height="275px">
          <div className="ModalHeader">
          Add new Team
          </div>
          <div className="ModalBody">
          <p>Type in the name of the new team</p>
          <input type="text" placeholder="Enter team name.." onChange={this.newTeamChanged}/>
          <select className="select-style" onChange={this.newTeamLocationChanged}>
            <option value="D4 - Øst (Funksjonell + Markedsoperasjon)">
            D4 - Øst (Funksjonell + Markedsoperasjon)
            </option>
            <option value="D4 - Vest (Admin., Infrastruktur & Edielportal)">
            D4 - Vest (Admin., Infrastruktur & Edielportal)
                        </option>
            <option value="D4 - Midt (Prosjekt, Test & Migrering)">
            D4 - Midt (Prosjekt, Test & Migrering)
                        </option>
          </select>
          <button onClick={this.saveNewTeam}>Save</button>
          </div>
        </Modal>
      );
    }
  }

  render() {
    const toggleMenuIcon = this.props.store.isMenuOpen ? 'remove' : 'bars';

    return (
      <header className="Header">
        {this.renderNewTeamModal()}
      <Title title={this.props.store.title}/>
      <span onClick={this.props.onClick}>
      <FontAwesome name={toggleMenuIcon} className="icon"/>
      </span>
      <div className="Header-addTeam" onClick={() => this.displayNewTeamModal()}>+ New team</div>
      </header>
    );
  }
}

export default Header;
