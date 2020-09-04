import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Box, Grid, TextField, Typography, Button } from '@material-ui/core'
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

export default function LoginPage() {
    let classes = useStyles()
    let name = React.useRef(null)
    let email = React.useRef(null)
    let pass = React.useRef(null)
    let phone = React.useRef(null)
    function handleSubmit(e) {
        e.preventDefault();

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
        fetch('http://localhost:8888', {
            method: 'POST',
            body: JSON.stringify({
                name: '123',
                password: '456',
                email:'789'
            }),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
    }
    return (

        <Grid container className={classes.root} justify='center' alignContent='center' >
            <Grid item xs={12} style={{ marginBottom: 8 }}>
                <Typography color='primary' variant='h5' align='center'>TMS 人才管理系統註冊</Typography>
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
                                <Grid item xs={12}>
                                    <Button variant="contained" fullWidth size='small' onClick={test}>返回</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Paper>
            </Grid>

        </Grid>


    )
}