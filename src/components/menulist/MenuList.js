import React from 'react';
import MenuListAvailabilityItem from './MenuListAvailabilityItem';
import './MenuList.css';

const MenuList= ({ today, tomorrow, seats }) => {
  return (
    <div>
      <h3>Available seats</h3>
      <MenuListAvailabilityItem seats={seats} title="Today" originalDate={today}/>
      <MenuListAvailabilityItem seats={seats} title="Tomorrow" originalDate={tomorrow}/>
    </div>
  );
}

export default MenuList;
