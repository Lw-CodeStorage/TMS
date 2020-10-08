import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Paper, Box, Grid, TextField, Typography, Button, AppBar, Toolbar, IconButton, Avatar, Popover, Divider } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

import noImage from '../img/noimage.svg'
import {host} from '../url.js'
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({

}));



export default function CourseCard({ courseData }) {
    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let userReducer = useSelector(state => state.userReducer)
    let d = new Date(courseData.time)
    let t = `${d.getHours() + 1}:${d.getMinutes() + 1}` //時間
    d = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`//日期

    //寫值
    let dispatch = useDispatch()
    React.useEffect(() => {
        console.log(courseData);
    }, [])
    return (
        <>
            <Card >
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" src={`https://tms.fois.online/imgUpload/upload/${courseData.email}.jpg`}>
                            R
                         </Avatar>
                    }
                    title={courseData.courseName}
                    subheader={`發佈 ${d} / ${t}`}
                />
                <CardMedia
                    image={noImage}
                    title="Paella dish"
                    style={{ width: '100%', height: 200 }}
                />
                <CardContent>
                    
                    {/*
                     換行保存
                     <Typography style={{ whiteSpace: "pre-wrap",height:80 ,overflow:'auto'}} noWrap>
                        {courseData.courseInfo}
                    </Typography> */}
                </CardContent>
            </Card>

        </>)
}