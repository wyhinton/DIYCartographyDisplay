import { Paragraph, Text, Pane } from "evergreen-ui";
import { useTheme } from "@material-ui/core/styles";
function Sidebar() {
  const theme = useTheme();

  const sidebarContainer = {
    height: "100%",
    width: "100%",
    paddingBottom: "1em",
    paddingRight: "2em",
    textAlign: "left" as const,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-evenly",
    color: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;

  const sidebarBold = {
    color: theme.palette.primary.main,
    fontSize: "9pt",
    lineHeight: "12pt",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 800,
  } as React.CSSProperties;

  const sidebarParagraph = {
    color: theme.palette.primary.main,
    fontSize: "9pt",
    lineHeight: "12pt",
    fontFamily: theme.typography.fontFamily,
  } as React.CSSProperties;

  return (
    <Pane style={sidebarContainer}>
      <Text style={{ lineHeight: "12pt" }}>
        <Paragraph style={sidebarBold}>
          Since 2001 Raleigh has experienced an unprecedented 43% population
          growth. As the city continues to expand physically and economically,
          the need for an inclusive dialog concerning the type of city that
          Raleigh should be increases dramatically. Many of downtown’s adjacent
          historic neighborhoods are struggling to maintain their identity as
          rising property values displace longtime community members and new
          development erases historic urban fabric. This reality makes for a
          critical moment to reflect and recognize significant urban spaces as
          we shape the future city. These series of maps created by students in
          a Graduate seminar in the College of Design at NC State use mapping as
          a way to examine the history and future of Raleigh's urban develop—not
          just from a physical and infrastructural perspective, but also the
          ways that social, economic, political and natural development have
          also shaped it. They offer alternative methods to visualize, capture
          and integrate contemporary and historic voices into a rich discourse
          on community, culture and urban redevelopment.
        </Paragraph>
      </Text>
      <Text style={sidebarParagraph}>
        <br></br>
        <Paragraph style={sidebarParagraph}>
          Building on the seminal work of theorists like James Corner, Alan
          Berger, JB Harley, Anu Mathur, Dilip da Cunha and others, these maps
          also call for a critical evaluation of the map that goes beyond the
          examination of the artifact (i.e. the map) to include the critical
          evaluation of the activity of mapping and its impact on the
          propositional nature of design. As the landscape architect and
          theorist James Corner has argued “the function of mapping is less to
          mirror reality than to engender the reshaping of the world in which
          people live” (Corner 1999, 213). These maps aim to open up
          conversations about this very reshaping.
        </Paragraph>
      </Text>
    </Pane>
  );
}

export default Sidebar;
