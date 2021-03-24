import { makeStyles } from "@material-ui/core";
import { orange } from "@material-ui/core/colors";
const drawerWidth = 240;
const notificationsTabWidth = 396;
const useStyles = makeStyles((theme) => ({
   root: {
      display: "flex",
   },
   toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
   },
   toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
   },
   appBar: {
      zIndex: theme.zIndex.drawer + 1,
      boxShadow: "none",
      transition: theme.transitions.create(["width", "margin"], {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.leavingScreen,
      }),
   },
   appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.enteringScreen,
      }),
   },
   menuButton: {
      marginRight: 36,
   },
   menuButtonHidden: {
      display: "none",
   },
   title: {
      flexGrow: 1,
   },
   subtitle: {
      fontSize: "16px",
   },
   drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.enteringScreen,
      }),
   },
   drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
         width: theme.spacing(9),
      },
   },
   appBarSpacer: theme.mixins.toolbar,
   notificationsPaper: {
      alignSelf: "flex-end",
      backgroundColor: "white",
      position: "static",
      width: notificationsTabWidth,
      boxShadow: "0px 2px 4px -1px",
   },
   notifReadIcon: {
      marginRight: 0,
   },
   unreadNotif: {
      backgroundColor: "#f0d2bd",
   },
   content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
   },
   container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
   },
   paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
   },
   fixedHeight: {
      height: 240,
   },
   fab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
   },
   success: {
      backgroundColor: orange[600],
   },
   error: {
      backgroundColor: theme.palette.error.dark,
   },
   icon: {
      fontSize: 20,
   },
   iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
   },
   message: {
      display: "flex",
      alignItems: "center",
   },
   iconColor: {
      color: "#EE5D36"
   },
}));

export default useStyles;
