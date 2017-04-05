import React from 'react';
import MenuListAvailabilityItem from './MenuListAvailabilityItem';
import './MenuList.css';

const MenuList= ({ today, tomorrow, seats }) => {
  return (
    <div>
      <h3><i className="fa fa-list"></i> Available seats</h3>
      <MenuListAvailabilityItem
       seats={seats}
       title="Today"
       originalDate={today}
       isEmptyText="No available seats today!" />
      <MenuListAvailabilityItem
       seats={seats}
       title="Tomorrow"
       originalDate={tomorrow}
       isEmptyText="No available seats tomorrow!"/>
    </div>
  );
}

export default MenuList;
