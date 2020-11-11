
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Paper, Box, Grid, TextField, Typography, Button, AppBar, Toolbar, IconButton, Avatar, Popover, Divider } from '@material-ui/core'
// import Snackbar from '@material-ui/core/Snackbar';
// import Alert from '@material-ui/lab/Alert';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import Collapse from '@material-ui/core/Collapse';
// import Pagination from '@material-ui/lab/Pagination';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

// import Chip from '@material-ui/core/Chip';
// import DoneIcon from '@material-ui/icons/Done';
import { host } from '../url.js'
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

export default function CourseDetail() {
    return (
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
                                <Typography>標題</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            
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
    )
}
