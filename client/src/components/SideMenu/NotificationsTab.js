import React, { useState } from "react";
import { Grid, List, Button } from "@material-ui/core";
import useStyles from "../SideMenu/styles";
import NotificationFactory from "../SideMenu/NotificationFactory";
import NightsStayIcon from "@material-ui/icons/NightsStay";

export default function NotificationsTab(props) {
  const classes = useStyles();

  // siempre muestra 5 notificaciones al abrir la barra de notificaciones
  const [isExtended, setIsExtended] = useState(false);

  const toggleExpansion = (e) => {
    e.preventDefault();
    setIsExtended(!isExtended);
  };

  if (props.notificaciones.length === 0) {
    return (
      <Grid container className={classes.notificationsPaper}>
        <List anchor="right" className={classes.noNotifications}>
          <NightsStayIcon />
          <text>Usted no tiene notificaciones</text>
        </List>
      </Grid>
    );
  } else if (props.notificaciones.length <= 5) {
    return (
      <Grid container className={classes.notificationsPaper}>
        <List anchor="right">
          {props.notificaciones.map((notif) => (
            <NotificationFactory component={notif} />
          ))}
        </List>
      </Grid>
    );
  } else {
    let shownNotifications = [];
    if (!isExtended) {
      for (let i = 0; i < 5; i++) {
        shownNotifications.push(props.notificaciones[i]);
      }
    } else {
      shownNotifications = props.notificaciones;
    }

    return (
      <Grid container className={classes.notificationsPaper}>
        <List anchor="right">
          {shownNotifications.map((notif) => (
            <NotificationFactory component={notif} />
          ))}
        </List>
        <Button
          onClick={toggleExpansion}
          color="primary"
          className={classes.viewMoreOrLessNotifsButton}
        >
          {isExtended
            ? "Ver menos"
            : `Ver más (${props.notificaciones.length - 5})`}
        </Button>
      </Grid>
    );
  }
}
