import React, { Component } from 'react';

const arrowStyle = {
  position: 'absolute',
  top: '40vh',
  cursor: 'pointer',
  fontSize: '1.5rem',
  color: '#999'
};

const leftStyle = {
  ...arrowStyle,
  left: '-1.5rem'
};

const rightStyle = {
  ...arrowStyle,
  right: '-1.5rem'
};

export class ArrowLeft extends Component {
  render() {
    return (
      <div className="arrow arrow-left" {...this.props} style={leftStyle}>
        <i className="fa fa-chevron-left" />
      </div>
    );
  }
}

export class ArrowRight extends Component {
  render() {
    return (
      <div className="arrow arrow-right" {...this.props} style={rightStyle}>
        <i className="fa fa-chevron-right" />
      </div>
    );
  }
}
