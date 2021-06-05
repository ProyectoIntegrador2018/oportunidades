import { makeStyles } from "@material-ui/core";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  largeTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: theme.palette.primary.dark,
    marginTop: "1em",
  },
  sectionSubtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.palette.primary.dark,
    textAlign: "center",
    marginTop: "10px",
  },
  steppedForm: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    marginRight: "1em",
    color: theme.palette.secondary.dark,
  },
  containerText: {
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-start",
    margin: "0.5em 0em 0em 2em",
  },
  containerRadios: {
    display: "flex",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    justifyContent: "flex-start",
  },
  binaryRadioGroup: {
    display: "flex",
    flexDirection: "row",
  },
  formContainer: {
    margin: "1em 2em 2em 2em",
    width: "80%",
  },
  formFieldsContainer: {
    alignItems: "left",
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  textField: {
    width: "100%",
    marginBottom: "10px",
  },
  logo: {
    height: "36px",
  },
  warning:{
    color:'#FF0000',
    fontSize: 20,
  }
}));

export default useStyles;
