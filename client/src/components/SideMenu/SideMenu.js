import React, { useEffect, useState } from "react";
import clsx from "clsx";
import {
  Drawer,
  IconButton,
  Divider,
  List,
  AppBar,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ChevronLeft, Menu, Notifications } from "@material-ui/icons";
import "../../styles/globalStyles.css";
import useStyles from "../SideMenu/styles";
import ListItems from "../SideMenu/ListItems";
import ListItemsAdmin from "../SideMenu/ListItemsAdmin";
import NotificationsTab from "../SideMenu/NotificationsTab";
import axios from "axios";

const SideMenu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const userType = sessionStorage.getItem("userType");

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const [notificaciones, setNotificaciones] = useState([]);

  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    // Función que regresa la lista de eventos de la oportunidad
    const obtenerNotificaciones = () => {
      axios
        .get("/user/get-notifications/", config)
        .then((res) => {
          const rawNotifs = res.data.user.notificaciones;
          const notifications = rawNotifs.filter(
            (rawNotif) => rawNotif.notificacion
          );
          setNotificaciones(notifications);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    obtenerNotificaciones();
  }, [notificationsOpen]);

  const classes = useStyles();

  return (
    <div>
      <AppBar
        className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            className={classes.menuButton}
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
          >
            <Menu />
          </IconButton>
          <img src="/csoft.png" className={classes.logo} />
          <Typography
            component="h1"
            variant="h6"
            noWrap
            className={classes.title}
          >
            <p>Oportunidades Comerciales</p>
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="notifications"
            onClick={toggleNotifications}
          >
            <Notifications />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.notificationsDiv}>
        {notificationsOpen && (
          <NotificationsTab notificaciones={notificaciones} />
        )}
      </div>
      <Drawer anchor="left" open={drawerOpen}>
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose} color="primary">
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <List>{userType === "admin" ? <ListItemsAdmin /> : <ListItems />}</List>
      </Drawer>
    </div>
  );
};

export default SideMenu;
