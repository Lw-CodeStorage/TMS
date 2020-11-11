import React, { useEffect } from 'react';
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
// import Snackbar from '@material-ui/core/Snackbar';
// import Alert from '@material-ui/lab/Alert';
// import MenuIcon from '@material-ui/icons/Menu';
// import AccountCircle from '@material-ui/icons/AccountCircle';
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

    React.useEffect(() => {
        let cookies = document.cookie.split(';')
        let state = ''
        for (let i = 0; i < cookies.length; i++) {
            if (cookies[i].indexOf('TMS') >= 0) {
                state = cookies[i].split('=')[1]
                // console.log(state);
            }
        }
        if (state != '') {
            // if(loginReducer){
            dispatch({ type: 'IS_LOGIN' })
            fetch(host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: '使用者資料',
                    email: state,
                    //email: userReducer.email
                }),
            }).then(res => {
                return res.json()
            }).then(res => {
                if (res.狀態 == '查詢成功') {
                    dispatch({ type: 'USER_DATA', data: res['訊息'] })
                    dispatch({ type: 'IS_LOGIN' })
                }
            })
            // }

        }
    }, [])

    let fbResponse = (response) => {
        console.log(response)
        if (response.email) {
            fetch(host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: 'FB',
                    email: response.email,
                    name: response.name,
                    picture: response.picture.data.url
                }),
            }).then(res => {
                return res.json()
            }).then(res => {
                if (res.狀態 == '查詢成功') {
                    // console.log(res.訊息)
                    document.cookie = `TMS=${response.email};max-age = 3600 path=/`
                    dispatch({ type: 'USER_DATA', data: res['訊息'] })
                    dispatch({ type: 'IS_LOGIN' })

                }
            })

        } else {
            console.log('FB沒登');
        }
    }

    let logout = () => {
        document.cookie = `TMS='';max-age =0; path=/`;
        dispatch({ type: 'IS_LOGOUT' })
        dispatch({ type: 'USER_DATA_CLEAR' })//清空Redux 不清除會引響main的effect觸發時還是抓的使用者id，所以main那頁就算登出還是會是該使用者為選擇的課程
        history.push('/')
        window.location.reload()
    }
    // let test = () => {
    //     window.FB.getLoginStatus(function (response) {
    //         if (response.status === 'connected') {
    //             let me = window.FB.api('/me', function (response) {
    //                 console.log(JSON.stringify(response));
    //             });
    //             console.log(me)
    //             console.log(1)
    //         } else if (response.status === 'not_authorized') {
    //             console.log(2)
    //         } else {
    //             console.log(3)
    //         }
    //     });
    // }
    return (
        < AppBar position="static">
            <Toolbar variant="dense" style={{cursor: 'pointer'}}>
                {/* <svg width="30" height="30" viewBox="0 0 156 152" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M140.53 130.91L117.86 110.14C114.612 116.57 109.086 121.56 102.36 124.14L122.84 147.57C125.074 150.067 128.208 151.575 131.553 151.763C134.898 151.95 138.181 150.802 140.68 148.57C140.775 148.492 140.865 148.408 140.95 148.32C142.083 147.16 142.972 145.784 143.566 144.275C144.159 142.766 144.445 141.153 144.406 139.532C144.367 137.91 144.004 136.313 143.338 134.834C142.672 133.355 141.718 132.024 140.53 130.92V130.91Z" fill="#2F6E35" />
                    <path d="M124.43 77.15H122.75C120.356 77.485 117.918 77.2809 115.614 76.5525C113.309 75.8241 111.196 74.5898 109.43 72.94L108 71.55L107.54 73.55C105.167 84.2112 99.043 93.665 90.283 100.188C81.523 106.712 70.7107 109.87 59.8167 109.088C48.9227 108.306 38.6723 103.636 30.9338 95.9285C23.1952 88.2209 18.4837 77.9894 17.6581 67.0986C16.8324 56.2078 19.9474 45.3829 26.4355 36.5968C32.9236 27.8107 42.3527 21.6484 53.0043 19.233C63.6559 16.8175 74.8208 18.3099 84.4641 23.4379C94.1075 28.566 101.587 36.9884 105.54 47.17V47.59L109.29 49.59L109.88 49.08C113.049 46.3789 117.145 45.0194 121.3 45.29H123L122.45 43.73C118.542 31.9515 111.227 21.5969 101.433 13.9763C91.6381 6.35566 79.8031 1.81146 67.4252 0.918632C55.0473 0.0257993 42.6827 2.82444 31.8958 8.96049C21.1088 15.0965 12.3843 24.2942 6.82596 35.3899C1.26763 46.4856 -0.874676 58.9806 0.67002 71.2942C2.21472 83.6077 7.37701 95.1864 15.5038 104.565C23.6306 113.944 34.3568 120.702 46.3251 123.983C58.2934 127.265 70.9662 126.923 82.74 123C85.6223 122.037 88.4328 120.871 91.15 119.51C91.15 119.51 95.74 123.26 104.34 117.61C107.801 115.376 110.816 112.517 113.23 109.18C114.621 107.808 115.517 106.012 115.776 104.075C116.035 102.138 115.642 100.17 114.66 98.48C118.889 92.3314 121.959 85.462 123.72 78.21L124.43 77.15Z" fill="#2F6E35" />
                    <path d="M143.14 14.49C140.732 14.4344 138.358 15.0681 136.298 16.3163C134.238 17.5646 132.578 19.3754 131.512 21.5357C130.447 23.696 130.021 26.1157 130.284 28.51C130.548 30.9042 131.49 33.1733 133 35.05L124.32 46.94V47.15C121.749 46.4963 119.049 46.5419 116.502 47.2821C113.954 48.0223 111.651 49.4302 109.83 51.36L93.27 42.72V41.16C93.038 36.9527 91.2032 32.9941 88.1428 30.0978C85.0823 27.2015 81.0287 25.5874 76.815 25.5874C72.6013 25.5874 68.5477 27.2015 65.4872 30.0978C62.4268 32.9941 60.592 36.9527 60.36 41.16C60.3595 44.7416 61.5444 48.2226 63.73 51.06L58.38 59.49L59.38 60.12C60.2395 60.6402 61.0206 61.2799 61.7 62.02C60.6679 61.5517 59.5973 61.1737 58.5 60.89C53.9687 59.7245 49.1865 60.0045 44.8222 61.6908C40.4579 63.3771 36.7298 66.3854 34.1595 70.2949C31.5891 74.2044 30.3051 78.8195 30.4869 83.4948C30.6688 88.17 32.3075 92.6715 35.1737 96.3695C38.0399 100.068 41.9904 102.777 46.4725 104.119C50.9546 105.462 55.7441 105.369 60.1711 103.855C64.5982 102.341 68.4413 99.4815 71.1629 95.6758C73.8845 91.87 75.3484 87.3088 75.35 82.63C75.3705 76.8444 73.1316 71.2794 69.11 67.12L74.59 57.3C77.1082 57.691 79.6833 57.4748 82.1011 56.6694C84.5188 55.8641 86.7092 54.4929 88.49 52.67L105.68 61.89C105.704 63.827 106.11 65.7403 106.874 67.5205C107.637 69.3008 108.744 70.9132 110.131 72.2656C111.518 73.6181 113.158 74.6842 114.956 75.403C116.755 76.1218 118.678 76.4793 120.615 76.455C122.552 76.4307 124.465 76.0251 126.245 75.2614C128.026 74.4977 129.638 73.3909 130.991 72.004C132.343 70.6172 133.409 68.9775 134.128 67.1787C134.847 65.3798 135.204 63.457 135.18 61.52C135.29 59.1976 134.84 56.8828 133.87 54.77L143.14 40C146.527 40 149.775 38.6546 152.17 36.2598C154.565 33.8649 155.91 30.6168 155.91 27.23C155.91 23.8432 154.565 20.5951 152.17 18.2003C149.775 15.8054 146.527 14.46 143.14 14.46V14.49Z" fill="#74CF64" />
                </svg> */}
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
                                        <ListItem button dense onClick={logout}>
                                            <ListItemIcon>
                                                <DraftsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="登出" />
                                        </ListItem>

                                    </List>
                                    : <List >
                                        <ListItem button dense onClick={() => {
                                            history.push('/我的班級')
                                        }}>
                                            <ListItemIcon>
                                                < SettingsIcon />
                                            </ListItemIcon>
                                            <ListItemText primary="我的班級" />
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
                        <FacebookLogin
                            cssClass={classes.fbButton}
                            appId="3401066723316419"
                            fields="name,email,picture"
                            icon="fa-facebook"
                            textButton=''
                            callback={fbResponse}
                        // autoLoad
                        />
                    </>
                }
            </Toolbar>
        </AppBar>
    )
}