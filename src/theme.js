
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
            main: '#f44336',
            contrastText: '#ffffff'
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