import React, { Component } from 'react';

export class ArrowLeft extends Component {
  render() {
    return (
      <div className='arrow-left' {...this.props}>
        <p>Left</p>
      </div>
    )
  }
}

export class ArrowRight extends Component {
  render() {
    return (
      <div className='arrow-right' {...this.props}>
        <p>Right</p>
      </div>
    )
  }
}
