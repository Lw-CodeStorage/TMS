import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Paper, Box, Grid, TextField, Typography, Button, AppBar, Toolbar, IconButton, Avatar, Popover, Divider } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
// import { CssBaseline } from '@material-ui/core'
// import Chip from '@material-ui/core/Chip';
// import DoneIcon from '@material-ui/icons/Done';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';

import noImage from '../img/noimage.svg'
import './main.css'
import { host } from '../url.js'
import { makeStyles } from '@material-ui/core/styles';
import OpenClass from '../OpenClass'
const useStyles = makeStyles((theme) => ({
    root: {
        margin: '5px !important'
    },
    textOverflow: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',

    }
}));


export default React.memo(function ClassCard({ classData }) {
    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let userReducer = useSelector(state => state.userReducer)
    let startTime = new Date(classData['開始日期'])
    let endTime = new Date(classData['結束日期'])

    let st = `${startTime.getHours() + 1}:${startTime.getMinutes() + 1}` //時間
    let sd = `${startTime.getFullYear()}-${startTime.getMonth() + 1}-${startTime.getDate()}`//日期
    let et = `${endTime.getHours() + 1}:${endTime.getMinutes() + 1}` //時間
    let ed = `${endTime.getFullYear()}-${endTime.getMonth() + 1}-${endTime.getDate()}`//日期

    //寫值
    let dispatch = useDispatch()
    // React.useEffect(() => {
    //     console.log(classData);
    // }, [])
    let [open, setOpen] = React.useState(false);
    //報名
    let classes = useStyles()
    let apply = (classID) => () => {
        console.log(classID);
        fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '報名班級',
                applyData: {
                    userID: userReducer.id,
                    classID:classID
                }
            }),
        }).then(res => {
            return res.json()
        }).then(res => {
            window.location.reload()
            //由於這是子層 沒辦法觸發Main層的effect
            //故使用重整 
        })
    }
    React.useEffect(()=>{
        console.log('noMemo');
    })
    return (
        <>
            <Card >
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" src={classData['picture']}></Avatar>
                    }
                    title={classData['班級名稱']}
                    subheader={`${sd} ~ ${ed}`}
                />
                <CardMedia style={{ cursor: 'pointer' }} onClick={() => { setOpen(true) }}
                    image={`https://tms.fois.online/imgUpload/upload/${classData['email']}-${classData['imageUid']}.jpg`}
                    title="Paella dish"
                    component="img"//把它變成img DOM 才能使用onError 
                    onError={
                        (e) => { e.target.onerror = null; e.target.src = noImage }
                    }
                    style={{ width: '100%', height: 200 }}
                />
                <CardContent style={{ paddingBottom: '0px' }}>
                    <p className='textOverFlow'>
                        {classData['描述']}
                    </p>
                </CardContent>
                <Divider></Divider>
                {
                    //老師不能按
                    userReducer['Authority'] == '老師' ? null :
                        <>
                            {
                                //有沒有登入
                                userReducer['Authority'] ?
                                    <CardActions style={{ justifyContent: 'flex-end' }}>
                                        <Button
                                            component='a' //轉為 <a> tag
                                            href={`${classData['報名連結']}`}
                                            color='primary'
                                            variant='outlined'
                                            target="_blank"//<a>tag 開分頁 
                                            onClick={
                                                apply(classData['id'])
                                            }
                                        >我要報名</Button>
                                    </CardActions> :
                                    <CardActions style={{ justifyContent: 'flex-end' }}>
                                        <Button
                                            color='primary'
                                            variant='outlined'
                                            onClick={() => {
                                                //console.log('我要報名未登入')
                                                dispatch({ type: 'SHOW', text: '請登入', severity: 'error' })
                                            }}
                                        >我要報名</Button>
                                    </CardActions>
                            }


                        </>
                }

            </Card>
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
                    <OpenClass
                        previewClassData={classData}
                        preview={true}
                    //setUpdataButtonClick={setUpdataButtonClick}
                    />
                </DialogContent>
                <DialogActions>

                    <Button onClick={() => { setOpen(false) }} color="primary" autoFocus>
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
            {/* <div className='test'></div> */}
        </>)
})