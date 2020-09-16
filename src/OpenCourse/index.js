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
import Collapse from '@material-ui/core/Collapse';
import Pagination from '@material-ui/lab/Pagination';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
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

export default function OpenCourse() {

    const classes = useStyles();
    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    
    //寫值
    let dispatch = useDispatch()
    let [industry, setIndustry] = React.useState('選擇產業')//第一部選擇產業
    let [QID, set_QID] = React.useState([])//QID下拉選單內容
    let [qidSelet, setQisSelect] = React.useState('')//QID下拉選單 選擇項目
    let [UOCID, set_UOCID] = React.useState([])//UOC LIST 清單
    let [Course, setCourse] = React.useState([])//課程內容
    let courseTitle = React.useRef(null)//tittle 或 傳值用
    let [courseSelect, setCourseSelct] = React.useState([]) //最後選擇的course

    let [pagination, setPagination] = React.useState(0)//分頁元件


    const [open, setOpen] = React.useState(false);



    React.useEffect(() => {
        set_UOCID([]) //清空課程清單
        if (industry == 'ICT') {
            fetch('http://localhost:8888/aqf_ICT_QID/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
            }).then((res) => {
                return res.json()
            }).then((res) => {
                if (res['狀態'] == '查詢成功') {
                    // console.log(res['訊息'])
                    set_QID(res['訊息'])
                } else {
                    dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
                }
            })
        }
        if (industry == 'ICP') {
            fetch('http://localhost:8888/aqf_ICP_QID/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
            }).then((res) => {
                return res.json()
            }).then((res) => {
                if (res['狀態'] == '查詢成功') {
                    //console.log(res['訊息'])
                    set_QID(res['訊息'])
                } else {
                    dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
                }
            })
        }

    }, [industry])

    React.useEffect(() => {
        setPagination(0) //將分頁歸零

        if (industry == 'ICT') {
            fetch('http://localhost:8888/get_Ict_Uocid_ByQid/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    qid: qidSelet
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
        }
        if (industry == 'ICP') {
            fetch('http://localhost:8888/get_Icp_Uocid_ByQid/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    qid: qidSelet
                })
            }).then(res => {
                return res.json()
            }).then(res => {
                if (res['狀態'] == '查詢成功') {
                    set_UOCID(res['訊息'])
                    console.log(res['訊息']);
                } else {
                    dispatch({ type: 'SHOW', text: ['訊息'], severity: 'error' })
                }
            })
        }

    }, [qidSelet])

    let handleClickOpen = selectUOC => (e) => {
        setOpen(true);//開啟Dialog
        courseTitle.current = selectUOC

        fetch('http://localhost:8888/get_Course_ByUoc/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                uoc: selectUOC
            })
        }).then(res => {
            return res.json()
        }).then(res => {
            console.log(res);
            if (res['狀態'] == '查詢成功') {

                setCourse(res['訊息'])
            } else {
                setCourse([])
                //dispatch({ type: 'SHOW', text: '無課程參考', severity: 'error' })
            }
        })
    };

    let handleClose = (e) => {
        setOpen(false)

    }

    //課程 選擇按鈕
    let handleChoose = (e) => {
        setOpen(false)
        if (courseSelect.indexOf(courseTitle.current) >= 0) {
           //chip已經存在
        }else{
            setCourseSelct([...courseSelect, courseTitle.current])
        }


    }
    let chipOnDelet = courseSelectId => (e) => {
        let indx = courseSelect.indexOf(courseSelectId)
        courseSelect.splice(indx, 1)
        setCourseSelct([...courseSelect])
    }

    return (
        <>
            <Box p={1} maxWidth={1200} margin='auto'>
                <Paper>
                    <Box p={2} pb={1}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant={'body2'}>產業 </Typography>
                                <Divider style={{ marginTop: 10 }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Select
                                    fullWidth
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={industry}
                                    onChange={(e) => { setIndustry(e.target.value) }}
                                    variant='outlined'
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
                                <Typography variant={'body2'}>學程</Typography>
                                <Divider style={{ marginTop: 10 }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Select
                                    fullWidth
                                    labelId="demo-simple-select-label2"
                                    id="demo-simple-select2"
                                    value={qidSelet}
                                    onChange={(e) => { setQisSelect(e.target.value) }}
                                    variant='outlined'

                                >
                                    {QID.map((item, index) =>
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
                                    <Typography variant={'body2'}>課程 </Typography>
                                </Grid>
                                <Grid item >
                                    {courseSelect.length ? courseSelect.map((item, index) =>
                                        <Chip style={{margin:5}}color='primary' label={item} size="small" onDelete={chipOnDelet(item)} onClick={handleClickOpen(item)} />
                                    )
                                        : null}
                                </Grid>
                                <Grid xs={12}>
                                    <Divider style={{ marginTop: 10 }} />
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <List dense>
                                    {/* {console.log(pagination + 10)} */}
                                    {UOCID.slice(pagination, pagination + 10).map((item, index) =>

                                        <ListItem button dense divider onClick={handleClickOpen(item['UOC_ID'])}>
                                            <ListItemText primary={item['UOC_ID']} secondary={item['UOC_TITLE']}>

                                            </ListItemText>
                                        </ListItem>
                                    )}
                                </List>

                            </Grid>
                            <Grid item container xs={12} justify='center'>
                                <Pagination count={Math.ceil(UOCID.length / 10)} onChange={(e, value) => { setPagination((value - 1) * 10) }} size="small" fullWidth />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box p={2} pt={0} pb={1}>
                        <Grid container spacing={1}>
                            <Grid item container xs={12} justify='space-between'>
                                <Grid item xs={6}>
                                    <Typography variant={'body2'}>職位 </Typography>
                                </Grid>
                                <Grid item >
                                    {/* {courseSelect.select ? <Chip color='primary' deleteIcon={<DoneIcon />} label={courseSelect.value} size="small" onDelete={()=>{}}  /> : null} */}
                                </Grid>
                                <Grid xs={12}>
                                    <Divider style={{ marginTop: 10 }} />
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <List dense>
                                    {/* {console.log(pagination + 10)} */}
                                    {UOCID.slice(pagination, pagination + 10).map((item, index) =>

                                        <ListItem button dense divider onClick={handleClickOpen(item['UOC_ID'])}>
                                            <ListItemText primary={item['UOC_ID']} secondary={item['UOC_TITLE']}>

                                            </ListItemText>
                                        </ListItem>
                                    )}
                                </List>

                            </Grid>
                            <Grid item container xs={12} justify='center'>
                                <Pagination count={Math.ceil(UOCID.length / 10)} onChange={(e, value) => { setPagination((value - 1) * 10) }} size="small" fullWidth />
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>

            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar variant="dense">
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {courseTitle.current}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleChoose}>
                            選擇
                         </Button>
                    </Toolbar>
                </AppBar>
                <Box p={1} pt={8} maxWidth={1200}>
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
                                        Course.length == 0 ? <Typography>無課程參考</Typography> :
                                            Course.map((item, index) =>
                                                <>
                                                    <ListItem divider>
                                                        <Typography>{item['Performance_Criteria']}</Typography>
                                                    </ListItem>
                                                </>
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
        </>)
}