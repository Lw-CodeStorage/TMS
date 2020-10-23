import React, { useState } from 'react';

import { Paper, Box, Grid, TextField, Typography, Button, AppBar, Toolbar, IconButton, Avatar, Popover, Divider } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CourseCard from '../CourseCard'
import OpenCourse from '../OpenCourse'
import OpenClass from '../OpenClass'
import { host } from '../url.js'
import { SnackbarProvider, useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { orange, red } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    //這邊傳入theme可以直接取到 createMuiTheme ThemeProvider 傳下來的值
    root: {
        margin: '5px !important'
    },
    btn: {
        color: theme.palette.error.main
    }
    // btn: props => {
    //     return{
    //         background:props?'orange':'red',
    //         color:'#ffffff',
    //         // '&:hover':{
    //         //     background:'green'
    //         // }      
    //     }
    // },

    // btn:{
    //     color:'red',
    //     //Mui斷點寫法
    //     [theme.breakpoints.up('sm')]:{
    //         color:'blue'
    //     }
    // }

}))
function CourseManagerList({ courseData, setCourseFromManage }) {
    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let userReducer = useSelector(state => state.userReducer)

    //寫值
    let dispatch = useDispatch()
    //const { enqueueSnackbar } = useSnackbar();


    const classes = useStyles(false);

    let d = new Date(courseData.time)
    let t = `${d.getHours() + 1}:${d.getMinutes() + 1}` //時間
    d = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`//日期

    let [open, setOpen] = React.useState(false);
    let handleClose = () => { setOpen(false) };

    async function deleteCourseOnClick(e) {
        //console.log(e.currentTarget.getAttribute('data-id'))
        await fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '刪除課程',
                deleteCourseID: e.currentTarget.getAttribute('data-id'),
                userID: userReducer.id
            }),
        }).then(res => {
            return res.json()
        }).then(res => {
            //console.log(`${['1','2','3']}`);
            if (res['狀態'] == '課程刪除成功') {
                //enqueueSnackbar('課程刪除成功');
                dispatch({ type: 'SHOW', text: res['訊息'], severity: 'success' })
            } else if (res['狀態'] == '課程有相依不能刪除') {
                //enqueueSnackbar( `${res['訊息']} 使用此課程`);
                dispatch({ type: 'SHOW', text: `${res['訊息']} 使用此課程`, severity: 'error' })
            } else {
                //enqueueSnackbar( `${res['訊息']}`);
                dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
            }
        })
        await fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '取得課程',
                userID: userReducer.id
            }),

        }).then(res => {
            return res.json()
        }).then(res => {

            if (res['狀態'] == '課程下載成功') {
                setCourseFromManage(res['訊息'])//設定上層
                //enqueueSnackbar('課程下載成功');
                // dispatch({ type: 'SHOW', text: `管理 課程下載成功`, severity: 'success' })
            }
            else {
                dispatch({ type: 'SHOW', text: `管理${['訊息']}`, severity: 'error' })
            }
        })
    }

    //classes={{ text: classes.buttonTextColor }}
    return (
        <>
            <ListItem divider button onClick={() => { setOpen(true) }}>
                <ListItemText primary={courseData['courseName']} secondary={d} />
                <ListItemSecondaryAction>
                    {/* 也可用閉包 在onClick的時候傳 */}
                    <Button data-id={`${courseData.id}`} className={classes.btn} onClick={deleteCourseOnClick}>刪除課程</Button>
                </ListItemSecondaryAction>
            </ListItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='lg'
                classes={{ paper: classes.root }}
                scroll={'paper'}
            >

                <DialogContent style={{ padding: 0 }}>
                    <OpenCourse previewCourseData={courseData} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}
function ClassManageList({ classData, setClassDataFromManage }) {
    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let userReducer = useSelector(state => state.userReducer)
    //寫值
    let dispatch = useDispatch()
    //const { enqueueSnackbar } = useSnackbar();


    const classes = useStyles(false);
    let [open, setOpen] = React.useState(false);
    let handleClose = () => { setOpen(false) };
    async function deleteCourseOnClick(e) {
        //console.log(e.currentTarget.getAttribute('data-id'))
        // await fetch(host, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json; charset=utf-8'
        //     },
        //     body: JSON.stringify({
        //         type: '刪除課程',
        //         deleteCourseID: e.currentTarget.getAttribute('data-id'),
        //         userID: userReducer.id
        //     }),
        // }).then(res => {
        //     return res.json()
        // }).then(res => {
        //     //console.log(`${['1','2','3']}`);
        //     if (res['狀態'] == '課程刪除成功') {
        //         //enqueueSnackbar('課程刪除成功');
        //         dispatch({ type: 'SHOW', text: res['訊息'], severity: 'success' })
        //     } else if (res['狀態'] == '課程有相依不能刪除') {
        //         //enqueueSnackbar( `${res['訊息']} 使用此課程`);
        //         dispatch({ type: 'SHOW', text: `${res['訊息']} 使用此課程`, severity: 'error' })
        //     } else {
        //         //enqueueSnackbar( `${res['訊息']}`);
        //         dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
        //     }
        // })
        // await fetch(host, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json; charset=utf-8'
        //     },
        //     body: JSON.stringify({
        //         type: '取得課程',
        //         userID: userReducer.id
        //     }),

        // }).then(res => {
        //     return res.json()
        // }).then(res => {

        //     if (res['狀態'] == '課程下載成功') {
        //         setCourseFromManage(res['訊息'])//設定上層
        //         //enqueueSnackbar('課程下載成功');
        //         // dispatch({ type: 'SHOW', text: `管理 課程下載成功`, severity: 'success' })
        //     }
        //     else {
        //         dispatch({ type: 'SHOW', text: `管理${['訊息']}`, severity: 'error' })
        //     }
        // })
    }
    return (
        <>

            <ListItem divider button onClick={() => { setOpen(true) }}>
                <ListItemText
                primary={classData['班級名稱']} 
                secondary={`報名人數 : 0/${classData['人數限制']}人`}
                />
                <ListItemSecondaryAction>
                    {/* 也可用閉包 在onClick的時候傳 */}
                    {/* <Button data-id={`${courseData.id}`} className={classes.btn} onClick={deleteCourseOnClick}>刪除課程</Button> */}
                </ListItemSecondaryAction>
            </ListItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='lg'
                classes={{ paper: classes.root }}
                scroll={'paper'}
            >

                <DialogContent style={{ padding: 0 }}>
                    <OpenClass previewClassData={classData} /> 
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )

}
export default function Manage() {
    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let userReducer = useSelector(state => state.userReducer)

    //寫值
    let dispatch = useDispatch()

    let [courses, setCourses] = React.useState([])
    let [classData, setClassData] = React.useState([])

    React.useEffect(() => {
        fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '取得課程',
                userID: userReducer.id
            }),

        }).then(res => {
            return res.json()
        }).then(res => {
            if (res['狀態'] == '課程下載成功') {
                setCourses(res['訊息'])
                // dispatch({ type: 'SHOW', text: `管理 課程下載成功`, severity: 'success' })
            } else {
                dispatch({ type: 'SHOW', text: `管理${['訊息']}`, severity: 'error' })
            }
        })
        fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '取得班級',
                userID: userReducer.id
            }),
        }).then(res => {
            return res.json()
        }).then(res => {
            if (res['狀態'] == '班級下載成功') {
                // console.log(res['訊息'])
                setClassData(res['訊息'])
                // dispatch({ type: 'SHOW', text: `管理 課程下載成功`, severity: 'success' })
            } else {
                dispatch({ type: 'SHOW', text: `管理${['訊息']}`, severity: 'error' })
            }
        })
    }, [])

    return (
        <>
            {/* <SnackbarProvider maxSnack={2}> */}
            <Box maxWidth='1200px' p={2} margin='auto'>

                <Grid container justify='center' spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant='h6'>
                            班級列表
                        </Typography>
                        <Divider />

                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Box p={1}>
                                <List>
                                    {
                                        classData ?
                                            classData.map((item) =>
                                                <ClassManageList classData={item} setClassDataFromManage={setClassData}></ClassManageList>
                                            )
                                            : null
                                    }
                                </List>
                            </Box>
                        </Paper>
                    </Grid>

                </Grid>
                <Grid container justify='center' spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant='h6'>
                            課程列表
                        </Typography>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Paper>
                            <Box p={1}>
                                <List>
                                    {
                                        courses ?
                                            courses.map((item) =>
                                                <CourseManagerList courseData={item} setCourseFromManage={setCourses}></CourseManagerList>
                                            )
                                            : null
                                    }
                                </List>
                            </Box>
                        </Paper>
                    </Grid>

                </Grid>
            </Box>


            {/* </SnackbarProvider> */}
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackBarReducer.open} autoHideDuration={2000} onClose={() => dispatch({ type: 'HIDEN' })}>
                <Alert onClose={() => dispatch({ type: 'HIDEN' })} severity={snackBarReducer.severity}>
                    {snackBarReducer.text}
                </Alert>
            </Snackbar>
        </>
    )
}