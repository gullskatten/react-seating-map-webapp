import React, { Component } from 'react';
import './Board.css';
import { Row, Column } from 'react-gridify'
import Seats from '../../containers/testdata/Seats';

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

      const  styleClass = isAvailableToday ? 'green' : 'blue';
      returnedList.push(
        <Row>
          <Column large="12">
            <Row>
              <Column large="4">
            <li key={Math.random()} >
              <span style={{color:styleClass}}>{currentMember.name}</span>
            </li>
             </Column>
            </Row>
          </Column>
         </Row>
         );
    }
    return returnedList;
  }

  render() {

    const dateDefined = new Date(this.props.originalDate);

    return (
    <div className="Board">
    <Row maxWidth="100%">

    {
      Seats.map((team, index) => {
        let returnedList = [];

          returnedList.push(
            <Column large="6">
            <span>{team.teamName}</span>

              {this.createTeamLabels(team, dateDefined)}
            </Column>
          );
        return returnedList;
    })
    }
    </Row>
    </div>
    );
  }
}

export default Board;
