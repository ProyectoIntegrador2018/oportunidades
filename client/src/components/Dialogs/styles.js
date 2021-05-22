import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  contenedorBotones: {
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-end",
    justifyContent: "flex-end",
    marginLeft: "1.5em",
    marginRight: "1.5em",
  },
  header: {
    backgroundColor: theme.palette.primary.dark,
    color: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    alignSelf: "center",
  },
  closeIcon: {
    color: "white",
  },
  textField: {
    width: "100%",
    marginBottom: "10px",
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    marginRight: "0.5em",
    color: theme.palette.secondary.dark,
  },
  valueText: {
    fontSize: 16,
    textAlign: "left",
    color: theme.palette.secondary,
  },
  containerText: {
    display: "flex",
    flexDirection: "row",
    margin: "0.5em 0em 0em 2em",
  },
}));

export default useStyles;
