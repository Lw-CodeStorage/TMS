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
import LoginPage from './Login'
import Account from './Account'
import OpenCourse from './OpenCourse'
import Manage from './Manage';
import theme from './theme.js'
import { MuiThemeProvider, ThemeProvider } from '@material-ui/core/styles'
let store = createStore(allReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

function App() {
  let loginReducer = useSelector(state => state.loginReducer)
  let userReducer = useSelector(state => state.userReducer)
  let dispatch = useDispatch()

  return (

   
      <ThemeProvider theme={theme}>
         <CssBaseline>
        <Router>
          <MenuBar />
          <Switch>
            {loginReducer ?
              <>
                {userReducer['Authority'] == '老師' ?
                  <>
                    <Route exact path="/"> <Main /> </Route>
                    <Route path="/帳戶"> <Account /> </Route>
                    <Route path="/開設課程"> <OpenCourse /></Route>
                    <Route path="/管理"> <Manage/></Route>
                  </>
                  :
                  <>
                    <Route exact path="/"> <Main /> </Route>
                    <Route path="/帳戶"> <Account /> </Route>
                  </>
                }
              </> :
              <>
                <Route exact path="/"> <Main /> </Route>
                <Route path="/登入"> <LoginPage /> </Route>
                <Route path="/註冊"> <RegisterPage /> </Route>
              </>
            }
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
