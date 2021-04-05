import Grid from '@material-ui/core/Grid';
import {Link, Heading, Paragraph, Text, Icon, ArrowRightIcon} from 'evergreen-ui';
import { useTheme, withStyles } from "@material-ui/core/styles";

export type SelectorGroupProps = { 
    title: string, 
    size: number, 
    // cols: number,
    children?: JSX.Element|JSX.Element[],
}



const SelectorGroup = ({title, children}: SelectorGroupProps) => {
    const theme = useTheme();
    const groupStyle = {
        textDecoration: 'underline',
        color: theme.palette.primary.main,
    } as React.CSSProperties;

    return (
        <div>
            <div>
            <Text >
                <Heading size = {100} style = {groupStyle}>
                    {title}
                </Heading>
            </Text>
            </div>
            <div>
                {children}
            </div>
        </div>
    )

}

export default SelectorGroup;