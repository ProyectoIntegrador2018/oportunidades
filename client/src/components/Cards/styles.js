import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  // basically, full-width containers
  root: {
    width: "100%",
  },
  containerEventoControles: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginYop: "0.5em",
  },
  containerEventoDetalles: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  containerEventos: {
    display: "flex",
    flexDirection: "column",
    justifyContent: " flex-star",
    alignItems: "flex-start",
    marginLeft: "1em",
  },
  containerRadios: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  // special floating and cummulative cards have specific measures and may have extra specifications
  cardRfp: {
    width: "400px",
    height: "300px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    boxShadow:
      "0px 8px 4px -4px rgba(0,0,0,0.2),0px 4px 4px 0px rgba(0,0,0,0.14),0px 2px 6px 0px rgba(0,0,0,0.12)",
  },
  cardRfpDetalle: {
    display: "flex",
    justifyContent: "center",
    minWidth: "60%",
    boxShadow:
      "0px 8px 4px -4px rgba(0,0,0,0.2),0px 4px 4px 0px rgba(0,0,0,0.14),0px 2px 6px 0px rgba(0,0,0,0.12)",
  },
  socioCard: {
    width: "400px",
    height: "200px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    boxShadow:
      "0px 8px 4px -4px rgba(0,0,0,0.2),0px 4px 4px 0px rgba(0,0,0,0.14),0px 2px 6px 0px rgba(0,0,0,0.12)",
  },
  socioInvolucradoCard: {
    width: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    boxShadow:
      "0px 8px 4px -4px rgba(0,0,0,0.2),0px 4px 4px 0px rgba(0,0,0,0.14),0px 2px 6px 0px rgba(0,0,0,0.12)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.palette.secondary.dark,
    marginTop: "1em",
  },
  largeTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: theme.palette.primary.dark,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.palette.secondary.dark,
    marginLeft: "1.5em",
    marginRight: "1em",
  },
  sectionSubtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.palette.primary.dark,
    textAlign: "left",
    margin: "15px 0px 0px 1.5em",
  },
  description: {
    fontSize: 14,
    color: theme.palette.secondary.light,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    marginRight: "1em",
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
  containerColumnText: {
    display: "flex",
    flexDirection: "column",
    margin: "0.5em 0em 0em 2em",
  },
  contenedorBotones: {
    display: "flex",
    flexDirection: "row",
    alignContent: "flex-end",
    justifyContent: "flex-end",
    marginLeft: "1.5em",
  },
  backIcon: {
    fontSize: 45,
    fontWeight: "bold",
    color: theme.palette.primary.main,
    marginTop: 10,
    marginLeft: 10,
  },
  containerHeader: {
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
  divider: {
    width: "90%",
    marginTop: "10px",
  },
  editIcon: {
    color: theme.palette.primary.main,
  },
  textField: {
    width: "100%",
    marginBottom: "10px",
  },
  binaryRadioGroup: {
    display: "flex",
    flexDirection: "row",
  },
}));

export default useStyles;
