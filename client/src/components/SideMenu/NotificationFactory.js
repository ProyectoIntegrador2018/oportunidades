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
  const downProps = {
    rawNotif: { ...props.component },
    styleClasses: useStyles(),
    navigate: props.navigate,
  };

  switch (props.component.notificacion.tipo) {
    case NOTIFICATION_TYPES.NUEVA_OPORTUNIDAD:
      return <NotificacionNuevaOportunidad {...downProps} />;
    case NOTIFICATION_TYPES.OPORTUNIDAD_ELIMINADA:
      return <NotificacionOportunidadEliminada {...downProps} />;
    case NOTIFICATION_TYPES.CAMBIO_ESTATUS:
      return <NotificacionCambioEstatus {...downProps} />;
    case NOTIFICATION_TYPES.CAMBIO_HORARIO:
      return <NotificacionCambioHorario {...downProps} />;
    case NOTIFICATION_TYPES.NUEVO_HORARIO:
      return <NotificacionNuevoHorario {...downProps} />;
    case NOTIFICATION_TYPES.PARTICIPACION_RECHAZADA:
      return <NotificacionRechazo {...downProps} />;
    case NOTIFICATION_TYPES.PARTICIPACION_GANADOR:
      return <NotificacionGanador {...downProps} />;
    case NOTIFICATION_TYPES.NUEVA_PARTICIPACION:
      return <NotificacionSocioAplica {...downProps} />;
    case NOTIFICATION_TYPES.NUEVO_EVENTO:
      return <NotificacionNuevoEvento {...downProps} />;
    case NOTIFICATION_TYPES.EVENTO_ELIMINADO:
      return <NotificacionEventoEliminado {...downProps} />;
    case NOTIFICATION_TYPES.CAMBIO_EVENTO:
      return <NotificacionCambioEvento {...downProps} />;
  }
}

class PortalNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggledRead: false,
      isRead: undefined,
      data: this.formatNotifications(props.rawNotif),
    };
  }

  /* 
    Gets raw notification data
    returns obj with common fields for all notification types 
  */
  formatNotifications = (rawNotif) => {
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

  getAuthor = () => {
    return this.state.data.details.author;
  };

  getNotifAge = () => {
    const date = Math.round(
      new Date(this.state.data.details.date).getTime() / 1000
    );
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
    return window.location.pathname;
  };

  handleClick = (e) => {
    this.toggleRead();
    if (window.location.pathname !== this.getNavPath()) {
      this.props.navigate(this.getNavPath());
      window.location.reload();
    }
    e.preventDefault();
  };

  toggleRead = () => {
    // TODO: One-way call to the backend to update the bd
    if (!this.state.toggledRead) {
      this.setState({
        toggledRead: true,
        isRead: !this.state.data.isRead,
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
      : this.state.data.isRead;
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
          onClick={() => this.deleteNotification(this.state.data.id)}
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
    const details = this.state.data.details;
    return `El cliente ${details.author} ha creado la oportunidad comercial "${details.opportunityName}"`;
  };

  getNavPath = () => {
    return "/detalle/" + this.props.rawNotif.notificacion.detalles.rfp._id;
  };
}

class NotificacionOportunidadEliminada extends PortalNotification {
  getTitle = () => {
    return "Oportunidad Comercial Eliminada";
  };

  getDescription = () => {
    const detalles = this.props.rawNotif.notificacion.detalles;
    const author = detalles.nombreCliente;
    const opportunityName = detalles.detalles;
    return `El cliente ${author} ha eliminado la oportunidad comercial "${opportunityName}"`;
  };
}

class NotificacionCambioEstatus extends PortalNotification {
  getTitle = () => {
    return "Cambio de Estatus";
  };

  getDescription = () => {
    const details = this.state.data.details;
    const detalles = this.props.rawNotif.notificacion.detalles;
    const prevStatus = detalles.estatusPrevio;
    const newStatus = detalles.estatusNuevo;
    return `El cliente ${details.author} ha cambiado el estatus de la oportunidad "${details.opportunityName}" de "${prevStatus}" a "${newStatus}"`;
  };

  getNavPath = () => {
    return "/detalle/" + this.props.rawNotif.notificacion.detalles.rfp._id;
  };
}

class NotificacionCambioHorario extends PortalNotification {
  getTitle = () => {
    return "Cambio de Horario de Junta";
  };

  getDescription = () => {
    const details = this.state.data.details;
    return `El cliente ${details.author} ha cambiado el horario de junta para la oportunidad "${details.opportunityName}" de ${details.prevSched} a ${details.newSched}`;
  };

  getNavPath = () => {
    return "/detalle/" + this.props.rawNotif.notificacion.detalles.rfp._id;
  };
}

class NotificacionNuevoHorario extends PortalNotification {
  getTitle = () => {
    return "Horario de Junta Establecido";
  };

  getDescription = () => {
    const details = this.state.data.details;
    return `El cliente ${details.author} ha establecido el siguiente horario de junta para la oportunidad "${details.opportunityName}": ${details.sched}`;
  };

  getNavPath = () => {
    return "/detalle/" + this.props.rawNotif.notificacion.detalles.rfp._id;
  };
}

class NotificacionRechazo extends PortalNotification {
  getTitle = () => {
    return "Rechazo de Propuesta";
  };

  getDescription = () => {
    const details = this.state.data.details;
    return `Lamentamos informarle que el cliente ${details.author} ha rechazado su propuesta para la oportunidad ${details.opportunityName}`;
  };

  getNavPath = () => {
    return "/detalle/" + this.props.rawNotif.notificacion.detalles.rfp._id;
  };
}

class NotificacionGanador extends PortalNotification {
  getTitle = () => {
    return "Ganador de Propuesta";
  };

  getDescription = () => {
    const details = this.state.data.details;
    return `Nos alegra informarte que el cliente ${details.author} ha seleccionado tu propuesta como ganadora para la oportunidad ${details.opportunityName}`;
  };

  getNavPath = () => {
    return "/detalle/" + this.props.rawNotif.notificacion.detalles.rfp._id;
  };
}

class NotificacionSocioAplica extends PortalNotification {
  getTitle = () => {
    return "Nueva Aplicación de Socio";
  };

  getDescription = () => {
    const details = this.state.data.details;
    const participanteName = this.props.rawNotif.notificacion.detalles
      .participante.name;
    return `El socio ${participanteName} ha aplicado a su oportunidad comercial "${details.opportunityName}"`;
  };

  getNavPath = () => {
    return "/detalle/" + this.props.rawNotif.notificacion.detalles.rfp._id;
  };
}

class NotificacionNuevoEvento extends PortalNotification {
  getTitle = () => {
    return "Nuevo Evento";
  };

  getDescription = () => {
    const details = this.state.data.details;
    const eventName = this.props.rawNotif.notificacion.detalles.detalles;
    return `La oportunidad comercial ${details.opportunityName} tiene un nuevo evento: "${eventName}"`;
  };

  getNavPath = () => {
    return "/detalle/" + this.props.rawNotif.notificacion.detalles.rfp._id;
  };
}

class NotificacionEventoEliminado extends PortalNotification {
  getTitle = () => {
    return "Evento Eliminado";
  };

  getDescription = () => {
    const details = this.state.data.details;
    const nombreEvento = this.props.rawNotif.notificacion.detalles.detalles;
    return `El cliente ${details.author} ha eliminado el evento "${nombreEvento}" de la Oportunidad Comercial "${details.opportunityName}"`;
  };

  getNavPath = () => {
    return "/detalle/" + this.props.rawNotif.notificacion.detalles.rfp._id;
  };
}

class NotificacionCambioEvento extends PortalNotification {
  getTitle = () => {
    const detalles = this.props.rawNotif.notificacion.detalles;
    if (
      detalles.juntaEventoNuevo === detalles.juntaEventoPrevio &&
      detalles.nombreEventoNuevo === detalles.nombreEventoPrevio
    ) {
      return "Cambio en Link de Evento";
    } else if (
      !detalles.cambioLink &&
      detalles.nombreEventoNuevo === detalles.nombreEventoPrevio
    ) {
      return "Cambio en Horario de Evento";
    } else if (
      !detalles.cambioLink &&
      detalles.juntaEventoNuevo === detalles.juntaEventoPrevio
    ) {
      return "Cambio en Nombre de Evento";
    } else {
      return "Cambios en Evento";
    }
  };

  getDescription = () => {
    const detalles = this.props.rawNotif.notificacion.detalles;
    const details = this.state.data.details;
    if (
      detalles.juntaEventoNuevo === detalles.juntaEventoPrevio &&
      detalles.nombreEventoNuevo === detalles.nombreEventoPrevio
    ) {
      return `La liga para el evento "${detalles.nombreEventoNuevo}" de la oportunidad "${details.opportunityName}" ha cambiado`;
    } else if (
      !detalles.cambioLink &&
      detalles.nombreEventoNuevo === detalles.nombreEventoPrevio
    ) {
      const prevDate = new Date(detalles.juntaEventoPrevio).toLocaleString();
      const newDate = new Date(detalles.juntaEventoNuevo).toLocaleString();
      return `El horario del evento ${detalles.nombreEventoNuevo} de la oportunidad "${details.opportunityName}" ha cambiado de ${prevDate} a ${newDate}`;
    } else if (
      !detalles.cambioLink &&
      detalles.juntaEventoNuevo === detalles.juntaEventoPrevio
    ) {
      return `El nombre del evento "${detalles.nombreEventoPrevio}" de la oportunidad "${details.opportunityName}" ha sido renombrado a "${detalles.nombreEventoNuevo}"`;
    } else {
      return `Se han registrado multiples cambios en uno de los eventos de la oportunidad "${details.opportunityName}"`;
    }
  };
}
