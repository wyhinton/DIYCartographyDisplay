import React from 'react'; // we need this to make JSX compile
import Grid from './Grid/Grid';
import {Link} from 'evergreen-ui';
import { useStoreActions } from "../../hooks";


export const Category = () => {
    const linkStyle = {
        fontSize: "8pt",
        textDecoration: "none",
    }
    const set_store_data = useStoreActions(actions => actions.map_data.add);

return (
    <div style = {{width: '100%', height: '100%', paddingTop: '0px'}} className = "test">
    {/* <div style = {{width: '100%', height: '100%', paddingTop: '14px'}} className = "test"> */}
        <Link style = {linkStyle} onClick = {()=>{console.log("GOT SELECTOR CLICK")}}>BUILT ENVIRONMENT</Link>
        <Grid rows = {10} cols = {20} />
    </div>
)
}
export default Category