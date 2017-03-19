import React from 'react';
import Seats from '../../containers/testdata/Seats';

import './MenuList.css';

const MenuListAvailabilityItem = ({ title, originalDate, seats }) => {

  const dateDefined = new Date(originalDate);

  return (
    <div>
      <span className="MenuListHeader">
        {title}
      </span>

      <ul className="MenuListAvailable">
      {
        seats.map((team, index) => {
          let returnedList = [];

            for(let memberCount = 0; memberCount < team.members.length; memberCount++) {

              let currentMember = team.members[memberCount];

              for(let i = 0; i < currentMember.availabilityDates.length; i++) {

                const comparedDate = new Date(currentMember.availabilityDates[i])
                comparedDate.setHours(0,0,0,0);
                if(dateDefined.getTime() === comparedDate.getTime()) {
                  returnedList.push(
                    <li key={Math.random()} className="MenuListItemAvailable">
                      <span className="MenuListItemAvailable-name">{currentMember.name}</span>
                      <span className="MenuListItemAvailable-team">{team.teamName}</span>
                    </li>
                  );
                }
              }
            }
          return returnedList;
        })
      }
      </ul>
    </div>
  );
}

export default MenuListAvailabilityItem;
