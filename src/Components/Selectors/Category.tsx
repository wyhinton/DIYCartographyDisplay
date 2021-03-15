import React from 'react'; // we need this to make JSX compile
import Grid from './Grid/Grid';


export const Category = () => {


return (
    <div style = {{width: '100%', height: '100%'}} className = "test">
        <Grid rows = {10} cols = {20} />
    </div>
)
}
export default Category