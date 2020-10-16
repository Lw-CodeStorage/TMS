import React from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import { set } from 'date-fns';

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

    let imageFile = React.useRef({ '班級照片檔案': null })//照片
    let [courseImage, setCourseImage] = React.useState({ '班級照片預覽': null })//照片預覽
    let [open, setOpen] = React.useState({ '新增課程彈窗': false });//課程清單彈窗
    let [previewCourse, setPreviewCourse] = React.useState({ '課程預覽彈窗': false })//預覽課程彈窗
    let [timeDialog, setTimeDialog] = React.useState({ '課程時間設定彈窗': false })//新曾課程時帶出時間設定的dialog

    let selectCourseData = React.useRef({ '選擇的課程資料': null })//課程清單LIST 選中的課程資訊 帶出去存給下一個dialog用   

    let [course, setCourse] = React.useState({ '帳戶課程': [] })//該帳戶創建過的course


    let [courseStartTime, setCourseStartTime] = React.useState(new Date())//課程開始日期
    let [courseEndTime, setCourseEndTime] = React.useState(new Date())//課程開始日期

    let [classData, setClassData] = React.useState({
        '開班資訊': {
            'uid': uuidv4(),
            '班級名稱': null,
            '上課地點': null,
            '報名連結': null,
            '人數限制': null,
            '聯絡人': null,
            '聯絡電話': null,
            '開始日期': new Date(),
            '結束日期': new Date(),
            '描述': null,
            '加入班級的課程': [],
        }
    })

    //照片預覽
    let courseImagePreview = (e) => {
        let reader = new FileReader()
        //照片預覽會變成另一種編碼 無法上傳 所以要分開存
        imageFile.current['班級照片檔案'] = e.target.files[0]
        if (imageFile.current['班級照片檔案']) {
            reader.readAsDataURL(imageFile.current['班級照片檔案'])
            reader.onload = function (e) {
                setCourseImage({ '班級照片預覽': e.target.result })
            }
        } else {
            //沒有選擇照片
        }
    }

    function handleSubmit(e) {
        e.preventDefault()
        //照片上傳的部分
        let imageName = `${userReducer.email}-${classData['開班資訊']['uid']}`
        if (imageFile.current['班級照片檔案']) {
            if ((imageFile.current['班級照片檔案'].type == "image/jpg" || imageFile.current['班級照片檔案'].type == 'image/jpeg' || imageFile.current['班級照片檔案'].type == 'image/png') && imageFile.current['班級照片檔案'].size <= 1000000) {
                let formData = new FormData()
                formData.append('test', imageFile.current['班級照片檔案'], `${imageName}`);
                fetch('https://tms.fois.online/imgUpload', {
                    method: 'POST',
                    body: formData,

                }).then(res => {
                    return res.json()
                }).then(res => {
                    console.log(res);
                    if (res.狀態 == '上傳成功') {
                        dispatch({ type: 'SHOW', text: res.訊息, severity: 'success' })
                        //window.location.reload();
                    } else {
                        dispatch({ type: 'SHOW', text: res.訊息, severity: 'error' })
                    }
                })
            } else {
                dispatch({ type: 'SHOW', text: '照片格式不符', severity: 'error' })
            }
        } else {
            console.log('沒有班級照片')
        }
        //資料寫入的部分
        setClassData({ 開班資訊: { ...classData.開班資訊, '班級名稱': e.target.value } })
        fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '開設班級',
            }),
        }).then(res => {
            return res.json()
        }).then(res => {
            //console.log(res);
            if (res['狀態'] == '課程下載成功') {
                console.log(res['訊息'])
                setCourse({ '帳戶課程': res['訊息'] })
            } else {
                dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
            }
        }).then(
            setOpen({ 新增課程彈窗: true })
        )

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
                setCourse({ '帳戶課程': res['訊息'] })
            } else {
                dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
            }
        }).then(
            setOpen({ 新增課程彈窗: true })
        )
    }
    //Dialog Course List 點下 預覽課程
    let dialogCourseListOnClick = (courseDataFromListItem) => () => {
        selectCourseData.current.選擇的課程資料 = courseDataFromListItem //帶出去存給其他dialog用
        setPreviewCourse({ '課程預覽彈窗': true })
    }
    //Dialog Course List 按鈕 點下'新增' 傳值過來
    let dialogCourseListaddCourseOnclick = (courseDataFromListItem) => () => {
        selectCourseData.current.選擇的課程資料 = courseDataFromListItem //帶出去存給其他dialog用
        setTimeDialog({ '課程時間設定彈窗': true })
    }

    //時間設定完成 將課程加入班級
    let dialogCourseTimeSettingComplete = () => {
        let StartTime = `${courseStartTime.getFullYear()}/${courseStartTime.getMonth() + 1}/${courseStartTime.getDate()} ${courseStartTime.getHours()}:${courseStartTime.getMinutes() < 9 ? `${'0' + courseStartTime.getMinutes()}` : courseStartTime.getMinutes()}`
        let EndTime = `${courseEndTime.getFullYear()}/${courseEndTime.getMonth() + 1}/${courseEndTime.getDate()} ${courseEndTime.getHours()}:${courseEndTime.getMinutes() < 9 ? `${'0' + courseEndTime.getMinutes()}` : courseEndTime.getMinutes()}`

        setClassData({
            開班資訊: {
                ...classData.開班資訊,
                加入班級的課程: [...classData['開班資訊']['加入班級的課程'],
                {
                    'uid': uuidv4(),
                    'courseName': selectCourseData.current.選擇的課程資料.courseName,
                    'startTime': StartTime,
                    'endTime': EndTime
                }]
            }
        })

        setTimeDialog({ '課程時間設定彈窗': false })
    }

    let deleteCourse = (deleteItem) => () => {
        //會過濾出 不是條件裡的 data
        let newCourseList = classData['開班資訊']['加入班級的課程'].filter(item => item != deleteItem)
        setClassData({
            開班資訊: {
                ...classData.開班資訊,
                加入班級的課程: newCourseList 
            }
        })
    }

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
                                                courseImage.班級照片預覽 ?
                                                    <img src={courseImage.班級照片預覽} style={{ width: '100%', height: 250, objectFit: "cover" }} /> :
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
                                            <TextField fullWidth variant='outlined' size='small' onChange={(e) => {
                                                setClassData({ 開班資訊: { ...classData.開班資訊, '班級名稱': e.target.value } })
                                            }} value={classData['開班資訊']['班級名稱']} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant={'body2'}>上課地點 </Typography>
                                            <Divider style={{ marginTop: 10 }} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth variant='outlined' size='small'
                                                onChange={(e) => {
                                                    setClassData({ 開班資訊: { ...classData.開班資訊, '上課地點': e.target.value } })
                                                }}
                                                value={classData['開班資訊']['上課地點']}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>

                                        <Grid item xs={12}>
                                            <Typography variant={'body2'}>班級設定</Typography>
                                            <Divider style={{ marginTop: 10 }} />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextField label='報名連結' fullWidth variant='outlined' size='small'
                                                onChange={(e) => {
                                                    setClassData({ 開班資訊: { ...classData.開班資訊, '報名連結': e.target.value } })
                                                }}
                                                value={classData['開班資訊']['報名連結']}
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextField label='人數限制' fullWidth variant='outlined' size='small'
                                                onChange={(e) => {
                                                    setClassData({ 開班資訊: { ...classData.開班資訊, '人數限制': e.target.value } })
                                                }}
                                                value={classData['開班資訊']['人數限制']}
                                            />
                                        </Grid>


                                        <Grid item xs={6}>
                                            <TextField label='聯絡人' fullWidth variant='outlined' size='small'
                                                onChange={(e) => {
                                                    setClassData({ 開班資訊: { ...classData.開班資訊, '聯絡人': e.target.value } })
                                                }}
                                                value={classData['開班資訊']['聯絡人']}
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextField label='聯絡電話' fullWidth variant='outlined' size='small'
                                                onChange={(e) => {
                                                    setClassData({ 開班資訊: { ...classData.開班資訊, '聯絡電話': e.target.value } })
                                                }}
                                                value={classData['開班資訊']['聯絡電話']}
                                            />
                                        </Grid>
                                        <Grid item xs >
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={twLocale}>
                                                <DatePicker
                                                    fullWidth
                                                    value={classData['開班資訊']['開始日期']}
                                                    inputVariant="outlined"
                                                    format="yyyy/MM/dd"
                                                    label='開始日期'
                                                    size='small'
                                                    onChange={(e) => {
                                                        setClassData({ 開班資訊: { ...classData.開班資訊, '開始日期': e } })
                                                    }} />
                                            </MuiPickersUtilsProvider>
                                        </Grid>

                                        <Grid item xs >
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={twLocale}>
                                                <DatePicker
                                                    fullWidth
                                                    value={classData['開班資訊']['結束日期']}
                                                    inputVariant="outlined"
                                                    format="yyyy/MM/dd"
                                                    label='結束日期'
                                                    size='small'
                                                    onChange={(e) => {
                                                        setClassData({ 開班資訊: { ...classData.開班資訊, '結束日期': e } })
                                                    }} />
                                            </MuiPickersUtilsProvider>
                                        </Grid>

                                        <Grid item xs={12} >
                                            <Typography variant={'body2'}>描述</Typography>
                                            <Divider style={{ marginTop: 10 }} />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField variant="outlined" fullWidth multiline rowsMax='10' rows='10' label="P.S."
                                                onChange={(e) => {
                                                    setClassData({ 開班資訊: { ...classData.開班資訊, '描述': e.target.value } })
                                                }}
                                                value={classData['開班資訊']['描述']}
                                            />

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
                                            classData['開班資訊']['加入班級的課程'].map(item =>
                                                <ListItem key={item.uid} divider disableGutters dense>
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
                open={open.新增課程彈窗}
                onClose={() => setOpen({ 新增課程彈窗: false })}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='sm'
                fullWidth
                scroll={'paper'}
            >
                <DialogTitle id="alert-dialog-title">{"已開設的課程"}</DialogTitle>
                <DialogContent>
                    <List>
                        {course['帳戶課程'].map(item =>
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
                    <Button size='small' variant='contained' onClick={() => { setOpen({ 新增課程彈窗: false }) }} color="primary" autoFocus>
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
            {/* 新增課程時設定時間 */}
            <Dialog
                open={timeDialog.課程時間設定彈窗}
                TransitionComponent={Transition}
                maxWidth='sm'
                fullWidth
                onClose={() => { setTimeDialog({ '課程時間設定彈窗': false }) }}

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
                open={previewCourse.課程預覽彈窗}
                onClose={() => { setPreviewCourse({ '課程預覽彈窗': false }) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='lg'
                classes={{
                    paper: classes.dialogMargin
                }}
                scroll={'paper'}

            >
                <DialogContent style={{ padding: 0 }}>
                    <OpenCourse previewCourseData={selectCourseData.current.選擇的課程資料} />
                </DialogContent>

                <DialogActions>
                    <Button size='small' variant='contained' onClick={() => { setPreviewCourse({ '課程預覽彈窗': false }) }} color="primary" autoFocus>
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