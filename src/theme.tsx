import { createMuiTheme } from "@material-ui/core";
import blue from '@material-ui/core/colors/blue';
export const theme = createMuiTheme({
    palette:{
        primary: {
            light: blue[100],
            // light: blue[100],
            main: "#739eae",
            dark: blue[700],
        }
    },
    spacing: factor => `${0.25 * factor}rem`,
    overrides:{
        MuiGrid:{
            root:{
                margin: '0px'
            }
        }
    }
})