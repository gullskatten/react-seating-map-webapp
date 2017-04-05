import React from 'react';

import './MenuList.css';

const MenuListAvailabilityItem = ({ title, originalDate, seats, isEmptyText }) => {

  const dateDefined = new Date(originalDate);
  let isAnyAvailable = false;

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
                    isAnyAvailable = true;
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
        {displayNoneAvailable(isAnyAvailable, isEmptyText)}
      </ul>
    </div>
  );
}

function displayNoneAvailable(isAnyAvailable, isEmptyText) {
  if(!isAnyAvailable) {
    return (<li key={Math.random()} className="MenuListItemAvailable">
    <span className="MenuListItemAvailable-team">{isEmptyText}</span>
    </li>);
  }
}

export default MenuListAvailabilityItem;
