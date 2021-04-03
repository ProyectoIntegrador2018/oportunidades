import React, { Component } from "react";
import {
  Typography,
  ListItem,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import { FiberManualRecord } from "@material-ui/icons";
import FiberManualRecordTwoToneIcon from "@material-ui/icons/FiberManualRecordTwoTone";
import useStyles from "../SideMenu/styles";
import clsx from "clsx";
import NOTIFICATION_TYPES from "../utils/NotificationTypes";

export default function NotificationFactory(props) {
  const downProps = {
    ...props.component,
    styleClasses: useStyles(),
  };
  switch (props.component.type) {
    case NOTIFICATION_TYPES.NUEVA_OPORTUNIDAD:
      return <NotificacionNuevaOportunidad {...downProps} />;
    case NOTIFICATION_TYPES.CAMBIO_ESTATUS:
      return <NotificacionCambioEstatus {...downProps} />;
    case NOTIFICATION_TYPES.CAMBIO_HORARIO:
      return <NotificacionCambioHorario {...downProps} />;
    case NOTIFICATION_TYPES.NUEVO_HORARIO:
      return <NotificacionNuevoHorario {...downProps} />;
    case NOTIFICATION_TYPES.RECHAZO:
      return <NotificacionRechazo {...downProps} />;
    case NOTIFICATION_TYPES.SOCIO_APLICA:
      return <NotificacionSocioAplica {...downProps} />;
  }
}

class PortalNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggledRead: false,
      isRead: undefined,
    };
  }

  getAuthor = () => {
    return this.props.details.author;
  };

  // This method should be overriden by the concrete class
  getTitle = () => {
    return "";
  };

  // This method should be overriden by the concrete class
  getDescription = () => {
    return "";
  };

  toggleRead = () => {
    // TODO: One-way call to the backend to update the bd
    if (!this.state.toggledRead) {
      this.setState({
        toggledRead: true,
        isRead: !this.props.isRead,
      });
    } else {
      this.setState({
        isRead: !this.state.isRead,
      });
    }
  };

  render() {
    // TODO: Lift the state up if we want to avoid making a request every time we re-open the
    // notification tab
    const hasBeenRead = this.state.toggledRead
      ? this.state.isRead
      : this.props.isRead;
    const currentReadIcon = () => {
      if (hasBeenRead) return <FiberManualRecordTwoToneIcon />;
      else return <FiberManualRecord />;
    };

    return (
      <ListItem
        alignItems="flex-start"
        className={clsx(!hasBeenRead && this.props.styleClasses.unreadNotif)}
      >
        <IconButton
          edge="end"
          color="primary"
          aria-label="read"
          className={this.props.styleClasses.notifReadIcon}
          onClick={this.toggleRead}
        >
          {currentReadIcon()}
        </IconButton>
        <ListItemText
          primary={this.getAuthor()}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={this.props.styleClasses.inline}
                color="textPrimary"
              >
                {this.getTitle()}
              </Typography>
              {` — ${this.getDescription()}`}
            </React.Fragment>
          }
        />
      </ListItem>
    );
  }
}

class NotificacionNuevaOportunidad extends PortalNotification {
  getTitle = () => {
    return "Nueva Oportunidad Comercial";
  };

  getDescription = () => {
    const details = this.props.details;
    return `El cliente ${details.author} ha creado la oportunidad comercial "${details.opportunityName}"`;
  };
}

class NotificacionCambioEstatus extends PortalNotification {
  getTitle = () => {
    return "Cambio de Estatus";
  };

  getDescription = () => {
    const details = this.props.details;
    return `El cliente ${details.author} ha cambiado el estatus de la oportunidad "${details.opportunityName}" de "${details.prevStatus}" a "${details.newStatus}"`;
  };
}

class NotificacionCambioHorario extends PortalNotification {
  getTitle = () => {
    return "Cambio de Horario de Junta";
  };

  getDescription = () => {
    const details = this.props.details;
    return `El cliente ${details.author} ha cambiado el horario de junta para la oportunidad "${details.opportunityName}" de ${details.prevSched} a ${details.newSched}`;
  };
}

class NotificacionNuevoHorario extends PortalNotification {
  getTitle = () => {
    return "Horario de Junta Establecido";
  };

  getDescription = () => {
    const details = this.props.details;
    return `El cliente ${details.author} ha establecido el siguiente horario de junta para la oportunidad "${details.opportunityName}": ${details.sched}`;
  };
}

class NotificacionRechazo extends PortalNotification {
  getTitle = () => {
    return "Rechazo de Propuesta";
  };

  getDescription = () => {
    const details = this.props.details;
    return `Lamentamos informarle que el cliente ${details.author} ha rechazado su propuesta para la oportunidad ${details.opportunityName}`;
  };
}

class NotificacionSocioAplica extends PortalNotification {
  getTitle = () => {
    return "Nueva Aplicación de Socio";
  };

  getDescription = () => {
    const details = this.props.details;
    return `El socio ${details.author} ha aplicado a su oportunidad comercial "${details.opportunityName}"`;
  };
}
