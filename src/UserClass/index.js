import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Paper, Box, Grid, TextField, Typography, Button, AppBar, Toolbar, IconButton, Avatar, Popover, Divider, Switch } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import Chip from '@material-ui/core/Chip';
// import FaceIcon from '@material-ui/icons/Face';
// import DoneIcon from '@material-ui/icons/Done';

// import ClassCard from '../ClassCard'
import OpenClass from '../OpenClass'
import { host } from '../url.js'
import { set } from 'date-fns';
const useStyles = makeStyles(theme => ({
    //這邊傳入theme可以直接取到 createMuiTheme ThemeProvider 傳下來的值
    root: {
        margin: '5px !important'
    }
}))
export default React.memo(function UserClass() {
    //取值
    let snackBarReducer = useSelector(state => state.snackBarReducer)
    let userReducer = useSelector(state => state.userReducer)
    let [applyClass, setApplyClass] = React.useState([]) //班級資料（審核中 or 審核通過）
    let [open, setOpen] = React.useState(false); //班級預覽彈窗
    let [scoreOpen, setScoreOpen] = React.useState(false)//評分彈窗
    let selectClass = React.useRef({})
    let classes = useStyles();
    async function getUserClass() {
        //console.log(userReducer);
        fetch(host, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                type: '使用者已報名班級',
                userID: userReducer.id,

            }),
        }).then(res => {
            return res.json()
        }).then(res => {
            console.log(res)
            setApplyClass(res['訊息'])
        })
    }
    React.useEffect(() => {

        getUserClass()

    }, [userReducer.id])

    let classDataTmp = React.useRef(null)
    let classListOnclick = (classData) => () => {
        console.log(classData);
        classDataTmp.current = classData
        setOpen(true)
    }
    // (props)=>()=>{} 
    // = function(props){
    //     return function(){
    //     }
    // }
    return (
        <>
            <Box maxWidth='1200px' p={2} margin='auto'>
                <List>
                    {
                        applyClass.map((item) =>
                            <ListItem divider button onClick={classListOnclick(item)}>
                                <ListItemText primary={`${item['班級名稱']}`} secondary={`${item['狀態']}`} />
                                <ListItemSecondaryAction>
                                    <Button onClick={() => {
                                        setScoreOpen(true)
                                        selectClass.current = item
                                    }}>查看評分</Button>
                                </ListItemSecondaryAction>
                            </ListItem>
                        )
                    }

                </List>
            </Box>
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
                        previewClassData={classDataTmp.current}
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
            <Dialog
                open={scoreOpen}
                //onClose={() => { setOpen(false) }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth='xs'
                fullWidth
                classes={{ paper: classes.root }}
                scroll={'paper'}
            >

                <DialogContent style={{ padding: 0 }}>

                    <List>
                        {
                            selectClass.current['學科'] == 'true' ?
                                <ListItem divider>
                                    <ListItemText primary={'學科'} />
                                    {selectClass.current['學科評分']}
                                </ListItem>
                                : null
                        }
                        {
                            selectClass.current['術科'] == 'true' ?
                                <ListItem divider>
                                    <ListItemText primary={'術科'} />
                                    {selectClass.current['術科評分']}
                                </ListItem>
                                : null
                        }
                        {
                            selectClass.current['實習'] == 'true' ?
                                <ListItem divider>
                                    <ListItemText primary={'實習'} />
                                    {selectClass.current['實習評分']}
                                </ListItem>
                                : null
                        }

                    </List>

                </DialogContent>
                <DialogActions>

                    <Button onClick={() => { setScoreOpen(false) }} color="primary" autoFocus>
                        關閉
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
})