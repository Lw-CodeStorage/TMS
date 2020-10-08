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
import { host } from '../url.js'

import { makeStyles } from '@material-ui/core/styles';
//import { useTheme } from '@material-ui/core/styles';
const useStyles = makeStyles({
    root: {
        margin:'5px !important'
    },
})
  
function ManagerList({ courseData }) {
    // const theme = useTheme();
    const classes = useStyles();
    let d = new Date(courseData.time)
    let t = `${d.getHours() + 1}:${d.getMinutes() + 1}` //時間
    d = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`//日期

    let [open, setOpen] = React.useState(false);
    let handleClickOpen = () => { setOpen(true) };
    let handleClose = () => { setOpen(false) };

    React.useEffect(() => {

    })

    return (
        <>
            <ListItem divider button onClick={() => { setOpen(true) }}>
                <ListItemText primary={courseData['courseName']} secondary={d} />
                <ListItemSecondaryAction>
                    <Switch color='primary' />
                </ListItemSecondaryAction>
            </ListItem>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='lg'
                classes={{paper:classes.root}}
            >
                <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
                    <OpenCourse previewCourseData={courseData}/>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Disagree
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

export default function Manage() {
    let loginReducer = useSelector(state => state.loginReducer)
    let userReducer = useSelector(state => state.userReducer)
    let dispatch = useDispatch()

    let [courses, setCourses] = React.useState([])

    React.useEffect(() => {
        fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '取得課程',
            }),

        }).then(res => {
            return res.json()
        }).then(res => {
            console.log(res);
            if (res['狀態'] == '課程下載成功') {
                setCourses(res['訊息'])
            } else {
                dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
            }
        })
    }, [])

    return (
        <>
            <Box maxWidth='1200px' p={2} margin='auto'>

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

                                                <ManagerList courseData={item}></ManagerList>

                                            )
                                            : null
                                    }
                                </List>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

        </>
    )
}