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
import { ChevronLeft, Menu } from "@material-ui/icons";
import "../../styles/globalStyles.css";
import useStyles from "../SideMenu/styles";
import ListItems from "../SideMenu/ListItems";
import ListItemsAdmin from "../SideMenu/ListItemsAdmin";
import NotificationFactory from "../SideMenu/NotificationFactory";
import NOTIFICATION_TYPES from "../utils/NotificationTypes";
import NotificationsTab from "../SideMenu/NotificationsTab";
import axios from "axios";

const SideMenu = () => {
   const [drawerOpen, setDrawerOpen] = useState(false);
   const userType = sessionStorage.getItem("userType");

   const handleDrawerOpen = () => {
      setDrawerOpen(true);
   };
   const handleDrawerClose = () => {
      setDrawerOpen(false);
   };
   const classes = useStyles();

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
          const notifications = formatNotifications(rawNotifs);
          setNotificaciones(notifications);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    obtenerNotificaciones();
  }, [notificationsOpen]);

  const formatNotifications = (rawNotifications) => {
    const notifications = rawNotifications
      .filter((rawNotif) => rawNotif.notificacion)
      .map((rawNotif) => {
        const { _id, read } = rawNotif;
        const { tipo, detalles } = rawNotif.notificacion;
        const { rfp } = detalles;
        const author = rfp ? rfp.nombrecliente : "";
        const opportunityName = rfp ? rfp.nombreOportunidad : detalles.detalles;
        const { participante } = detalles;
        const participanteName = participante ? participante.name : "";
        const notif = {
          id: _id,
          type: tipo,
          details: {
            author: author,
            opportunityName: opportunityName,
            participanteName: participanteName
          },
          isRead: read,
        };
        return notif;
      });
    return notifications;
  };

  const classes = useStyles();

  const first = {
    id: 123,
    type: NOTIFICATION_TYPES.NUEVA_OPORTUNIDAD,
    details: {
      author: "ITESM",
      opportunityName: "Nuevo Portal de Inscripciones",
    },
    isRead: true,
  };
  const second = {
    id: 234,
    type: NOTIFICATION_TYPES.CAMBIO_ESTATUS,
    details: {
      author: "Microsoft",
      opportunityName: "Integración de Halo con OneDrive",
      prevStatus: "Activo",
      newStatus: "Cerrado",
    },
    isRead: false,
  };
  const third = {
    id: 345,
    type: NOTIFICATION_TYPES.NUEVO_HORARIO,
    details: {
      author: "Facebook",
      opportunityName: "Nueva Aplicación para Oculus",
      sched: "3 de Enero del 2022, 15:45",
    },
    isRead: false,
  };
  const fourth = {
    id: 456,
    type: NOTIFICATION_TYPES.CAMBIO_HORARIO,
    details: {
      author: "Google",
      opportunityName: "Nuevo Servicio Regional de Noticias",
      prevSched: "2 de Enero del 2022, 14:05",
      newSched: "2 de Enero del 2022, 14:30",
    },
    isRead: true,
  };
  const fifth = {
    id: 567,
    type: NOTIFICATION_TYPES.RECHAZO,
    details: {
      author: "Amazon",
      opportunityName: "Nuevo Servicio de Party Streaming",
    },
    isRead: true,
  };
  const sixth = {
    id: 678,
    type: NOTIFICATION_TYPES.NUEVA_PARTICIPACION,
    details: {
      author: "Apple",
      opportunityName: "Nueva Aplicación de iOS",
    },
    isRead: false,
  };

  // useEffect(() => {
  //   const obtenerNotificaciones = () => {
  //     setNotificaciones([first, second, third, fourth, fifth, sixth]);
  //   };
  //   obtenerNotificaciones();
  // }, [notificationsOpen]);

  const sampleNotif1 = <NotificationFactory component={first} />;
  const sampleNotif2 = <NotificationFactory component={second} />;
  const sampleNotif3 = <NotificationFactory component={third} />;
  const sampleNotif4 = <NotificationFactory component={fourth} />;
  const sampleNotif5 = <NotificationFactory component={fifth} />;
  const sampleNotif6 = <NotificationFactory component={sixth} />;

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
