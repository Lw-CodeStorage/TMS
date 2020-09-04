import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import allReducer from './reducers'

import { Paper, Box, Grid, CssBaseline } from '@material-ui/core'
import LoginPage from './Login'
//let store = createStore(allReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
ReactDOM.render(
  // <Provider store={store}>
  <React.StrictMode>
    <CssBaseline>
      <LoginPage></LoginPage>
    </CssBaseline>

  </React.StrictMode>
  // </Provider>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
