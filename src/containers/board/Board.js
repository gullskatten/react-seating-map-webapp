import 'react-day-picker/lib/style.css';
import React, { Component } from 'react';
import './Board.css';
import Modal from '../../components/modal/Modal';
import DayPicker from 'react-day-picker';
import axios from 'axios';
import {
  UrlUpdateMember,
  UrlAddmember,
  UrlAddFloor,
  UrlDeleteMember,
  UrlDeleteTeam
} from '../constants/UrlConstants';
import Masonry from 'react-masonry-component';
import { toJS as mobxToJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import Slider from 'react-slick';
import { ArrowLeft, ArrowRight } from '../../components/arrows/Arrow';

@inject('store')
@observer
class Board extends Component {
  createTeamLabels(team, dateDefined) {
    let returnedList = [];

    for (
      let memberCount = 0;
      memberCount < team.members.length;
      memberCount++
    ) {
      let currentMember = team.members[memberCount];
      let isAvailableToday = false;

      for (let i = 0; i < currentMember.availabilityDates.length; i++) {
        const comparedDate = new Date(currentMember.availabilityDates[i]);

        comparedDate.setHours(0, 0, 0, 0);

        if (dateDefined.getTime() === comparedDate.getTime()) {
          isAvailableToday = true;
        }
      }

      const styleClass = isAvailableToday
        ? { background: '#009688', color: '#fff' }
        : { background: '#FFAB40' };

      returnedList.push(
        <li
          key={currentMember._id}
          className="Board-list-item"
          id={currentMember._id}
          onClick={() => this.userClicked(currentMember)}
        >
          <div className="Board-list-item-inner" style={styleClass}>
            <span><i className="fa fa-user" /> {currentMember.name}</span>
          </div>
        </li>
      );
    }

    returnedList.push(
      <li
        className="Board-list-item"
        key={team._id}
        id={team._id}
        onClick={() => this.newUserClicked(team._id)}
      >
        <div
          className="Board-list-item-inner"
          style={{ background: '#eee', color: '#999' }}
        >
          <span>+ Add member</span>
        </div>
      </li>
    );

    return returnedList;
  }

  newUserClicked = teamId => {
    this.props.store.currentTeam = teamId;
    this.props.store.isNewUserModalOpen = true;
  };

  userClicked = currentMember => {
    this.props.store.currentShownMember = currentMember;
    this.props.store.isUserModalOpen = true;

    let selectedDays = [];

    for (let i = 0; i < currentMember.availabilityDates.length; i++) {
      selectedDays[i] = new Date(currentMember.availabilityDates[i]);
    }

    this.props.store.selectedDays = selectedDays;
  };

  displayUserModal(currentMember) {
    if (this.props.store.isUserModalOpen) {
      const buttonStyles = {
        background: '#009688',
        border: '0.05rem solid white',
        fontSize: '10px',
        marginTop: '0px',
        marginLeft: '10px',
        padding: '5px',
        ...(this.props.store.isUserEditOn
          ? { display: 'inline-block' }
          : { display: 'none' })
      };
      console.log(buttonStyles);
      return (
        <Modal onExit={this.props.store.hideModal}>
          <div className="ModalHeader">
            <i className="fa fa-pencil" onClick={() => this.focusUserName()} />
            <span
              ref={memberName => {
                this.memberName = memberName;
              }}
              contentEditable="true"
              onFocus={this.currentMemberNameFocus}
            >

              {currentMember.name}
            </span>
            <button
              style={buttonStyles}
              onClick={() => this.updateUser(currentMember)}
            >
              Update
            </button>
          </div>
          <div className="ModalBody">
            <p>Click to update available dates for this seat.</p>
            <ul>
              <DayPicker
                initialMonth={new Date()}
                selectedDays={this.props.store.selectedDays}
                onDayClick={this.props.store.handleDayClick}
              />
            </ul>
            <button
              className="delete"
              style={{ background: '#DD2C00' }}
              onClick={() => this.deleteUser()}
            >
              Delete {currentMember.name}?
            </button>
          </div>
        </Modal>
      );
    }
  }

  focusUserName = () => {
    this.memberName.focus();
  };

  updateUser = currentMember => {
    currentMember.name = this.memberName.innerText;

    console.log(this.memberName.innerText);
    return axios
      .put(UrlUpdateMember, currentMember)
      .then(response => {
        this.props.store.fetchTeams(this.props.store.currentFloor._id);
        this.props.store.isUserEditOn = false;
      })
      .catch(error => {
        console.log(error);
      });
  };

  currentMemberNameFocus = e => {
    this.props.store.isUserEditOn = true;
  };

  deleteUser = () => {
    const isConfirmed = confirm(
      `Are you sure you want to delete ${this.props.store.currentShownMember.name}?`
    );
    if (isConfirmed) {
      axios
        .delete(
          `${UrlDeleteMember}${this.props.store.currentShownMember.team_id}/${this.props.store.currentShownMember._id}`
        )
        .then(response => {
          this.props.store.fetchTeams(this.props.store.currentFloor._id);
          this.props.store.hideModal();
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      return false;
    }
  };

  displayNewUserModal(teamId) {
    if (this.props.store.isNewUserModalOpen) {
      return (
        <Modal onExit={this.props.store.hideModal} height="250px">
          <div className="ModalHeader">
            Add new Team Member
          </div>
          <div className="ModalBody">
            <p>Type in the name of the new member</p>
            <input
              type="text"
              placeholder="Enter name.."
              onChange={this.newUserNameChanged}
            />
            <button onClick={this.saveNewUser}>Save</button>
          </div>
        </Modal>
      );
    }
  }

  saveNewUser = () => {
    axios
      .put(`${UrlAddmember}${this.props.store.currentTeam}`, {
        name: this.props.store.newMemberName,
        availabilityDates: [],
        team_id: this.props.store.currentTeam
      })
      .then(response => {
        this.props.store.fetchTeams(this.props.store.currentFloor._id);
        this.props.store.hideModal();
      })
      .catch(error => {
        console.log(error);
      });
  };

  newUserNameChanged = event => {
    this.props.store.newMemberName = event.target.value;
  };

  handleDeleteTeam(team) {
    const areYouSure = confirm('Are you sure you want to delete this team?');
    if (areYouSure) {
      return axios
        .delete(`${UrlDeleteTeam}/${team._id}`)
        .then(response => {
          this.props.store.fetchTeams(this.props.store.currentFloor._id);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      return false;
    }
  }

  handleNewFloorClicked() {
    this.props.store.isNewFloorModalOpen = true;
  }

  displayNewFloorModal() {
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
      })
      .catch(error => {
        console.log(error);
      });
  };

  nextClick = e => {
    this.props.store.currentFloorIndex = e;
    this.props.store.currentFloor = this.props.store.floors[e];
    this.props.store.teams = this.props.store.floors[e].teams;
  };

  render() {
    if (this.props.store.floors.length === 0) {
      const toggleBoardClass = this.props.store.isMenuOpen
        ? ''
        : 'Board-fullWidth';
      const dynamicWidth = this.props.store.isMenuOpen
        ? 'calc(100vw - 300px)'
        : '100%';
      const centerStyle = {
        height: '100vh',
        width: dynamicWidth,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      };
      return (
        <div className={`Board ${toggleBoardClass}`} style={centerStyle}>
          {this.displayNewFloorModal()}
          <span style={{ fontWeight: 300, fontSize: 24 }}>
            Wow, it is empty here..
          </span>
          <button onClick={() => this.handleNewFloorClicked()}>
            Create a new floor
          </button>
        </div>
      );
    } else {
      const dateDefined = new Date(this.props.originalDate);
      const toggleBoardClass = this.props.store.isMenuOpen
        ? ''
        : 'Board-fullWidth';
      const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        nextArrow: <ArrowRight />,
        prevArrow: <ArrowLeft />,
        afterChange: this.nextClick,
        slickGoTo: this.props.store.goToSlide
      };
      return (
        <div className={`Board ${toggleBoardClass}`}>
          {this.displayUserModal(this.props.store.currentShownMember)}
          {this.displayNewUserModal(this.props.store.currentTeam)}

          <Slider {...settings}>
            {this.props.floors.map((floor, index) => {
              return (
                <div>
                  <span className="Board-inner-floorName">{floor.name}</span>
                  <div className="Board-inner-cheat-card">
                    <span>
                      A
                      {' '}
                      <span className="Board-inner-green-box">Green Box</span>
                      {' '}
                      indicates that the seat is available today.
                    </span>
                  </div>
                  <div className="floor" key={index}>
                    <Masonry
                      className={'Board-inner'} // default ''
                      elementType={'div'} // default 'div'
                      disableImagesLoaded={false} // default false
                      updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                    >
                      {floor.teams.map((team, index) => {
                        const teamData = mobxToJS(team);
                        return (
                          <div className="Board-inner-team" key={index}>
                            <span className="Board-inner-team-name">
                              <span
                                onClick={() => this.handleDeleteTeam(teamData)}
                                className="Board-inner-team-delete"
                              >
                                <i className="fa fa-trash-o" /> Delete team
                              </span>
                              <i className="fa fa-users" />
                              &nbsp;{teamData.teamName}
                            </span>
                            <span className="Board-inner-team-location">
                              {teamData.location}
                            </span>
                            <ul className="Board-list">
                              {this.createTeamLabels(teamData, dateDefined)}
                            </ul>
                          </div>
                        );
                      })}
                    </Masonry>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      );
    }
  }
}

export default Board;
