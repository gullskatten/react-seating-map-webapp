import React, { Component } from 'react';
import './Board.css';
import { Row, Column } from 'react-gridify';
import Modal from '../../components/modal/Modal'
import DayPicker from "react-day-picker";
import "react-day-picker/lib/style.css"

class Board extends Component {

  constructor(props) {
   super(props);
   this.userClicked = this.userClicked.bind(this);
   this.state = {currentShownMember: {}, isModalOpen: false};
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
    return returnedList;
  }

  userClicked(currentMember) {
    this.setState({currentShownMember: currentMember, isModalOpen: true});
  }

  displayUserModal(currentMember) {
    if(this.state.isModalOpen) {

      let selectedDays = [];

      for(let i = 0; i < currentMember.availabilityDates.length; i++) {
        selectedDays[i] = new Date(currentMember.availabilityDates[i]);
      }

      return(
        <Modal onExit={this.hideModal}>
          <div className="ModalHeader">
          {currentMember.name}
          </div>
          <div className="ModalBody">
          <p>Click to update available dates for this seat.</p>
          <ul>
          <DayPicker
            initialMonth= {new Date()}
            selectedDays={ selectedDays }
            onDayClick={ this.handleDayClick }/>
          </ul>
          </div>
        </Modal>
      );
    }
  }

  hideModal = () => {
    this.setState({isModalOpen: false});
  }

  render() {

    const dateDefined = new Date(this.props.originalDate);

    return (
    <div className="Board">
      {this.displayUserModal(this.state.currentShownMember)}
      <Row maxWidth="100%">
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
      </Row>
    </div>
    );
  }
}

export default Board;
