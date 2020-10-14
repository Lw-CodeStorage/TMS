import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Paper, Box, Grid, TextField, Typography, Button, AppBar, Toolbar, IconButton, Avatar, Popover, Divider } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Collapse from '@material-ui/core/Collapse';
import Pagination from '@material-ui/lab/Pagination';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

import { DatePicker, DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import twLocale from "date-fns/locale/zh-TW"; //日期語言包

import { host } from '../url.js'
import OpenCourse from '../OpenCourse'
import { setDayOfYear } from 'date-fns/fp';

const useStyles = makeStyles((theme) => ({
    dialogMargin: {
        margin: '5px !important'
    },
    appBar: {
        position: 'fixed',

    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

function Transition(props) {
    //console.log(props);
    return <Slide direction="up" {...props} />;
}

export default function OpenClass({ previewCourseData }) {

    const classes = useStyles();
    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let userReducer = useSelector(state => state.userReducer)

    //寫值
    let dispatch = useDispatch()

    let className = React.useRef(previewCourseData ? previewCourseData.className : null)
    let classLink = React.useRef(previewCourseData ? previewCourseData.classLink : null)//課程連結
    let courseInfo = React.useRef(previewCourseData ? previewCourseData.courseInfo : null)//課程自由填寫資訊

    let imageFile = React.useRef(null)//照片檔案
    let [courseImage, setCourseImage] = React.useState(null)//照片預覽
    let [open, setOpen] = React.useState(false);//課程清單彈窗
    let [previewCourse, setPreviewCourse] = React.useState(false)//預覽課程彈窗
    let [timeDialog, setTimeDialog] = React.useState(false)//新曾課程時帶出時間設定的dialog
    let selectCourseData = React.useRef(null)//課程清單LIST 選中的課程資訊 帶出去存給下一個dialog用   


    let [course, setCourse] = React.useState([])//該帳戶創建過的course
    let [inClassCourse, setInClassCourse] = React.useState([])//在班級中被新增的課程

    let [classStartTime, setClassStartTime] = React.useState(new Date()); //班級開始日期
    let [classEndTime, setClassEndTime] = React.useState(new Date()); //班級結束日期
    let [courseStartTime, setCourseStartTime] = React.useState(new Date())//課程開始日期
    let [courseEndTime, setCourseEndTime] = React.useState(new Date())//課程開始日期
    //照片預覽
    let courseImagePreview = (e) => {
        let reader = new FileReader()
        imageFile.current = e.target.files[0];
        reader.readAsDataURL(imageFile.current)
        reader.onload = function (e) {
            setCourseImage(e.target.result)
        }
    }

    function handleSubmit() {

    }

    function addCourseOnclick() {
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
            //console.log(res);
            if (res['狀態'] == '課程下載成功') {
                console.log(res['訊息'])
                setCourse(res['訊息'])
            } else {
                dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
            }
        }).then(
            setOpen(true)
        )
    }
    //Dialog Course List 點下 預覽課程
    let dialogCourseListOnClick = (courseDataFromListItem) => () => {
        selectCourseData.current = courseDataFromListItem //帶出去存給其他dialog用
        setPreviewCourse(true)
    }
    //Dialog Course List 按鈕 點下'新增' 傳值過來
    let dialogCourseListaddCourseOnclick = (courseDataFromListItem) => () => {
        selectCourseData.current = courseDataFromListItem //帶出去存給其他dialog用
        setTimeDialog(true)
    }

    let dialogCourseTimeSettingComplete = () => {
        //選到0-9會只有一個數字出現，最後做了一個判斷去整形一下

        let StartTime = `${courseStartTime.getFullYear()}/${courseStartTime.getMonth() + 1}/${courseStartTime.getDate()} ${courseStartTime.getHours()}:${courseStartTime.getMinutes() < 9 ? `${'0' + courseStartTime.getMinutes()}` : courseStartTime.getMinutes()}`
        let EndTime = `${courseEndTime.getFullYear()}/${courseEndTime.getMonth() + 1}/${courseEndTime.getDate()} ${courseEndTime.getHours()}:${courseEndTime.getMinutes() < 9 ? `${'0' + courseEndTime.getMinutes()}` : courseEndTime.getMinutes()}`

        setInClassCourse([...inClassCourse, {...selectCourseData.current,'startTime':StartTime,'endTime':EndTime}])
        setTimeDialog(false)
    }

    let deleteCourse = (deleteItem)=>()=>{
        let newCourseList = inClassCourse.filter(item => item != deleteItem)
        setInClassCourse([...newCourseList])
    }

    React.useEffect(() => {
        console.log(inClassCourse);
    }, [inClassCourse])
    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box p={2} maxWidth={1200} margin='auto'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper>
                                <Box p={2} pb={1}>
                                    <Grid container spacing={1}>
                                        <Grid item container xs={12} justify='space-between' alignItems='baseline'>
                                            <Grid item >
                                                <Typography variant={'body2'}>班級圖片 </Typography>
                                            </Grid>
                                            <Grid item >
                                                <input id='courseImage' type="file" accept=".jpg,.jpeg,.png" hidden onChange={courseImagePreview} />
                                                <label htmlFor="courseImage">
                                                    <IconButton color="primary" aria-label="upload picture" component="span" style={{ height: 36, width: 36 }}>
                                                        <PhotoCamera />
                                                    </IconButton>
                                                     添加照片
                                                   </label>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider style={{ marginTop: 10 }} />
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            {
                                                courseImage ?
                                                    <img src={courseImage} style={{ width: '100%', height: 250, objectFit: "cover" }} /> :
                                                    <div style={{
                                                        width: '100%', height: 250, background: '#F0F0F0',
                                                        display: 'flex', justifyContent: "center", alignItems: "center",
                                                    }}>
                                                    </div>
                                            }
                                        </Grid>
                                    </Grid>

                                </Box>
                                <Box p={2} pt={0} pb={1}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant={'body2'}>班級名稱 </Typography>
                                            <Divider style={{ marginTop: 10 }} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth variant='outlined' size='small' onChange={(e) => { className.current = e.target.value }} value={className.current} disabled={previewCourseData ? true : false} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant={'body2'}>上課地點 </Typography>
                                            <Divider style={{ marginTop: 10 }} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth variant='outlined' size='small' disabled={previewCourseData ? true : false} />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>

                                        <Grid item xs={12}>
                                            <Typography variant={'body2'}>班級設定</Typography>
                                            <Divider style={{ marginTop: 10 }} />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextField label='報名連結' fullWidth variant='outlined' size='small' component='a' value={classLink.current} disabled={previewCourseData ? true : false} />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextField label='人數限制' fullWidth variant='outlined' size='small' component='a' disabled={previewCourseData ? true : false} />
                                        </Grid>


                                        <Grid item xs={6}>
                                            <TextField label='聯絡人' fullWidth variant='outlined' size='small' component='a' disabled={previewCourseData ? true : false} />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextField label='聯絡電話' fullWidth variant='outlined' size='small' component='a' disabled={previewCourseData ? true : false} />
                                        </Grid>
                                        <Grid item xs >
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={twLocale}>
                                                <DatePicker
                                                    fullWidth
                                                    value={classStartTime}
                                                    inputVariant="outlined"
                                                    format="yyyy/MM/dd"
                                                    label='開始日期'
                                                    size='small'
                                                    onChange={setClassStartTime} />
                                            </MuiPickersUtilsProvider>
                                        </Grid>

                                        <Grid item xs >
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={twLocale}>
                                                <DatePicker
                                                    fullWidth
                                                    value={classEndTime}
                                                    inputVariant="outlined"
                                                    format="yyyy/MM/dd"
                                                    label='結束日期'
                                                    size='small'
                                                    onChange={setClassEndTime} />
                                            </MuiPickersUtilsProvider>
                                        </Grid>

                                        <Grid item xs={12} >
                                            <Typography variant={'body2'}>描述</Typography>
                                            <Divider style={{ marginTop: 10 }} />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField variant="outlined" fullWidth multiline rowsMax='10' rows='10' label="P.S." onChange={(e) => { courseInfo.current = e.target.value }} value={courseInfo.current} disabled={previewCourseData ? true : false} />
                                        </Grid>

                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Paper>
                                <Box p={2} pb={1}>
                                    <List>
                                        {
                                            inClassCourse.map(item =>
                                                <ListItem divider disableGutters dense>
                                                    <ListItemText primary={item['courseName']} secondary={`${item.startTime} ~ ${item.endTime}`} />
                                                    <ListItemSecondaryAction>
                                                        <Button onClick={deleteCourse(item)}>
                                                            刪除
                                                        </Button>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            )
                                        }
                                    </List>
                                    <Button color='primary' variant='outlined' fullWidth onClick={addCourseOnclick}>
                                        增加課程
                                </Button>
                                </Box>

                            </Paper>
                        </Grid>
                        {
                            //因為這一頁也有預覽的功能，利用prop資料還沒傳近來會是undefinde的特性，去當分類
                            //若為undefinde代表這一頁還沒有要當作preview頁面的功能
                            previewCourseData ?
                                null : <Grid item xs={12}>
                                    <Button variant='contained' type='submit' color='primary' fullWidth>送出</Button>
                                </Grid>
                        }
                    </Grid>
                </Box>


            </form>
            {/* 預覽已開課程清單 */}
            <Dialog
                open={open}
                onClose={() => { setOpen(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='sm'
                fullWidth
                scroll={'paper'}
            >
                <DialogTitle id="alert-dialog-title">{"已新增的課程"}</DialogTitle>
                <DialogContent>
                    <List>
                        {course.map(item =>
                            <ListItem dense divider button onClick={dialogCourseListOnClick(item)} >
                                <ListItemText primary={item['courseName']} />
                                <ListItemSecondaryAction>
                                    <Button onClick={dialogCourseListaddCourseOnclick(item)} color='primary'>新增</Button>
                                </ListItemSecondaryAction>
                            </ListItem>

                        )}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button size='small' variant='contained' onClick={() => { setOpen(false) }} color="primary" autoFocus>
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
            {/* 新增課程時設定時間 */}
            <Dialog
                open={timeDialog}
                TransitionComponent={Transition}
                maxWidth='sm'
                fullWidth
                onClose={() => { setTimeDialog(false) }}

            >
                <DialogTitle id="alert-dialog-slide-title">{"設定上課時間"}</DialogTitle>
                <DialogContent>
                    <Grid container alignItems='center' justify='space-around' spacing={2}>
                        <Grid item>
                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={twLocale}>
                                <DateTimePicker
                                    value={courseStartTime}
                                    inputVariant="outlined"
                                    format="yyyy/MM/dd hh:mm a"
                                    label='開始'
                                    size='small'
                                    onChange={setCourseStartTime} />
                            </MuiPickersUtilsProvider>
                        </Grid>

                        <Grid item> <MuiPickersUtilsProvider utils={DateFnsUtils} locale={twLocale}>
                            <DateTimePicker

                                value={courseEndTime}
                                inputVariant="outlined"
                                format="yyyy/MM/dd hh:mm a"
                                label='結束'
                                size='small'
                                onChange={setCourseEndTime} />
                        </MuiPickersUtilsProvider></Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={dialogCourseTimeSettingComplete} color="primary">
                        確定
                     </Button>
                </DialogActions>
            </Dialog>

            {/* 預覽課程 */}
            <Dialog
                open={previewCourse}
                onClose={() => { setPreviewCourse(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='lg'
                classes={{
                    paper: classes.dialogMargin
                }}
                scroll={'paper'}

            >
                <DialogContent style={{ padding: 0 }}>
                    <OpenCourse previewCourseData={selectCourseData.current} />
                </DialogContent>

                <DialogActions>
                    <Button size='small' variant='contained' onClick={() => { setPreviewCourse(false) }} color="primary" autoFocus>
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackBarReducer.open} autoHideDuration={3000} onClose={() => dispatch({ type: 'HIDEN' })}>
                <Alert onClose={() => dispatch({ type: 'HIDEN' })} severity={snackBarReducer.severity}>
                    {snackBarReducer.text}
                </Alert>
            </Snackbar>
        </>)
}