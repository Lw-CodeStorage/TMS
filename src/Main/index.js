import React, { useState } from 'react';
import { Paper, Box, Grid, TextField, Typography, Button, AppBar, Toolbar, IconButton, Avatar, Popover, Divider } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import ClassCard from '../ClassCard'
import { host } from '../url.js'
import banner from '../img/banner.jpg'


export default function Main() {

    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let loginReducer = useSelector(state => state.loginReducer)
    let userReducer = useSelector(state => state.userReducer)
    let dispatch = useDispatch()

    let [classData, setClassData] = useState([])
    let [remainClass, setRemainClass] = useState([])

    React.useEffect(() => {
        console.log('公開課程查詢')
        //console.log(userReducer);
        fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '公開取得班級',
            }),

        }).then(res => {
            return res.json()
        }).then(res => {
            console.log(res);
            if (res['狀態'] == '公開班級取得成功') {
                //    console.log(res['訊息']);
                setClassData(res['訊息'])
            } else {
                dispatch({ type: 'SHOW', text: `${res.訊息}`, severity: 'error' })
            }
        })



    }, [])
    React.useEffect(() => {
        if (loginReducer) {
            console.log('帳號已選課程查詢');
            fetch(host, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify({
                    type: '使用者已報名班級',
                    userID: userReducer.id
                }),

            }).then(res => {
                return res.json()

            }).then(res => {

                if (res['狀態'] == '使用者已報名班級查詢成功') {
                    console.log(res);
                    // console.log(classData.filter(classData =>
                    //     res['訊息'].map(userClass => userClass['classID']).indexOf(classData['id']) < 0
                    // ));

                    setRemainClass(
                        classData.filter(classData =>
                            res['訊息'].map(userClass => userClass['classID']).indexOf(classData['id']) < 0
                        )
                    )

                } else {
                    console.log('使用者已報名班級查詢失敗')
                    //console.log(res['狀態']);
                }
            })
        }
        //當classData下載完成 觸發此effect
        //第二個dependen是因為登入後，classData不會觸發，會導致第一次登入時首頁卡片不會減少
    }, [classData, loginReducer])
    React.useEffect(()=>{
        console.log( remainClass);
    },[remainClass])
    return (
        <>
            <Box maxWidth='1200px' p={2} p={2} margin='auto'>
                <img src={banner} style={{ width: '100%', height: 'auto' ,objectFit:'cover'}} />
            </Box>

            <Box maxWidth='1200px' p={2} margin='auto' >
           
                    <Grid container justify='center' spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant='h6'>
                                最新班級
                             </Typography>
                            <Divider />
                        </Grid>

                        {
                            loginReducer && userReducer.Authority == '學生' ?

                                remainClass.map((item) =>
                                    // console.log(item)
                                    <Grid item style={{ width: '100%', maxWidth: '380px', }}>
                                        <ClassCard classData={item} />
                                    </Grid>
                                )

                                :
                                //console.log('2')
                                classData.map((item) =>
                                    <Grid item style={{ width: '100%', maxWidth: '380px', }}>
                                        <ClassCard classData={item} />
                                    </Grid>
                                )

                        }
                    </Grid>
             
            </Box >


            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackBarReducer.open} autoHideDuration={3000} onClose={() => dispatch({ type: 'HIDEN' })}>
                <Alert onClose={() => dispatch({ type: 'HIDEN' })} severity={snackBarReducer.severity}>
                    {snackBarReducer.text}
                </Alert>
            </Snackbar>
        </>
    )
}