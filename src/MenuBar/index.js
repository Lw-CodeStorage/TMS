import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Box, Grid, TextField, Typography, Button, AppBar, Toolbar, IconButton, Avatar, Popover, Divider } from '@material-ui/core'

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';

import { useDispatch, useSelector } from 'react-redux'
import allReducer from '../reducers';
import FacebookLogin from 'react-facebook-login'
import { host } from '../url.js'
const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },
    fbButton: {
        width: '100%',
        background: theme.palette.facebook.background,
        color: 'white',
        border: '0px',
        height: '32px',
        borderRadius: '50%',
        outline: 'none',
        cursor: 'pointer',
        width: '32px',
        '&:active': {
            opacity: 0.8
        }
    }
}));
export default function MenuBar() {
    let classes = useStyles();
    let history = useHistory();
    let loginReducer = useSelector(state => state.loginReducer)
    let userReducer = useSelector(state => state.userReducer)

    let dispatch = useDispatch()

    let anchorEl = React.useRef(null)
    let [open, setOpen] = React.useState(false)

    let handleClick = (event) => {
        anchorEl.current = event.currentTarget
        //console.log(anchorEl.current);
        setOpen(true)
    };
    let handleClose = (event) => {
        setOpen(false)
    }
    //偵測 每次重整的登入狀況 重整會導致state回到初始狀態
    // React.useEffect(() => {
    //     let cookies = document.cookie.split(';')
    //     let state = ''
    //     for (let i = 0; i < cookies.length; i++) {
    //         if (cookies[i].indexOf('TMS') >= 0) {
    //             state = cookies[i].split('=')[1]
    //             // console.log(state);
    //         }
    //     }
    //     if (state == '') {
    //         dispatch({ type: 'IS_LOGOUT' })
    //         // console.log('登出');
    //     } else {
    //         dispatch({ type: 'IS_LOGIN' })
    //         fetch(host, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json; charset=utf-8'
    //             },
    //             body: JSON.stringify({
    //                 type: '使用者資料',
    //                 email: state
    //             }),
    //         }).then(res => {
    //             return res.json()
    //         }).then(res => {
    //             if (res.狀態 == '查詢成功') {
    //                 dispatch({ type: 'USER_DATA', data: res['訊息'], severity: 'error' })
    //             }
    //         })
    //     }
    // }, [loginReducer])

    // //偵測 畫面停滯時間
    // setInterval(() => {
    //     let cookies = document.cookie.split(';')
    //     let state = ''
    //     for (let i = 0; i < cookies.length; i++) {
    //         if (cookies[i].indexOf('TMS') >= 0) {
    //             state = cookies[i].split('=')[1]
    //             //console.log(state);
    //         }
    //     }
    //     if (state == '') {
    //         dispatch({ type: 'IS_LOGOUT' })
    //         // console.log('登出');
    //     } else {
    //         // console.log('登入中..');
    //     }
    // }, 4000);

    // function logout() {
    //     history.push('/登入')
    //     document.cookie = `TMS='';max-age =0; path=/`;
    //     handleClose()

    // }
    // React.useEffect(() => { })
    let fbResponse = (response) => {
        // console.log(response)
        if (response.email) {
            fetch(host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: 'FB',
                    email: response.email,
                    name:response.name,
                    picture:response.picture.data.url
                }),
            }).then(res => {
                return res.json()
            }).then(res => {
                if (res.狀態 == '查詢成功') {
                    console.log(res.訊息)
                     dispatch({ type: 'USER_DATA', data: res['訊息'] })
                     dispatch({ type: 'IS_LOGIN' })
                }
            })
           
            //console.log(loginReducer)
        } else {
            console.log('沒登');
        }

    }
    return (
        < AppBar position="static">
            <Toolbar variant="dense">

                <Typography className={classes.title} onClick={() => { history.push('/') }}>
                    人才發展管理系統
                </Typography>
                {loginReducer ?
                    <>
                        <Avatar alt="?" src={`${userReducer.picture}`} style={{ width: 40, height: 40, cursor: 'pointer' }} onClick={handleClick} />
                        <Popover
                            id='menuPopover'
                            open={open}
                            anchorEl={anchorEl.current}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <Paper style={{ width: 300 }}>
                                <Box p={2}>
                                    <Grid container spacing={2} wrap='nowrap'>
                                        <Grid item >
                                            <Avatar alt="?" src={userReducer.picture} style={{ width: 32, height: 32 }} />

                                        </Grid>

                                        <Grid item style={{ width: 200 }}>
                                            <Typography>{userReducer.userName}</Typography>
                                            <Typography noWrap={true}>{userReducer.email}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Divider />
                                {userReducer.Authority == "老師" ?
                                    <List >
                                        <ListItem button dense onClick={() => { history.push('./開設課程') }}>
                                            <ListItemIcon>
                                                <DraftsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="開設課程" />
                                        </ListItem>
                                        <ListItem button dense onClick={() => { history.push('./開設班級') }}>
                                            <ListItemIcon>
                                                <DraftsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="開設班級" />
                                        </ListItem>
                                        <ListItem button dense onClick={() => { history.push('./管理') }}>
                                            <ListItemIcon>
                                                <DraftsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="課程/班級 管理" />
                                        </ListItem>
                                        <ListItem button dense onClick={() => { history.push('./帳戶') }}>
                                            <ListItemIcon>
                                                < SettingsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="管理帳戶" />
                                        </ListItem>


                                    </List>
                                    : <List >
                                        <ListItem button dense onClick={() => { history.push('./帳戶') }}>
                                            <ListItemIcon>
                                                < SettingsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="管理帳戶" />
                                        </ListItem>

                                    </List>}


                            </Paper>
                        </Popover>
                    </> :
                    <>
                        <FacebookLogin
                            cssClass={classes.fbButton}
                            appId="3401066723316419"
                            autoLoad={true}
                            fields="name,email,picture"
                            icon="fa-facebook"
                            textButton=''
                            callback={fbResponse}
                        />
                    </>
                }
            </Toolbar>
        </AppBar>
    )
}