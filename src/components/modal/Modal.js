import React from 'react';
import './Modal.css';
import FontAwesome from 'react-fontawesome';

const Modal = ({ children, onExit }) => {
  return (
    <div>
     <div className="overlay" onClick={onExit}/>
     <div className="Modal animated fadeInDown">
      <span onClick={onExit} className="ModalExit">
         <FontAwesome name='remove' className="icon"/>
      </span>
        {children}
     </div>
    </div>
  );
}

export default Modal;
