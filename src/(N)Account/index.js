import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Paper, Box, Grid, TextField, Typography, Button, AppBar, Toolbar, IconButton, Avatar, Popover, Divider } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import {host} from '../url.js'
let useStyles = makeStyles({
    root: {
    },
    input:{
        textAlign:'center',
    }

})

export default function Account() {
    let classes = useStyles()
    let userReducer = useSelector(state => state.userReducer)
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let dispatch = useDispatch()
    function upload(e) {
        //e.preventDefault();
        let image = e.target.files[0]
        if (image) {
            if ((image.type == "image/jpg" || image.type == 'image/jpeg' || image.type == 'image/png') && image.size <= 1000000) {
                let formData = new FormData()
                formData.append('test', e.target.files[0], `${userReducer.email}`);
                formData.append('type','個人照片上傳');
                //console.log(formData.get('type'))
                fetch('https://tms.fois.online/imgUpload', {
                    method: 'POST',
                    body: formData,

                }).then(res => {
                    return res.json()
                }).then(res => {
                    console.log(res);
                    if (res.狀態 == '上傳成功') {
                        dispatch({ type: 'SHOW', text: res.訊息, severity: 'success' })
                        window.location.reload();
                    } else {
                        dispatch({ type: 'SHOW', text: res.訊息, severity: 'error' })
                    }
                })
            } else {
                dispatch({ type: 'SHOW', text: '照片格式不符', severity: 'error' })
            }
        } else {
            console.log('沒有照片');
        }
    }
    // React.useEffect(() => {
    //     console.log('123');
    // })
    return (
        <Box p={1} maxWidth={1200} margin='auto'>
            <Paper>
                <Box p={2}>
                    <Grid container spacing={4}>
                        <Grid container item justify='space-between' alignItems='center'>
                            <Grid item>
                                姓名:
                             </Grid>
                            <Grid item>
                                <TextField size='small' id="standard-basic" className={classes.input} />
                            </Grid>
                        </Grid>
                        <Grid container item justify='space-between' alignItems='center'>
                            <Grid item>
                                Email:
                            </Grid>
                            <Grid item>
                                <TextField size='small' id="standard-basic" />
                            </Grid>
                        </Grid>
                        <Grid container item justify='space-between' alignItems='center'>
                            <Grid item>
                                聯絡電話:
                            </Grid>
                            <Grid item>
                                <TextField ali size='small' id="standard-basic" />
                            </Grid>
                        </Grid>
                        <Grid container item justify='space-between' alignItems='center'>
                            <Grid item>
                                修改密碼:
                            </Grid>
                            <Grid item>
                                <TextField ali size='small' id="standard-basic" />
                            </Grid>
                        </Grid>
                        <Grid container item justify='space-between' alignItems='baseline'>
                            <Grid item>
                                上傳照片:
                             </Grid>
                            <Grid item xs={6}>
                                <input id='imageUpload' type="file" accept=".jpg,.jpeg,.png" onChange={upload} hidden />
                                <label htmlFor="imageUpload">
                                    <Button fullWidth size='small' variant="contained" color="primary" component="span">
                                        Upload
                                    </Button>
                                </label>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>


            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackBarReducer.open} autoHideDuration={3000} onClose={() => dispatch({ type: 'HIDEN' })}>
                <Alert onClose={() => dispatch({ type: 'HIDEN' })} severity={snackBarReducer.severity}>
                    {snackBarReducer.text}
                </Alert>
            </Snackbar>
        </Box>
    )
}