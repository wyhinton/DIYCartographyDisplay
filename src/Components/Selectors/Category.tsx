import Grid from './Grid/Grid';
import {Link} from 'evergreen-ui';


export const Category = () => {
    const linkStyle = {
        fontSize: "8pt",
        textDecoration: "none",
    }


return (
    <div style = {{width: '100%', height: '100%', paddingTop: '0px'}} className = "test">
     {/* <div style = {{width: '100%', height: '100%', paddingTop: '14px'}} className = "test">  */}

        <Grid rows = {10} cols = {20} />
    </div>
)
}
export default Category