import React, { useState } from 'react';
import { Paper, Box, Grid, TextField, Typography, Button, AppBar, Toolbar, IconButton, Avatar, Popover, Divider } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import CourseCard from '../CourseCard'
import { host } from '../url.js'



export default function Main() {

    let loginReducer = useSelector(state => state.loginReducer)
    let userReducer = useSelector(state => state.userReducer)
    let dispatch = useDispatch()

    let [courses, setCourses] = useState([])
    // React.useEffect(() => {
    //     fetch(host, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json; charset=utf-8'
    //         },
    //         body: JSON.stringify({
    //             type:'取得課程',            
    //        }),

    //     }).then(res => {
    //         return res.json()
    //     }).then(res => {
    //         if (res['狀態'] == '課程下載成功') {
    //             setCourses(res['訊息'])
    //         } else {
    //             dispatch({ type: 'SHOW', text: `首頁${res.訊息}`, severity: 'error' })
    //         }
    //     })
    // }, [])

    return (

        <Box maxWidth='1200px' p={2} margin='auto'>

            <Grid container justify='center' spacing={3}>
                <Grid item xs={12}>
                    <Typography variant='h6'>
                        最新班級
                        </Typography>
                    <Divider />
                </Grid>
            
                {
                    // courses ?
                    //     courses.map((item) =>
                    //         <Grid item style={{ width: '100%', maxWidth: '380px', }}>
                    //             <CourseCard courseData={item} />
                    //         </Grid>
                    //     )
                    //     : null
                }
            </Grid>

        </Box >
    )
}