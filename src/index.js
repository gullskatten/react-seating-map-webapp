import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/app/App';
import {Provider} from 'mobx-react';
import Store from './store/Store'
import './index.css';


const store = new Store();

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
