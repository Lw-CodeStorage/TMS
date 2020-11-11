import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams
} from "react-router-dom";
import * as serviceWorker from './serviceWorker';

import { createStore } from 'redux'
import { Provider, useDispatch, useSelector } from 'react-redux'
import allReducer from './reducers'

import { CssBaseline } from '@material-ui/core'

import Main from './Main'
import MenuBar from './MenuBar'
import RegisterPage from './Register'
// import LoginPage from './(N)Login'
// import Account from './(N)Account'
import OpenCourse from './OpenCourse'
import OpenClass from './OpenClass'
import Manage from './Manage';

import UserClass from './UserClass'

import theme from './theme.js'
import { MuiThemeProvider, ThemeProvider } from '@material-ui/core/styles'
let store = createStore(allReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

function App() {
  //let loginReducer = useSelector(state => state.loginReducer)
  let userReducer = useSelector(state => state.userReducer)
  //let dispatch = useDispatch()

  return (


    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Router>
          <MenuBar />
          {/* 這是給GitPage用 */}
          {/* <Switch>
            <Route path="/TMS_FrontEnd/開設課程"> {userReducer['Authority'] == '老師' ? <OpenCourse /> : <Main />}</Route>
            <Route path="/TMS_FrontEnd/開設班級">{userReducer['Authority'] == '老師' ? <OpenClass /> : <Main />} </Route>
            <Route path="/TMS_FrontEnd/管理">{userReducer['Authority'] == '老師' ? <Manage />  : <Main />}</Route>
            <Route path="/TMS_FrontEnd/我的班級">{userReducer['Authority'] == '學生' ? <UserClass />  : <Main />}</Route>
            <Route path="/*"> <Main /> </Route>
          </Switch> */}
          <Switch>
            <Route path="/開設課程"> {userReducer['Authority'] == '老師' ? <OpenCourse /> : <Main />}</Route>
            <Route path="/開設班級">{userReducer['Authority'] == '老師' ? <OpenClass /> : <Main />} </Route>
            <Route path="/管理">{userReducer['Authority'] == '老師' ? <Manage />  : <Main />}</Route>
            <Route path="/我的班級">{userReducer['Authority'] == '學生' ? <UserClass />  : <Main />}</Route>
            <Route path="/*"> <Main /> </Route>
          </Switch>
        </Router>
      </CssBaseline>
    </ThemeProvider>
  )
}
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
