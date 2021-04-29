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

  const limit = props.notificaciones.length;
  let sortedNotifications = [...props.notificaciones];
  sortedNotifications.sort((a, b) =>
    new Date(a.notificacion.date) < new Date(b.notificacion.date) ? 1 : -1
  );

  if (sortedNotifications.length === 0) {
    return (
      <Grid container className={classes.notificationsPaper}>
        <List anchor="right" className={classes.noNotifications}>
          <NightsStayIcon />
          <text>Usted no tiene notificaciones</text>
        </List>
      </Grid>
    );
  } else if (sortedNotifications.length <= 5) {
    return (
      <Grid container className={classes.notificationsPaper}>
        <List anchor="right">
          {sortedNotifications.map((notif) => (
            <NotificationFactory component={notif} key={notif._id} />
          ))}
        </List>
      </Grid>
    );
  } else {
    let shownNotifications = [];
    if (!isExtended) {
      for (let i = 0; i < 5; i++) {
        shownNotifications.push(sortedNotifications[i]);
      }
    } else {
      for (let i = 0; i < limit; i++) {
        shownNotifications.push(sortedNotifications[i]);
      }
    }

    return (
      <Grid container className={classes.notificationsPaper}>
        <List anchor="right">
          {shownNotifications.map((notif) => (
            <NotificationFactory component={notif} key={notif._id} />
          ))}
        </List>
        <Button
          onClick={toggleExpansion}
          color="primary"
          className={classes.viewMoreOrLessNotifsButton}
        >
          {isExtended ? "Ver menos" : `Ver más (${limit - 5})`}
        </Button>
      </Grid>
    );
  }
}
