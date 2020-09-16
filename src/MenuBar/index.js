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

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
    },

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
    React.useEffect(() => {
        let cookies = document.cookie.split(';')
        let state = ''
        for (let i = 0; i < cookies.length; i++) {
            if (cookies[i].indexOf('TMS') >= 0) {
                state = cookies[i].split('=')[1]
                // console.log(state);
            }
        }
        if (state == '') {
            dispatch({ type: 'IS_LOGOUT' })
            // console.log('登出');
        } else {
            dispatch({ type: 'IS_LOGIN' })
            fetch('http://localhost:8888/userData/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    email: state
                }),
            }).then(res => {
                return res.json()
            }).then(res => {
                if (res.狀態 == '查詢成功') {
                    dispatch({ type: 'USER_DATA', data: res['訊息'] })
                }
            })
        }
    }, [loginReducer])
    React.useEffect(() => {
        // console.log('我是被reducer更新所觸發');
    })
    //偵測 畫面停滯時間
    setInterval(() => {
        let cookies = document.cookie.split(';')
        let state = ''
        for (let i = 0; i < cookies.length; i++) {
            if (cookies[i].indexOf('TMS') >= 0) {
                state = cookies[i].split('=')[1]
                //console.log(state);
            }
        }
        if (state == '') {
            dispatch({ type: 'IS_LOGOUT' })
            // console.log('登出');
        } else {
            // console.log('登入中..');
        }
    }, 4000);

    function logout() {
        history.push('/登入')
        document.cookie = `TMS='';max-age =0; path=/`;
        handleClose()

    }
    return (
        < AppBar position="static">
            <Toolbar variant="dense">

                <Typography variant='title' className={classes.title} onClick={() => { history.push('/') }}>
                    人才發展管理系統
                </Typography>
                {loginReducer ?
                    <>
                        <Avatar alt="?" src={`http://localhost:8888/image?email=${userReducer.email}`} style={{ width: 32, height: 32, cursor: 'pointer' }} onClick={handleClick} />
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
                                            <Avatar alt="?" src={`http://localhost:8888/image?email=${userReducer.email}`} style={{ width: 32, height: 32 }} />

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
                                        <ListItem button dense onClick={() => { history.push('./帳戶') }}>
                                            <ListItemIcon>
                                                < SettingsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="管理帳戶" />
                                        </ListItem>
                                        <ListItem button dense onClick={()=>{ history.push('./開設課程')}}>
                                            <ListItemIcon>
                                                <DraftsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="開設課程" />
                                        </ListItem>
                                        <ListItem button dense onClick={logout}>
                                            <ListItemIcon>
                                                <DraftsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="登出" />
                                        </ListItem>
                                    </List>
                                    : <List >
                                        <ListItem button dense onClick={() => { history.push('./帳戶') }}>
                                            <ListItemIcon>
                                                < SettingsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="管理帳戶" />
                                        </ListItem>
                                        <ListItem button dense onClick={logout}>
                                            <ListItemIcon>
                                                <DraftsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="登出" />
                                        </ListItem>
                                    </List>}


                            </Paper>
                        </Popover>
                    </> :
                    <>
                        <Button color="inherit" onClick={() => { history.push('/登入') }}>登入</Button>
                        ｜
                        <Button color="inherit" onClick={() => { history.push('/註冊') }}>註冊</Button>
                    </>
                }
            </Toolbar>
        </AppBar>
    )
}