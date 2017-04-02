import "react-day-picker/lib/style.css";
import React, { Component } from 'react';
import './Board.css';
import Modal from '../../components/modal/Modal'
import DayPicker from "react-day-picker";
import axios from 'axios';
import {UrlAddmember, UrlDeleteMember} from '../constants/UrlConstants';
import Masonry from 'react-masonry-component';
import { inject, observer } from 'mobx-react';

@inject("store")
@observer
class Board extends Component {

  createTeamLabels(team, dateDefined) {
    let returnedList = [];

    for(let memberCount = 0; memberCount < team.members.length; memberCount++) {

      let currentMember = team.members[memberCount];
      let isAvailableToday = false;
      for(let i = 0; i < currentMember.availabilityDates.length; i++) {

         const comparedDate = new Date(currentMember.availabilityDates[i])

         comparedDate.setHours(0,0,0,0);

           if(dateDefined.getTime() === comparedDate.getTime()) {
             isAvailableToday = true;
           }
      }

      const  styleClass = isAvailableToday ? { background: '#009688', color: '#fff' } : { background: '#FFAB40' };

      returnedList.push(
        <li key={currentMember._id} className="Board-list-item" id={currentMember._id} onClick={() => this.userClicked(currentMember)}>
          <div className="Board-list-item-inner" style={styleClass}>
            <span>{currentMember.name}</span>
          </div>
        </li>
      );
    }

    returnedList.push(
      <li className="Board-list-item" key={team._id} id={team._id} onClick={() => this.newUserClicked(team._id)}>
        <div className="Board-list-item-inner" style={{background: '#eee', color: '#999'}}>
          <span>+ Add member</span>
        </div>
      </li>
    );

    return returnedList;
  }

  newUserClicked = (teamId) => {
      this.props.store.currentTeam = teamId;
      this.props.store.isNewUserModalOpen = true;
  }

  userClicked = (currentMember) => {
    this.props.store.currentShownMember = currentMember;
    this.props.store.isUserModalOpen = true;

    let selectedDays = [];

    for(let i = 0; i < currentMember.availabilityDates.length; i++) {
      selectedDays[i] = new Date(currentMember.availabilityDates[i]);
    }

    this.props.store.selectedDays = selectedDays;
  }

  displayUserModal(currentMember) {
    if(this.props.store.isUserModalOpen) {
      return(
        <Modal onExit={this.props.store.hideModal}>
          <div className="ModalHeader">
          {currentMember.name}
          </div>
          <div className="ModalBody">
          <p>Click to update available dates for this seat.</p>
          <ul>
          <DayPicker
            initialMonth={new Date()}
            selectedDays={ this.props.store.selectedDays }
            onDayClick={ this.props.store.handleDayClick }/>
          </ul>
          <button className="delete" style={{background: '#DD2C00'}} onClick={() => this.deleteUser()}>
          Delete {currentMember.name}?</button>
          </div>
        </Modal>
      );
    }
  }

  deleteUser = () => {
    const isConfirmed = confirm(`Are you sure you want to delete ${this.props.store.currentShownMember.name}?`);
    if(isConfirmed) {
      axios.delete(`${UrlDeleteMember}${this.props.store.currentShownMember.team_id}/${this.props.store.currentShownMember._id}`
      ).then((response) => {
            this.props.store.fetchAllTeams();
            this.props.store.hideModal();

      }).catch((error) => {
      console.log(error);
      });
    } else {
      return false;
    }
  }

  displayNewUserModal(teamId) {
    if(this.props.store.isNewUserModalOpen) {
      return(
        <Modal onExit={this.props.store.hideModal} height="250px">
          <div className="ModalHeader">
          Add new Team Member
          </div>
          <div className="ModalBody">
          <p>Type in the name of the new member</p>
          <input type="text" placeholder="Enter name.." onChange={this.newUserNameChanged}/>
          <button onClick={this.saveNewUser}>Save</button>
          </div>
        </Modal>
      );
    }
  }

  saveNewUser = () => {

    axios.put(`${UrlAddmember}${this.props.store.currentTeam}`,
      {
        name: this.props.store.newMemberName,
        availabilityDates: [],
        team_id: this.props.store.currentTeam
      }
    ).then((response) => {
        this.props.store.fetchAllTeams();
        this.props.store.hideModal();
    }).catch((error) => {
    console.log(error);
    });
  }

  newUserNameChanged = (event) => {
    this.props.store.newMemberName = event.target.value;
  }

  render() {

    const dateDefined = new Date(this.props.originalDate);
    const toggleBoardClass = this.props.store.isMenuOpen ? '' : 'Board-fullWidth';
    return (
    <div className={`Board ${toggleBoardClass}`}>
      {this.displayUserModal(this.props.store.currentShownMember)}
      {this.displayNewUserModal(this.props.store.currentTeam)}
      <Masonry
          className={'Board-inner'} // default ''
          elementType={'div'} // default 'div'
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
    >
       {
             this.props.seats.map((team, index) => {
              let returnedList = [];

                returnedList.push(
                  <div className="Board-inner-team" key={index}>
                    <span className="Board-inner-team-name">{team.teamName}</span>
                    <span className="Board-inner-team-location">{team.location}</span>
                      <ul className="Board-list">
                        {this.createTeamLabels(team, dateDefined)}
                      </ul>
                  </div>
                );
              return returnedList;
          })
          }
            </Masonry>
        </div>
    );
  }
}

export default Board;
