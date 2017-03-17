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

      const  styleClass = isAvailableToday ? { background: '#6FCF97' } : { background: '#FFB74D' };

      returnedList.push(
        <li key={Math.random()} className="Board-list-item">
          <div className="Board-list-item-inner" style={styleClass}>
            <span>{currentMember.name}</span>
          </div>
        </li>
      );
    }
    return returnedList;
  }

  render() {

    const dateDefined = new Date(this.props.originalDate);

    return (
    <div className="Board">
      <Row maxWidth="100%">
        <div className="Board-inner">
          {
            Seats.map((team, index) => {
              let returnedList = [];

                returnedList.push(
                  <Column large="6">
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
