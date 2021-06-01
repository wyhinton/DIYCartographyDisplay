import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";

const Header = ({
  title,
  author,
  year,
  discipline,
}: {
  title: string;
  author: string;
  year: string;
  discipline: string;
}) => {
  const theme = useTheme();
  const titleHeader = {
    fontSize: "xxx-large",
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;
  const authorInfo = {
    fontSize: "xx-large",
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;

  return (
    <span>
      <Grid container spacing={0}>
        <Grid item xs={9} style={titleHeader}>
          {title}
        </Grid>
        <Grid item xs={3} style={authorInfo}>
          {author}
          <br></br>
          {discipline}, {year}
        </Grid>
      </Grid>
    </span>
  );
};
export default Header;
