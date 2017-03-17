import React from 'react';
import MenuListAvailabilityItem from './MenuListAvailabilityItem';
import './MenuList.css';

const MenuList= ({ today, tomorrow }) => {
  return (
    <div>
      <h3>Available seats</h3>
      <MenuListAvailabilityItem title="Today" originalDate={today}/>
      <MenuListAvailabilityItem title="Tomorrow" originalDate={tomorrow}/>
    </div>
  );
}

export default MenuList;
