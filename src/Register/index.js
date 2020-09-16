import React from 'react';
import {useHistory}from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Box, Grid, TextField, Typography, Button, } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from 'react-redux'
import { red } from '@material-ui/core/colors';

let useStyles = makeStyles({
    root: {
        maxWidth: 1920,
        height: '100vh',
        margin: 'auto',
        padding: 10
    },
    parper: {
        margin: 'auto',
        maxWidth: 350,

    }
})

export default function RegisterPage() {
    let classes = useStyles()
    let name = React.useRef(null)
    let email = React.useRef(null)
    let pass = React.useRef(null)
    let phone = React.useRef(null)

    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    //寫值
    let dispatch = useDispatch()

    function handleSubmit(e) {
        e.preventDefault();
        fetch('http://localhost:8888/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                name: name.current,
                password: pass.current,
                email: email.current,
                phone: phone.current
            }),
        }).then(res => {
            return res.json()
        }).then(res => {
            console.log(res['狀態'])
            if (res['狀態'] == '註冊異常') {
                dispatch({ type: 'SHOW', text: res['訊息'], severity: 'error' })
            } else {
                dispatch({ type: 'SHOW', text: res['訊息'], severity: 'success' })
            }
        })
    }
    function handleNameInput(e) {
        name.current = e.target.value
        // console.log(e.target.value);
    }
    function handleEmailInput(e) {
        email.current = e.target.value
        // console.log(e.target.value);
    }
    function handlePhoneInput(e) {
        phone.current = e.target.value
        // console.log(e.target.value);
    }
    function handlePassInput(e) {
        pass.current = e.target.value
        // console.log(e.target.value);
    }
    function test() {

    }

    return (
        <>
            <Grid container className={classes.root} justify='center' alignContent='center' >
                <Grid item xs={12} style={{ marginBottom: 8 }}>
                    <Typography color='primary' variant='h5' align='center' >TMS 人才管理系統註冊</Typography>
                </Grid>

                <Grid item xs={12} >
                    <Paper className={classes.parper}>
                        <Box p={2}>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField id="outlined-basic" label="姓名" variant="outlined" size='small' onChange={handleNameInput} fullWidth required />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField id="outlined-basic" label="密碼" variant="outlined" size='small' onChange={handlePassInput} fullWidth required />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField id="outlined-basic" label="手機" variant="outlined" size='small' onChange={handlePhoneInput} fullWidth required />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField id="outlined-basic" label="電子信箱" variant="outlined" size='small' onChange={handleEmailInput} fullWidth required />
                                    </Grid>


                                </Grid>

                                <Grid container spacing={1} style={{ marginTop: 10 }}>
                                    <Grid item xs={12}>
                                        <Button type='submit' color='primary' variant="contained" fullWidth>註冊</Button>
                                    </Grid>
                             
                                </Grid>
                            </form>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar anchorOrigin={{ vertical:'top', horizontal:'right' }}open={snackBarReducer.open} autoHideDuration={3000} onClose={() => dispatch({ type: 'HIDEN' })}>
                <Alert onClose={() => dispatch({ type: 'HIDEN' })} severity={snackBarReducer.severity}>
                    {snackBarReducer.text}
                </Alert>
            </Snackbar>
        </>

    )
}