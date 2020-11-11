
import { createMuiTheme } from '@material-ui/core/styles';
import { dark } from '@material-ui/core/styles/createPalette';

const theme = createMuiTheme({
    outline: 'none',
    //textDecoration: 'none',
    palette: {
        //type:'dark',
        primary: {
            main: '#009688',
            light:'#4db6ac'
        },
        secondary: {
            main: '#77a88D',
            contrastText: '#ffffff'
        },
        facebook:{
            background: '#3b5998'
        },
        error:{
            main:'#f44336'
        }

    },
    typography: {
        fontFamily: `Noto Sans TC, sans- serif !important`
    },
});
export default theme;