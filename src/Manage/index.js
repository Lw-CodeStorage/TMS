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
// import ExpandLess from '@material-ui/icons/ExpandLess';
// import ExpandMore from '@material-ui/icons/ExpandMore';
// import Collapse from '@material-ui/core/Collapse';
// import Switch from '@material-ui/core/Switch';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import OpenCourse from '../OpenCourse'
import OpenClass from '../OpenClass'
import { host } from '../url.js'
import { SnackbarProvider, useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import { orange, red } from '@material-ui/core/colors';
import './manage.css'
import theme from '../theme';
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
    const classes = useStyles(false);
    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let userReducer = useSelector(state => state.userReducer)
    //寫值
    let dispatch = useDispatch()

    let [open, setOpen] = React.useState(false);


    let d = new Date(courseData.time)
    let t = `${d.getHours() + 1}:${d.getMinutes() + 1}` //時間
    d = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`//日期

    async function deleteCourseOnClick(e) {
        //console.log(e.currentTarget.getAttribute('data-id'))
        await fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '刪除老師課程',
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
                type: '取得老師課程',
                userID: userReducer.id
            }),

        }).then(res => {
            return res.json()
        }).then(res => {
            console.log(res);
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
                //onClose={() => { setOpen(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='lg'
                classes={{ paper: classes.root }}
                scroll={'paper'}
            >

                <DialogContent style={{ padding: 0 }}>
                    <OpenCourse previewCourseData={courseData} updataButton={'qwe'} />
                </DialogContent>
                <DialogActions>

                    <Button onClick={() => { setOpen(false) }} color="primary" autoFocus>
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
//一個LIST itme 
let ClassManageList = React.memo(function ClassManageList({ classData, setClassDataFromManage }) {
    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let userReducer = useSelector(state => state.userReducer)
    //寫值
    let dispatch = useDispatch()
    //const { enqueueSnackbar } = useSnackbar();

    let [updataButtonClick, setUpdataButtonClick] = React.useState(false) //傳給openClass更新用
    let classes = useStyles();
    let [open, setOpen] = React.useState(false);//班級預覽更新 彈窗
    // 報名管理 - 彈窗
    let [applyManage, setApplyManage] = React.useState({
        '彈窗': false,
        '報名資料': [],
    })
    //班級管理 - 彈窗
    let [classManage, setClassManage] = React.useState({
        '彈窗': false,
        '評分項目': [],
        '報名成功的班級': []
    })
    //人數
    let [classApplyNumber, setClassApplyNumber] = React.useState(0)
    //評分結果
    let [score, setScore] = React.useState([])

    let handleClose = () => { setOpen(false) };
    //取人數 該班學員資料
    React.useEffect(() => {
        //  console.log(classData); //props下來的資料
        fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '取得該班報名人數',
                classID: classData.id
            })
        })
            .then((data) => {
                return data.json()
            }).then(data => {
                setClassApplyNumber(data['訊息'][0]['人數'])
            })

        fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '取得該班報名學員資料',
                classID: classData['id']
            })
        })
            .then((data) => {
                return data.json()
            }).then(data => {
                // console.log(data);
                setApplyManage({ '彈窗': false, '報名資料': data['訊息'] })
                //setClassApplyNumber(data['訊息'][0]['人數'])
            })
    }, [])
    //報名管理按下
    let getClassApllyPerson = (classID) => () => {
        setApplyManage({ ...applyManage, '彈窗': true })
    }
    //同意 or 拒絕 學生報名班級
    let comfirmApplyState = (state, applyID) => async () => {
        //console.log(index);
        //點擊 同意或拒絕
        await fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '更新報名狀態',
                state: state,
                applyID: applyID
            })
        })
            .then((data) => {
                return data.json()
            }).then(data => {
                //console.log(data);
                //setApplyManage({ '彈窗': true, '報名資料': data['訊息'] })
                //setClassApplyNumber(data['訊息'][0]['人數'])
            })
        //撈資料更新頁面
        await fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '取得該班報名學員資料',
                classID: classData['id']
            })
        })
            .then((data) => {
                return data.json()
            }).then(data => {
                //console.log(data);
                setApplyManage({ '彈窗': true, '報名資料': data['訊息'] })
                //setClassApplyNumber(data['訊息'][0]['人數'])
            })

    }

    // 班級管理按下
    let getClassScoreState = (classID) => async () => {

        console.log(applyManage['報名資料'].filter(item => item.狀態 == '報名成功').map(item => item['applyID']))

        //取得評分項目設定狀態
        await fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '取得評分項目',
                classID: classID
            })
        })
            .then((data) => {
                return data.json()
            }).then(data => {
                console.log(data);
                setClassManage({
                    '彈窗': true,
                    '評分項目': data['訊息'],
                    '報名成功的班級': applyManage['報名資料'].filter(item => item.狀態 == '報名成功') //過濾出狀態是報名成功的
                })
            })
        //取得評分分數
        await fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '取得評分分數',
                arrayApplyID: applyManage['報名資料'].filter(item => item.狀態 == '報名成功').map(item => item['applyID'])
            })
        }).then((data) => {
            return data.json()
        }).then(data => {
            //console.log(data['訊息']);
            setScore(data['訊息'])
        })

    }
    let updataScore = (scoreType, scoreData, applyID) => async () => {
        // console.log(scoreType);
        // console.log(scoreData);
        // console.log(applyID);
        await fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '更新評分項目',
                scoreType: scoreType,
                scoreData: scoreData,
                applyID: applyID
            })
        })
        await fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '取得評分分數',
                arrayApplyID: applyManage['報名資料'].filter(item => item.狀態 == '報名成功').map(item => item['applyID'])
            })
        }).then((data) => {
            return data.json()
        }).then(data => {
            //console.log(data['訊息']);
            setScore(data['訊息'])
        })

    }
    //結束班級 
    let closeClass = () =>{
        //console.log(classData);
         fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '結束班級',
                classID:classData.id
            })
        }).then(()=>{
            window.location.reload();
        })

    }
    return (
        <>

            <ListItem divider button onClick={() => { setOpen(true) }}>
                <ListItemText
                    primary={`${classData['班級名稱']} - ${classData['班級狀態']}`}
                    secondary={`人數 : ${classApplyNumber}/${classData['人數限制']}人`}
                />
                <ListItemSecondaryAction>
                    {/* 也可用閉包 在onClick的時候傳 */}
                    <Button color='secondary' onClick={getClassApllyPerson()}>報名管理</Button>
                    <Button color='secondary' onClick={getClassScoreState(classData['id'])}>班級管理</Button>
                </ListItemSecondaryAction>
            </ListItem>

            <Dialog
                //預覽更新班級
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='lg'
                classes={{ paper: classes.root }}
            // scroll={'paper'}
            >
                <DialogContent style={{ padding: 0 }}>
                    <OpenClass
                        previewClassData={classData}
                        updataButtonClick={updataButtonClick}
                        setUpdataButtonClick={setUpdataButtonClick}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        關閉
                    </Button>
                    <Button onClick={() => { setUpdataButtonClick(true) }} color="primary" autoFocus>
                        更新
                    </Button>

                </DialogActions>
            </Dialog>

            <Dialog
                //報名 - 管理彈窗
                open={applyManage['彈窗']}
                onClose={() => { setApplyManage({ ...applyManage, '彈窗': false }) }}
                maxWidth='md'
                classes={{ paper: classes.root }}
                fullWidth
            >
                <DialogTitle >報名管理</DialogTitle>
                <DialogContent style={{ padding: 5 }}>
                    <List dense>
                        {
                            applyManage['報名資料'].map((item, index) =>
                                <ListItem divider >
                                    <ListItemText
                                        primary={item['userName']}
                                        secondary={item['email']}

                                    ></ListItemText>
                                    <ListItemSecondaryAction>
                                        {
                                            item.狀態 != '等待審核' ?
                                                item.狀態
                                                :
                                                <>
                                                    <Button size='small' color='secondary'
                                                        onClick={
                                                            comfirmApplyState('報名成功', item.applyID)
                                                        }
                                                    >同意</Button>
                                                    <Button size='small' color='secondary'
                                                        onClick={
                                                            comfirmApplyState('報名失敗', item.applyID)
                                                        }
                                                    >拒絕</Button>
                                                </>
                                        }

                                    </ListItemSecondaryAction>
                                </ListItem>
                            )
                        }
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setApplyManage({ ...applyManage, '彈窗': false }) }} color="primary" autoFocus>
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                //班級 - 管理彈窗
                open={classManage['彈窗']}
                onClose={() => { setClassManage({ ...classManage, '彈窗': false }) }}
                maxWidth='md'
                classes={{ paper: classes.root }}
                fullWidth
            >
                <DialogTitle >班級管理</DialogTitle>
                <DialogContent style={{ padding: 5 }}>
                    <List dense>
                        {
                            classManage['報名成功的班級'].map((item, index) =>
                                <>
                                    <ListItem  >
                                        <ListItemText
                                            primary={item['userName']}
                                            secondary={item['email']}
                                        />
                                    </ListItem>
                                    {
                                        //判斷課程各評分項目有沒有開啟
                                        classManage['評分項目'][0]['學科'] == 'true' ?
                                            <ListItem >
                                                <ListItemText
                                                    primary={'學科'}
                                                />
                                                {

                                                    //判斷有沒有評過分  
                                                    score.length ?
                                                        score[index]['學科'] == '未評分' ?

                                                            <ListItemSecondaryAction>
                                                                <Button size='small'
                                                                    color='primary'
                                                                    onClick={
                                                                        updataScore('學科', '通過', item['applyID'])
                                                                    }>通過</Button>
                                                                <Button size='small'
                                                                    className={classes.btn}
                                                                    onClick={
                                                                        updataScore('學科', '未通過', item['applyID'])}
                                                                >未通過</Button>
                                                            </ListItemSecondaryAction> :
                                                            <ListItemSecondaryAction>
                                                                {score[index]['學科']}
                                                            </ListItemSecondaryAction>

                                                        : null}
                                            </ListItem>
                                            : null
                                    }

                                    {
                                        classManage['評分項目'][0]['術科'] == 'true' ? <ListItem >
                                            <ListItemText
                                                primary={'術科'}
                                            />
                                            {//判斷有沒有評過分  
                                                score.length ?
                                                    score[index]['術科'] == '未評分' ?

                                                        <ListItemSecondaryAction>
                                                            <Button size='small'
                                                                color='primary'
                                                                onClick={
                                                                    updataScore('術科', '通過', item['applyID'])
                                                                }>通過</Button>
                                                            <Button size='small'
                                                                className={classes.btn}
                                                                onClick={
                                                                    updataScore('術科', '未通過', item['applyID'])}
                                                            >未通過</Button>
                                                        </ListItemSecondaryAction> :
                                                        <ListItemSecondaryAction>
                                                            {score[index]['術科']}
                                                        </ListItemSecondaryAction>

                                                    : null}
                                        </ListItem> : null
                                    }
                                    {
                                        classManage['評分項目'][0]['實習'] == 'true' ? <ListItem >
                                            <ListItemText
                                                primary={'實習'}
                                            />
                                            {//判斷有沒有評過分  
                                                score.length ?
                                                    score[index]['實習'] == '未評分' ?

                                                        <ListItemSecondaryAction>
                                                            <Button size='small'
                                                                color='primary'
                                                                onClick={
                                                                    updataScore('實習', '通過', item['applyID'])
                                                                }>通過</Button>
                                                            <Button size='small'
                                                                className={classes.btn}
                                                                onClick={
                                                                    updataScore('實習', '未通過', item['applyID'])}
                                                            >未通過</Button>
                                                        </ListItemSecondaryAction> :
                                                        <ListItemSecondaryAction>
                                                            {score[index]['實習']}
                                                        </ListItemSecondaryAction>

                                                    : null}
                                        </ListItem> : null
                                    }
                                    <Divider></Divider>
                                </>
                            )
                        }
                    </List>
                </DialogContent>
                <DialogActions>
                {/* <Button onClick={closeClass}>
                        結束班級
                    </Button> */}
                    <Button onClick={closeClass}>
                        結束班級
                    </Button>
                    <Button onClick={() => { setClassManage({ ...classManage, '彈窗': false }) }} color="primary" >
                        關閉
                    </Button>

                </DialogActions>
            </Dialog>
        </>
    )

})
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
                type: '取得老師課程',
                userID: userReducer.id
            }),

        }).then(res => {
            return res.json()
        }).then(res => {
            if (res['狀態'] == '課程下載成功') {
                setCourses(res['訊息'])
                //console.log(res['訊息']);
                // dispatch({ type: 'SHOW', text: `管理 課程下載成功`, severity: 'success' })
            } else {
                console.log(userReducer.id);
                dispatch({ type: 'SHOW', text: `管理${['訊息']}`, severity: 'error' })
            }
        })

        fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '取得老師班級',
                userID: userReducer.id
            }),
        }).then(res => {
            return res.json()
        }).then(res => {
            if (res['狀態'] == '班級下載成功') {
                //console.log(res['訊息'])
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