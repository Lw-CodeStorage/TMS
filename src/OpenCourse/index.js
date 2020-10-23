import React from 'react';
import { useHistory } from "react-router-dom";
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
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Collapse from '@material-ui/core/Collapse';
import Pagination from '@material-ui/lab/Pagination';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import { host } from '../url.js'
//import CourseDetail from '../CourseDetail'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
        whiteSpace: 'normal !important'
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
    return <Slide direction="left" {...props} />;
}

export default function OpenCourse({ previewCourseData }) {

    const classes = useStyles();
    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let userReducer = useSelector(state => state.userReducer)
    //寫值
    let dispatch = useDispatch()
    //react-router
    let history = useHistory()

    let courseName = React.useRef(previewCourseData ? previewCourseData.courseName : null)
    let courseLink = React.useRef(previewCourseData ? previewCourseData.courseLink : null)//課程連結
    let courseInfo = React.useRef(previewCourseData ? previewCourseData.courseInfo : '')//課程自由填寫資訊

    //let imageFile = React.useRef(null)//照片
    let [courseImage, setCourseImage] = React.useState(null)
    let [industry, setIndustry] = React.useState('')//第一部選擇產業													

    let [QID, set_QID] = React.useState([])//QID下拉選單內容
    let [qidSelect, setQidSelect] = React.useState('')//QID下拉選單 選擇項目

    let [UOCID, set_UOCID] = React.useState([])//課程 清單
    let [Onet, setOnet] = React.useState([])//  職位 清單

    let [Detail, setDetail] = React.useState({ type: '', data: [] })//Dialog 細節

    let courseTitle = React.useRef({ type: null, selectTitle: null })//app bar tittle 或 傳值用
    let [courseSelect, setCourseSelct] = React.useState([]) //最後選擇的 課程 (chips)
    let [positionSelect, setPositionSelect] = React.useState('')//最後選擇的 職位 (chips)

    let [pagination, setPagination] = React.useState(0)//分頁元件
    let [onetPagination, setOnetPagination] = React.useState(0)//分頁元件

    let [open, setOpen] = React.useState(false);
    let [video, setVideo] = React.useState('');
    React.useEffect(() => {
        //若是從preview進來的 不去清空 chip 和 清單 ，不然結果沒辦法呈現
        if (previewCourseData) {

        } else {
            set_UOCID([]) //清空課程清單
            setOnet([])//清空職位清單
            setCourseSelct([])//換qid了 清空chip
            setPositionSelect('')
        }
        //初始設置為'' 阻擋第一次更新
        if (industry) {
            fetch(host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: '學程查詢',
                    'industry': industry
                })
            }).then((res) => {
                return res.json()
            }).then((res) => {
                if (res['狀態'] == '查詢成功') {
                    console.log('res')
                    set_QID(res['訊息'])
                } else {
                    dispatch({ type: 'SHOW', text: 'industy', severity: 'error' })
                    console.log('res')
                }
            })
        }
    }, [industry])

    React.useEffect(() => {
        if (previewCourseData) {

        } else {
            setPagination(0) //將分頁歸零
            setOnetPagination(0)
            setCourseSelct([])//換qid了 清空chip
            setPositionSelect('')
        }
        if (qidSelect) {
            //課程
            fetch(host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: '課程查詢',
                    qid: qidSelect,
                    industry: industry
                })
            }).then(res => {
                return res.json()
            }).then(res => {
                if (res['狀態'] == '查詢成功') {
                    set_UOCID(res['訊息'])
                    console.log(res['訊息']);
                } else {
                    dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
                }
            })
            //職位
            fetch(host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: '職位查詢',
                    qid: qidSelect,
                    industry: industry
                })
            }).then(res => {
                return res.json()
            }).then(res => {
                if (res['狀態'] == '查詢成功') {
                    setOnet(res['訊息'])
                    //console.log(res['訊息']);
                } else {
                    // dispatch({ type: 'SHOW', text: ['訊息'], severity: 'error' })
                }
            })
        }
    }, [qidSelect])

    React.useEffect(() => {
        //console.log(previewCourseData) 
        //這頁當作preview的話 不是undefinde 會進行處理
        if (previewCourseData) {
            //console.log(previewCourseData)
            setVideo(previewCourseData.courseLink)
            setIndustry(previewCourseData.industry)
            setQidSelect(previewCourseData.qidSelect)
            setCourseSelct(previewCourseData.courseSelect.split(','))
            setPositionSelect(previewCourseData.positionSelect)
        }

    }, [previewCourseData])
    // React.useEffect(() => {
    //     console.log(qidSelect)
    // }, [qidSelect])
    // List 課程 or 職位 選擇
    let handleClickOpen = (type, selectTitle) => (e) => {
        if (type == 'UOC') {
            setOpen(true);//開啟Dialog
            courseTitle.current.type = type
            courseTitle.current.selectTitle = selectTitle

            fetch(host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: '課程細節',
                    uoc: selectTitle,
                    industry: industry
                })
            }).then(res => {
                return res.json()
            }).then(res => {
                console.log(res);
                if (res['狀態'] == '查詢成功') {
                    setDetail({ type: 'UOC', data: res['訊息'] })
                } else {
                    setDetail({ type: 'UOC', data: [] })
                    dispatch({ type: 'SHOW', text: '無課程參考', severity: 'error' })
                }
            })
        }
        if (type == 'Onet') {
            setOpen(true);//開啟Dialog
            courseTitle.current.type = type
            courseTitle.current.selectTitle = selectTitle

            fetch(host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: '職位任務',
                    onet: selectTitle,
                })
            }).then(res => {
                return res.json()
            }).then(res => {
                console.log(res);
                if (res['狀態'] == '查詢成功') {
                    setDetail({ type: 'Onet', data: res['訊息'] })
                } else {
                    setDetail({ type: 'Onet', data: [] })
                    dispatch({ type: 'SHOW', text: '無課程參考', severity: 'error' })
                }
            })
        }
    };

    let handleClose = (e) => {
        setOpen(false)
    }
    //appbar 課程 選擇按鈕
    let handleChoose = (e) => {
        setOpen(false)
        if (courseTitle.current.type == 'UOC') {
            if (courseSelect.indexOf(courseTitle.current.selectTitle) >= 0) {
                //chip已經存在
            } else {
                setCourseSelct([...courseSelect, courseTitle.current.selectTitle])
            }
        }
        if (courseTitle.current.type == 'Onet') {
            setPositionSelect(courseTitle.current.selectTitle)
        }

    }
    //刪除chip
    let chipOnDelet = (type, chipSelectId) => (e) => {
        if (type == 'UOC') {
            let indx = courseSelect.indexOf(chipSelectId)
            courseSelect.splice(indx, 1)
            setCourseSelct([...courseSelect])
        }
        if (type == 'Onet') {
            setPositionSelect('')
        }
    }
    function addVideo(e) {

    }
    //照片預覽
    // let courseImagePreview = (e) => {
    //     let reader = new FileReader()
    //     imageFile.current = e.target.files[0];
    //     reader.readAsDataURL(imageFile.current)
    //     reader.onload = function (e) {
    //         setCourseImage(e.target.result)
    //     }
    // }

    let handleSubmit = (e) => {
        e.preventDefault()
        let imageName = `${userReducer.email}-${courseName.current}`
        //上傳照片
        // if (imageFile.current) {
        //     if ((imageFile.current.type == "image/jpg" || imageFile.current.type == 'image/jpeg' || imageFile.current.type == 'image/png') && imageFile.current.size <= 1000000) {
        //         let formData = new FormData()
        //         //上傳時以使用者 和課程名稱 命名照片
        //         formData.append('courseImage', imageFile.current, `${imageName}`)
        //         fetch(`${host}/courseImageUpload/`, {
        //             method: 'POST',
        //             body: formData,
        //         }).then(res => {
        //             return res.json()
        //         }).then(res => {
        //             // console.log(res);
        //             // if (res.狀態 == '上傳成功') {
        //             //     dispatch({ type: 'SHOW', text: res.訊息, severity: 'success' })
        //             //     window.location.reload();
        //             // } else {
        //             //     dispatch({ type: 'SHOW', text: res.訊息, severity: 'error' })
        //             // }
        //         })
        //     } else {
        //         dispatch({ type: 'SHOW', text: '照片格式不符', severity: 'error' })
        //     }
        // } else {
        //     imageName = '沒有照片'
        // }
        if (previewCourseData) {
            fetch(host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: '更新課程',
                    courseData: {
                        //課程ID
                        'courseID': previewCourseData.id,
                        //CourseName
                        'courseName': courseName.current,
                        //課程資訊
                        'courseInfo': courseInfo.current.replace(/\r\n/g, `\r\n`).replace(/\n/g, `\r\n`),
                        //課程連結
                        'courseLink': video,
                        //產業別選擇
                        'industry': industry,
                        //學程選擇
                        'qidSelect': qidSelect,
                        //課程選擇
                        'courseSelect': courseSelect,
                        //職位選擇
                        'positionSelect': positionSelect,
                        //照片名稱
                        // 'imageName': imageName,
                    }
                })
            }).then(res => {
                return res.json()
            }).then(res => {
                if (res['狀態'] == '課程更新成功') {
                    //dispatch({ type: 'SHOW', text: res['訊息'], severity: 'success' })
                } else {
                    //dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
                }
            })

        } else {
            fetch(host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: '開設課程',
                    courseData: {
                        //創建課程帳號ID
                        'userID': userReducer.id,
                        //CourseName
                        'courseName': courseName.current,
                        //課程資訊
                        'courseInfo': courseInfo.current.replace(/\r\n/g, `\r\n`).replace(/\n/g, `\r\n`),
                        //課程連結
                        'courseLink': video,
                        //產業別選擇
                        'industry': industry,
                        //學程選擇
                        'qidSelect': qidSelect,
                        //課程選擇
                        'courseSelect': courseSelect,
                        //職位選擇
                        'positionSelect': positionSelect,
                        //照片名稱
                        // 'imageName': imageName,
                    }
                })
            }).then(res => {
                return res.json()
            }).then(res => {
                if (res['狀態'] == '課程開設成功') {
                    dispatch({ type: 'SHOW', text: res['訊息'], severity: 'success' })
                    history.push('/管理')
                } else {
                    dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
                }
            })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box p={2} maxWidth={1200} margin='auto'>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Paper>
                            {/* <Box p={2} pb={1}>
                                <Grid container spacing={1}>
                                    <Grid item container xs={12} justify='space-between' alignItems='baseline'>
                                        <Grid item >
                                            <Typography variant={'body2'}>課程圖片 </Typography>
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
                                                <img src={courseImage} style={{ width: '100%', height: 400, objectFit: "cover" }} /> :
                                                <div style={{
                                                    width: '100%', height: 200, background: '#F0F0F0',
                                                    display: 'flex', justifyContent: "center", alignItems: "center",
                                                }}>
                                                </div>
                                        }
                                    </Grid>
                                </Grid>

                            </Box> */}
                            <Box p={2} pt={0} pb={1}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant={'body2'}>課程名稱 </Typography>
                                        <Divider style={{ marginTop: 10 }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth variant='outlined' size='small' onChange={(e) => { courseName.current = e.target.value }} value={courseName.current} disabled={previewCourseData ? true : false} required/>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box p={2} pt={0} pb={1}>
                                <Grid container spacing={1} justify='center'>
                                    <Grid item xs={12}>
                                        <Typography variant={'body2'}>課程連結 </Typography>
                                        <Divider style={{ marginTop: 10 }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth variant='outlined' size='small' onChange={(e) => { setVideo(e.target.value) }} component='a' value={courseLink.current} disabled={previewCourseData ? true : false} />
                                    </Grid>
                                    <Grid item xs={12} style={{ maxWidth: 400, }}>
                                        <iframe style={{ width: '100%', height: 225 }} id="player" src={`https://www.youtube.com/embed/${video}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen='true'></iframe>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box p={2} pt={0} pb={1}>
                                <Grid container spacing={1}>
                                    <Grid item container xs={12} justify='space-between'>
                                        <Grid item xs={6}>
                                            <Typography variant={'body2'}>課程內容</Typography>
                                        </Grid>

                                        <Grid xs={12}>
                                            <Divider style={{ marginTop: 10 }} />
                                        </Grid>
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
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant={'body2'}>選擇產業 </Typography>
                                        <Divider style={{ marginTop: 10 }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Select
                                            fullWidth
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"

                                            onChange={(e) => { setIndustry(e.target.value) }}
                                            variant='outlined'
                                            disabled={previewCourseData ? true : false}
                                            value={`${industry}`}
                                        >
                                            <MenuItem value={'ICP'}>ICP</MenuItem>
                                            <MenuItem value={'ICT'}>ICT</MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box p={2} pt={0} pb={1}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant={'body2'}>選擇學程</Typography>
                                        <Divider style={{ marginTop: 10 }} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Select
                                            fullWidth
                                            labelId="demo-simple-select-label2"
                                            id="demo-simple-select2"

                                            onChange={(e) => { setQidSelect(e.target.value) }}
                                            variant='outlined'
                                            disabled={previewCourseData ? true : false}

                                            value={`${qidSelect}`}
                                        >
                                            {QID.map((item, index) =>
                                                // <MenuItem>
                                                // </MenuItem>
                                                <ListItem button dense value={item['QID']} divider >
                                                    <ListItemText primary={item['QID']} secondary={item['QID_Name']} style={{ whiteSpace: "normal" }} />
                                                </ListItem>
                                            )}
                                        </Select>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box p={2} pt={0} pb={1}>
                                <Grid container spacing={1}>
                                    <Grid item container xs={12} justify='space-between'>
                                        <Grid item xs={6}>
                                            <Typography variant={'body2'}>選擇課程 </Typography>
                                        </Grid>
                                        <Grid item >
                                            {
                                                //split分割'',還是''有長度1 
                                                courseSelect.length && courseSelect[0] != '' ? courseSelect.map((item, index) =>

                                                    < Chip style={{ margin: 5 }} color='primary' label={item} size="small" onDelete={previewCourseData ? null : chipOnDelet('UOC', item)} onClick={handleClickOpen('UOC', item)} />
                                                )
                                                    : null

                                            }
                                        </Grid>
                                        <Grid xs={12}>
                                            <Divider style={{ marginTop: 10 }} />
                                        </Grid>
                                    </Grid>
                                    {
                                        previewCourseData ? null :
                                            <>
                                                <Grid item xs={12}>

                                                    <List dense>

                                                        {UOCID.slice(pagination, pagination + 10).map((item, index) =>

                                                            <ListItem button dense divider onClick={handleClickOpen('UOC', item['UOC_ID'])}>
                                                                <ListItemText primary={item['UOC_ID']} secondary={item['UOC_TITLE']} />
                                                            </ListItem>
                                                        )}
                                                    </List>



                                                </Grid>
                                                <Grid item container xs={12} justify='center'>
                                                    <Pagination count={Math.ceil(UOCID.length / 10)} onChange={(e, value) => { setPagination((value - 1) * 10) }} size="small" fullWidth />
                                                </Grid>
                                            </>
                                    }
                                </Grid>
                            </Box>
                            <Box p={2} pt={0} pb={1}>
                                <Grid container spacing={1}>
                                    <Grid item container xs={12} justify='space-between'>
                                        <Grid item xs={6}>
                                            <Typography variant={'body2'}>選擇職位 </Typography>
                                        </Grid>
                                        <Grid item >
                                            {positionSelect ? <Chip color='primary' label={positionSelect} size="small" onClick={handleClickOpen('Onet', positionSelect)} onDelete={previewCourseData ? null : chipOnDelet('Onet', positionSelect)} /> : null}
                                        </Grid>
                                        <Grid xs={12}>
                                            <Divider style={{ marginTop: 10 }} />
                                        </Grid>
                                    </Grid>
                                    {/* 偵測預覽關閉LIST */}
                                    {previewCourseData ? null :
                                        <>
                                            <Grid item xs={12}>

                                                <List dense>
                                                    {/* {console.log(pagination + 10)} */}
                                                    {Onet.slice(onetPagination, onetPagination + 10).map((item, index) =>

                                                        <ListItem button dense divider onClick={handleClickOpen('Onet', item['soc_id'])}>
                                                            <ListItemText primary={item['soc_id']} secondary={item['soc_title']} />
                                                        </ListItem>
                                                    )}
                                                </List>

                                            </Grid>
                                            <Grid item container xs={12} justify='center'>
                                                <Pagination count={Math.ceil(Onet.length / 10)} onChange={(e, value) => { setOnetPagination((value - 1) * 10) }} size="small" fullWidth />
                                            </Grid>
                                        </>
                                    }
                                </Grid>
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

            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar variant="dense">
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {courseTitle.current.selectTitle}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleChoose}>
                            選擇
                         </Button>
                    </Toolbar>
                </AppBar>
                <Box p={1} maxWidth={1200} width={'100%'} mt={8} m={'auto'} >
                    <Paper>
                        <Box p={2} pb={1}>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography>內容</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>

                                <Grid item xs={12}>
                                    {
                                        Detail.type == 'UOC' ?
                                            Detail.data.length == 0 ?
                                                <Typography>無課程參考</Typography> :
                                                Detail.data.map((item, index) =>
                                                    <>
                                                        <ListItem divider>
                                                            <Typography>{item['Performance_Criteria']}</Typography>
                                                        </ListItem>
                                                    </>
                                                )
                                            : Detail.data.length == 0 ?
                                                <Typography>無任務參考</Typography> :
                                                Detail.data.map((item, index) =>
                                                    <ListItem divider>
                                                        <Typography>{item['soc_dwa_desc']}</Typography>
                                                    </ListItem>
                                                )
                                    }
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Box>
            </Dialog>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackBarReducer.open} autoHideDuration={3000} onClose={() => dispatch({ type: 'HIDEN' })}>
                <Alert onClose={() => dispatch({ type: 'HIDEN' })} severity={snackBarReducer.severity}>
                    {snackBarReducer.text}
                </Alert>
            </Snackbar>
        </form>)
}