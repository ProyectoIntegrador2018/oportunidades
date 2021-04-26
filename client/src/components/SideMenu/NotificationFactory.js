import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import {
  Typography,
  ListItem,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import { FiberManualRecord } from "@material-ui/icons";
import FiberManualRecordTwoToneIcon from "@material-ui/icons/FiberManualRecordTwoTone";
import DeleteIcon from "@material-ui/icons/Delete";
import useStyles from "../SideMenu/styles";
import clsx from "clsx";
import NOTIFICATION_TYPES from "../utils/NotificationTypes";
import axios from "axios";

// for reference
// const first = {
//   id: 123,
//   type: NOTIFICATION_TYPES.NUEVA_OPORTUNIDAD,
//   details: {
//     author: "ITESM",
//     opportunityName: "Nuevo Portal de Inscripciones",
//   },
//   isRead: true,
// };
// const second = {
//   id: 234,
//   type: NOTIFICATION_TYPES.CAMBIO_ESTATUS,
//   details: {
//     author: "Microsoft",
//     opportunityName: "Integración de Halo con OneDrive",
//     prevStatus: "Activo",
//     newStatus: "Cerrado",
//   },
//   isRead: false,
// };
// const third = {
//   id: 345,
//   type: NOTIFICATION_TYPES.NUEVO_HORARIO,
//   details: {
//     author: "Facebook",
//     opportunityName: "Nueva Aplicación para Oculus",
//     sched: "3 de Enero del 2022, 15:45",
//   },
//   isRead: false,
// };
// const fourth = {
//   id: 456,
//   type: NOTIFICATION_TYPES.CAMBIO_HORARIO,
//   details: {
//     author: "Google",
//     opportunityName: "Nuevo Servicio Regional de Noticias",
//     prevSched: "2 de Enero del 2022, 14:05",
//     newSched: "2 de Enero del 2022, 14:30",
//   },
//   isRead: true,
// };
// const fifth = {
//   id: 567,
//   type: NOTIFICATION_TYPES.RECHAZO,
//   details: {
//     author: "Amazon",
//     opportunityName: "Nuevo Servicio de Party Streaming",
//   },
//   isRead: true,
// };
// const sixth = {
//   id: 678,
//   type: NOTIFICATION_TYPES.NUEVA_PARTICIPACION,
//   details: {
//     author: "Apple",
//     opportunityName: "Nueva Aplicación de iOS",
//   },
//   isRead: false,
// };

export default function NotificationFactory(props) {
  const formatNotifications = (rawNotif) => {
    const { _id, read } = rawNotif;
    const { date, tipo, detalles } = rawNotif.notificacion;
    const { rfp } = detalles;
    const author = rfp ? rfp.nombrecliente : "";
    const opportunityName = rfp ? rfp.nombreOportunidad : "";

    const notif = {
      id: _id,
      type: tipo,
      details: {
        author: author,
        opportunityName: opportunityName,
        date: date,
      },
      isRead: read,
    };

    return notif;
  };

  const notif = formatNotifications(props.component);

  const downProps = {
    ...notif,
    styleClasses: useStyles(),
  };

  switch (notif.type) {
    case NOTIFICATION_TYPES.NUEVA_OPORTUNIDAD: {
      downProps.details.rfp_id = props.component.notificacion.detalles.rfp._id;
      return <NotificacionNuevaOportunidad {...downProps} />;
    }
    case NOTIFICATION_TYPES.OPORTUNIDAD_ELIMINADA: {
      downProps.details.opportunityName =
        props.component.notificacion.detalles.detalles;
      return <NotificacionOportunidadEliminada {...downProps} />;
    }
    case NOTIFICATION_TYPES.CAMBIO_ESTATUS:
      return <NotificacionCambioEstatus {...downProps} />;
    case NOTIFICATION_TYPES.CAMBIO_HORARIO:
      return <NotificacionCambioHorario {...downProps} />;
    case NOTIFICATION_TYPES.NUEVO_HORARIO:
      return <NotificacionNuevoHorario {...downProps} />;
    case NOTIFICATION_TYPES.RECHAZO:
      return <NotificacionRechazo {...downProps} />;
    case NOTIFICATION_TYPES.NUEVA_PARTICIPACION: {
      const detalles = props.component.notificacion.detalles;
      downProps.details.rfp_id = detalles.rfp._id;
      downProps.details.participanteName = detalles.participante.name;
      return <NotificacionSocioAplica {...downProps} />;
    }
  }
}

class PortalNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggledRead: false,
      isRead: undefined,
      hasClicked: false,
    };
  }

  getAuthor = () => {
    return this.props.details.author;
  };

  getNotifAge = () => {
    const date = Math.round(new Date(this.props.details.date).getTime() / 1000);
    // TODO: Change now to the time zone of the mongoDB
    const now = Math.round(Date.now() / 1000);
    const timeDiff = now - date;
    if (timeDiff < 60) {
      return `${Math.floor(timeDiff)} segundo(s)`;
    } else if (timeDiff < 60 * 60) {
      return `${Math.floor(timeDiff / 60)} minuto(s)`;
    } else if (timeDiff < 60 * 60 * 24) {
      return `${Math.floor(timeDiff / (60 * 60))} hora(s)`;
    } else if (timeDiff < 60 * 60 * 24 * 7) {
      return `${Math.floor(timeDiff / (60 * 60 * 24))} día(s)`;
    } else {
      return `${Math.floor(timeDiff / (60 * 60 * 24 * 7))} semana(s)`;
    }
  };

  // This method should be overriden by the concrete class
  getTitle = () => {
    return "";
  };

  // This method should be overriden by the concrete class
  getDescription = () => {
    return "";
  };

  // This method should be overriden by the concrete class
  getNavPath = () => {
    return "/inicio";
  };

  // This method should be overriden by the concrete class
  handleClick = (e) => {
    e.preventDefault();
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

  deleteNotification = (id) => {
    axios
      .delete("/notificaciones/delete-usuario-notificacion", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        params: {
          id: id,
        },
      })
      .then((res) => {
        // redireccionar
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
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
        {this.state.hasClicked && (
          <Navigate to={this.getNavPath()} replace={true} />
        )}
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
              {` — ${this.getDescription()}. Hace ${this.getNotifAge()}`}
            </React.Fragment>
          }
          onClick={this.handleClick}
        />
        <IconButton
          edge="end"
          size="small"
          color="default"
          className={this.props.styleClasses.notifDeleteIcon}
          onClick={() => this.deleteNotification(this.props.id)}
        >
          {<DeleteIcon />}
        </IconButton>
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

  handleClick = (e) => {
    e.preventDefault();
    // change state so that Navigate gets rendered
    this.setState({
      hasClicked: true,
    });
  };

  getNavPath = () => {
    return "/detalle/" + this.props.details.rfp_id;
  };
}

class NotificacionOportunidadEliminada extends PortalNotification {
  getTitle = () => {
    return "Oportunidad Comercial Eliminada";
  };

  getDescription = () => {
    const details = this.props.details;
    return `El cliente ${details.author} ha eliminado la oportunidad comercial "${details.opportunityName}"`;
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
    return `El socio ${details.participanteName} ha aplicado a su oportunidad comercial "${details.opportunityName}"`;
  };

  handleClick = (e) => {
    e.preventDefault();
    // change state so that Navigate gets rendered
    this.setState({
      hasClicked: true,
    });
  };

  getNavPath = () => {
    return "/detalle/" + this.props.details.rfp_id;
  };
}
