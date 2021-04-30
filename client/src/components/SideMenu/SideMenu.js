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
import NotificationFactory from "../SideMenu/NotificationFactory";
import NOTIFICATION_TYPES from "../utils/NotificationTypes";
import NotificationsTab from "../SideMenu/NotificationsTab";
import axios from "axios";

const PAGE_SIZE = 5;

const SideMenu = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifsPage, setNotifsPage] = useState(0);
  const userType = sessionStorage.getItem("userType");

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const toggleNotifications = () => {
    const curPage = notificationsOpen ? 0 : 1;
    if (notificationsOpen) setNotificaciones([]);
    setNotifsPage(curPage);
    setNotificationsOpen(!notificationsOpen);
  };

  const loadMoreNotifiactions = () => {
    setNotifsPage(prevPage => (prevPage + 1));
  }

  const loadLessNotifications = () => {
    setNotificaciones(prevNotifications => {
      let newNotifications = [];
      for (let idx = 0; idx < Math.min(prevNotifications.length, 5); idx++) {
        newNotifications.push(prevNotifications[0]);
      }
      return newNotifications;
    })
    setNotifsPage(1);
  }

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
        .get("/user/get-notifications", {
          ...config,
          params: {
            page: notifsPage,
            pageSize: PAGE_SIZE,
          },
        })
        .then((res) => {
          const rawNotifs = res.data.user.notificaciones;
          const notifications = rawNotifs.filter(
            (rawNotif) => rawNotif.notificacion
          );
          setNotificaciones(prevNotifications => {
            return [...prevNotifications, ...notifications];
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };
    obtenerNotificaciones();
  }, [notificationsOpen, notifsPage]);

  const classes = useStyles();

  return (
    <div>
      <AppBar
        position="absolute"
        color="transparent"
        className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
      >
        <Toolbar className="toolbar">
          <IconButton
            edge="start"
            color="primary"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
          >
            <Menu />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            <p className="texto-primary">Oportunidades Comerciales</p>
          </Typography>
          <IconButton
            edge="end"
            color="primary"
            aria-label="notifications"
            onClick={toggleNotifications}
          >
            <Notifications />
          </IconButton>
        </Toolbar>
        {notificationsOpen && (
          <NotificationsTab notificaciones={notificaciones} />
        )}
      </AppBar>
      <Drawer anchor="left" open={drawerOpen}>
        <div className="toolbarIcon">
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
