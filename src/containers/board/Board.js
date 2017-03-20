import React, { Component } from 'react';
import './Board.css';
import { Row, Column } from 'react-gridify';
import Modal from '../../components/modal/Modal'
import DayPicker from "react-day-picker";
import axios from 'axios';
import {UrlUpdateMember, UrlAddmember, UrlAddTeam} from '../constants/UrlConstants';
import "react-day-picker/lib/style.css";
import moment from 'moment';

class Board extends Component {

  constructor(props) {
   super(props);
   this.state = {
     currentShownMember: {},
     currentTeam: '',
     isUserModalOpen: false,
     isNewUserModalOpen: false,
     isNewTeamModalOpen: false,
     selectedDays: [],
     newMemberName: '',
     newTeamName: '',
   };
   this.userClicked = this.userClicked.bind(this);
   this.newUserClicked = this.newUserClicked.bind(this);
   this.saveNewUser = this.saveNewUser.bind(this);
 }

 handleDayClick = (day) => {

   day.setHours(0,0,0,0);

   let copyOfSelectedDays = [...this.state.selectedDays]; // 3 = 3
   let currentMember = this.state.currentShownMember;

   this.state.selectedDays.map((selectedDay, index) => {
     selectedDay.setHours(0,0,0,0);
     if (selectedDay.toString() === day.toString()) {
      copyOfSelectedDays.splice(index, 1);
    }
   });

   if(copyOfSelectedDays.length === this.state.selectedDays.length) {
       let formattedDay = moment(day).format('YYYY-MM-DD');
       this.setState({ selectedDays: [...this.state.selectedDays, day]});

       currentMember.availabilityDates.push(formattedDay);
       this.setState({ currentShownMember: currentMember});
   } else {
      currentMember.availabilityDates = [];
      currentMember.availabilityDates = copyOfSelectedDays;
      this.setState({currentShownMember: currentMember});
      this.setState({selectedDays: copyOfSelectedDays});
   }

   return axios
   .put(UrlUpdateMember, currentMember)
   .then((response) => {

   }).catch((error) => {
     console.log(error);
   });

  }

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

      const  styleClass = isAvailableToday ? { background: '#6FCF97' } : { background: '#FFB74D' };

      returnedList.push(
        <li key={currentMember._id} className="Board-list-item" id={currentMember._id} onClick={() => this.userClicked(currentMember)}>
          <div className="Board-list-item-inner" style={styleClass}>
            <span>{currentMember.name}</span>
          </div>
        </li>
      );
    }

    returnedList.push(
      <li className="Board-list-item" id={team._id} onClick={() => this.newUserClicked(team._id)}>
        <div className="Board-list-item-inner" style={{background: '#eee', color: '#999'}}>
          <span>+ Add member</span>
        </div>
      </li>
    );

    return returnedList;
  }

  newUserClicked(teamId) {
      this.setState({currentTeam: teamId, isNewUserModalOpen: true});
  }

  userClicked(currentMember) {
    this.setState({currentShownMember: currentMember, isUserModalOpen: true});

    let selectedDays = [];

    for(let i = 0; i < currentMember.availabilityDates.length; i++) {
      selectedDays[i] = new Date(currentMember.availabilityDates[i]);
    }

    this.setState({selectedDays: selectedDays});
  }

  displayUserModal(currentMember) {
    if(this.state.isUserModalOpen) {

      return(
        <Modal onExit={this.hideModal}>
          <div className="ModalHeader">
          {currentMember.name}
          </div>
          <div className="ModalBody">
          <p>Click to update available dates for this seat.</p>
          <ul>
          <DayPicker
            initialMonth={new Date()}
            selectedDays={ this.state.selectedDays }
            onDayClick={ this.handleDayClick }/>
          </ul>
          </div>
        </Modal>
      );
    }
  }

  displayNewUserModal(teamId) {
    if(this.state.isNewUserModalOpen) {

      return(
        <Modal onExit={this.hideModal} height="250px">
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

  newTeamChanged = (e) => {
    this.setState({
      newTeamName: e.target.value
    });
  }

  saveNewTeam = () => {
    return axios.
      post(UrlAddTeam, {
        teamName: this.state.newTeamName,
        members: []
      })
      .then((response) => {

      })
      .catch((err) => {
        console.log(err);
      })

      this.hideModal();
  }

  displayNewTeamModal() {
    this.setState({
      isNewTeamModalOpen: true
    });
  }

  renderNewTeamModal = () => {
    if (this.state.isNewTeamModalOpen) {
      return(
        <Modal onExit={this.hideModal} height="250px">
          <div className="ModalHeader">
          Add new Team
          </div>
          <div className="ModalBody">
          <p>Type in the name of the new team</p>
          <input type="text" placeholder="Enter team name.." onChange={this.newTeamChanged}/>
          <button onClick={this.saveNewTeam}>Save</button>
          </div>
        </Modal>
      );
    }
  }

  saveNewUser = () => {
    axios.put(`${UrlAddmember}${this.state.currentTeam}`,
      {
        name: this.state.newMemberName,
        availabilityDates: []
      }
    ).then((response) => {
    }).catch((error) => {
    console.log(error);
    });

    this.hideModal();
  }

  newUserNameChanged = (event) => {
    this.setState({newMemberName: event.target.value});
  }

  hideModal = () => {
    this.setState({isUserModalOpen: false,
      isNewUserModalOpen: false,
      newMemberName: '',
      currentTeam: '',
      isNewTeamModalOpen: false,
      newTeamName: ''
    });
  }

  render() {

    const dateDefined = new Date(this.props.originalDate);
    return (
    <div className="Board">
      {this.displayUserModal(this.state.currentShownMember)}
      {this.displayNewUserModal(this.state.currentTeam)}
      {this.renderNewTeamModal()}
      <Row maxWidth="100%">
        <Column>
          <div className="Board-inner-addTeam" onClick={() => this.displayNewTeamModal()}>+ Add team</div>
        </Column>
      </Row>
      <Row maxWidth="100%">
        <Column>
        <div className="Board-inner">
          {
             this.props.seats.map((team, index) => {
              let returnedList = [];

                returnedList.push(
                  <Column large="6" key={team._id}>
                  <div className="Board-inner-team">
                    <span className="Board-inner-team-name">{team.teamName}</span>
                      <ul className="Board-list">
                        {this.createTeamLabels(team, dateDefined)}
                      </ul>
                  </div>
                  </Column>
                );
              return returnedList;
          })
          }
        </div>
        </Column>
      </Row>
    </div>
    );
  }
}

export default Board;
