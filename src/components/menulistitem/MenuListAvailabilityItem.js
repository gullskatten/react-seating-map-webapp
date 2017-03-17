import React from 'react';
import Seats from '../../containers/testdata/Seats';

const MenuListAvailabilityItem = ({title, originalDate}) => {
  return (
    <div>
      <span>
        {title}
      </span>

      <ul>{
        Seats.map((value, index) => {
          const dateDefined = new Date(originalDate);

          for(let i = 0; i < value.availabilityDates.length; i++) {
            const comparedDate = new Date(value.availabilityDates[i])
            comparedDate.setHours(0,0,0,0);



            if(dateDefined.getTime() === comparedDate.getTime()) {

              if(value.name == "Roger") {
                console.log("Found u Roger!");
              }

              return (
                <li key={index}>
                  <span>{value.name}</span>
                  <span>{value.team}</span>
                </li>
              );
            }
          }
      })
    }
      </ul>
    </div>
  );
}

export default MenuListAvailabilityItem;
