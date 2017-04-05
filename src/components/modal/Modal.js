import React from 'react';
import './Modal.css';
import FontAwesome from 'react-fontawesome';

const Modal = ({ height, children, onExit }) => {
  const customHeight = height ? height : '500px';

  return (
    <div>
      <div className="overlay" onClick={onExit} />
      <div
        className="Modal animated fadeInDown"
        style={{ height: customHeight }}
      >
        <span onClick={onExit} className="ModalExit">
          <FontAwesome name="remove" className="icon" />
        </span>
        {children}
      </div>
    </div>
  );
};

export default Modal;
