import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
   CssBaseline,
   Drawer,
   AppBar,
   Toolbar,
   List,
   TextField,
   Button,
   Grid,
   CircularProgress,
   Card,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from "@material-ui/icons/Person";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import SideMenu from "../SideMenu/SideMenu";
import axios from "axios";
import EditarPerfil from "../Dialogs/EditarPerfil";
import EditarPassword from "../Dialogs/EditarPassword";
//import '../Login.css'
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
   root: {
      display: "flex",
      backgroundColor: "#EE5D36",
   },
   toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
   },
   card: {
      minWidth: 275,
      width: "80%",
      margin: "auto",
      marginTop: "40px",
   },
   titlePer: {
      flexGrow: 1,
      fontSize: "28px",
   },
   textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 500,
   },
   appBarSpacer: theme.mixins.toolbar,
   content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
   },
   container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
   },
   button: {
      margin: theme.spacing(1),
      marginLeft: "auto",
      textAlign: "right",
   },
}));

export default function MiPerfil() {
   const classes = useStyles();
   const [open, setOpen] = React.useState(true);
   const [userEmail, setUserEmail] = React.useState("");
   const [userName, setUserName] = React.useState("");
   const [userOrg, setUserOrg] = React.useState("");
   const [userPhone, setUserPhone] = React.useState("");
   const [modalIsOpen, setModalIsOpen] = React.useState(false);
   const [loading, setLoading] = React.useState(true);
   const [editPwOpen, setEditPwOpen] = React.useState(false);

   const config = {
      headers: {
         Authorization: "Bearer " + sessionStorage.getItem("token"),
         "Content-Type": "application/json",
      },
   };

   useEffect(() => {
      setLoading(true);
      getUserInfo();
   }, []);

   const getUserInfo = () => {
      axios
         .get("/user/", config)
         .then((res) => {
            setUserEmail(res.data.user.email);
            setUserName(res.data.user.name);
            setUserPhone(res.data.user.telefono);
            setUserOrg(res.data.user.empresa);
            setLoading(false);
         })
         .catch((err) => {
            console.log(err);
         });
   };

   const handleEditClick = () => {
      setModalIsOpen(true);
   };

   const handlePasswordClick = () => {
      setEditPwOpen(true);
   }

   return (
      <div className={classes.root}>
         <SideMenu />
         <CssBaseline />
         {loading ? (
            <CircularProgress />
         ) : (
            <main className={classes.content}>
               <Card className={classes.card}>
                  <EditarPerfil
                     userEmail={userEmail}
                     userName={userName}
                     isOpen={modalIsOpen}
                     userEmpresa={userOrg}
                     userTelefono={userPhone}
                     setModalIsOpen={setModalIsOpen}
                  />
                  <EditarPassword
                     isOpen={editPwOpen}
                     setModalIsOpen={setEditPwOpen}
                   />
                  <div className={classes.appBarSpacer} />
                  <Container maxWidth="lg" className={classes.container}>
                     <Grid container spacing={3}>
                        <Grid item xs={12}>
                           <PersonIcon />
                           <Grid item xs={12}>
                              <Typography
                                 component="h1"
                                 variant="h6"
                                 color="inherit"
                                 noWrap
                                 className={classes.titlePer}
                              >
                                 Mi Perfil
                              </Typography>
                           </Grid>
                        </Grid>
                        <Divider />
                        <Grid item xs={12} md={12} lg={12}>
                           <TextField
                              id="standard-read-only-input"
                              label="Nombre"
                              defaultValue={userName}
                              className={classes.textField}
                              fullWidth
                              margin="normal"
                              onChange={(e) => setUserEmail(e.target.value)}
                              InputProps={{
                                 readOnly: true,
                              }}
                           />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                           <TextField
                              id="standard-read-only-input"
                              label="Correo"
                              defaultValue={userEmail}
                              className={classes.textField}
                              fullWidth
                              margin="normal"
                              onChange={(e) => setUserEmail(e.target.value)}
                              InputProps={{
                                 readOnly: true,
                              }}
                           />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                           <TextField
                              id="standard-read-only-input"
                              label="Empresa"
                              defaultValue={userOrg}
                              className={classes.textField}
                              fullWidth
                              margin="normal"
                              onChange={(e) => setUserOrg(e.target.value)}
                              InputProps={{
                                 readOnly: true,
                              }}
                           />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                           <TextField
                              id="standard-read-only-input"
                              label="Telefono"
                              defaultValue={userPhone}
                              className={classes.textField}
                              fullWidth
                              margin="normal"
                              onChange={(e) => setUserPhone(e.target.value)}
                              InputProps={{
                                 readOnly: true,
                              }}
                           />
                        </Grid>
                        <Grid
                           item
                           xs={12}
                           md={12}
                           lg={12}
                           className={classes.button}
                        >
                           {/* <Button
                              variant="contained"
                              color="secondary"
                              style={{ marginRight: "20px" }}
                           >
                              Eliminar Cuenta
                           </Button> */}

                           <Button
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              onClick={handlePasswordClick}
                           >
                              Cambiar contraseña
                           </Button>

                           <Button
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              onClick={handleEditClick}
                           >
                              Editar
                           </Button>
                        </Grid>
                     </Grid>
                  </Container>
               </Card>
            </main>
         )}
      </div>
   );
}
