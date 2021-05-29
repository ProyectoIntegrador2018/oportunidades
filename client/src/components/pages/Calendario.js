import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";

import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import FabButton from "../ui/FabButton";
import CalendarEventDetails from "../Dialogs/CalendarEventDetails";

const addHours = function (d) {
  let hours = d.getHours();
  let minutes = d.getMinutes();
  d.setHours(hours + 1, minutes + 30, 0, 0);
  return d;
};
const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: "#EE5D36",
    },
  });

const Calendario = () => {
  // state de lista de RFPs
  const [listaRfps, guardarListaRfps] = useState([]);
  // state de lista de participaciones de socio en RFPs
  const [listaParticipaciones, guardarListaParticipaciones] = useState([]);

  // state de control de si ya se hizo la llamada a la base de datos
  const [llamada, guardarLlamada] = useState("false");

  const [startDate, setStartDate] = useState(new Date());
  const [selectedEventOpportunityName, setSelectedEventOpportunityName] = useState("");
  const [selectedEventName, setSelectedEventName] = useState("");
  const [selectedEventDate, setSelectedEventDate] = useState("");
  const [selectedEventLink, setSelectedEventLink] = useState("");
  const [selectedEventTime, setSelectedEventTime] = useState("");

  // Obtener tipo de usuario
  const userType = sessionStorage.getItem("userType");

  // Setup the localizer by providing the moment (or globalize) Object
  // to the correct localizer.
  //const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer
  const [myEventsList, guardarmyEventsList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const localizer = momentLocalizer(moment);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleSelectedEvent = (theEvent) => {
    const config = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };

    // Opciones para mostrar la fecha en string
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    axios
      .get("/events/opportunity-name/" + theEvent.id, config)
      .then((res) => {
        setSelectedEventOpportunityName(res.data.opportunityName);
      })
      .catch((error) => {
        console.log(error);
      });

    setSelectedEventName(theEvent.title);
    let spanishDate = translateDate(theEvent.start);
    setSelectedEventDate(
      moment.utc(theEvent.start).toDate().toLocaleDateString("es-ES", options)
    );
    setSelectedEventTime(
      moment.utc(theEvent.start).toDate().toLocaleTimeString("en-US")
    );
    setSelectedEventLink(theEvent.link);
    openModal();
  };

  const translateDate = (theDate) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    let month = months[theDate.getMonth()];
    let day = theDate.getDay();
    let year = theDate.getFullYear();
    return `${day} de ${month} del ${year}`;
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    };

    const getUserEvents = () => {
      axios
        .get("/events/get-user-events", config)
        .then((res) => {
          let events = [];
          res.data.events.forEach((evento) => {
            events.push({
              id: evento._id,
              title: evento.name,
              start: new Date(evento.date),
              end: addHours(new Date(evento.date)),
              link: evento.link,
            });
          });
          guardarmyEventsList(events);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    if (userType === "admin") {
      axios
        .get("/events/all-events", config)
        .then((res) => {
          let events = [];
          res.data.events.forEach((evento) => {
            events.push({
              id: evento._id,
              title: evento.name,
              start: new Date(evento.date),
              end: addHours(new Date(evento.date)),
              link: evento.link,
            });
          });
          guardarmyEventsList(events);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      getUserEvents();
    }

    // if (userType === "admin") obtenerListaRfpsAdmin();
    // if (userType === "cliente") obtenerListaRfpsCliente();
    // if (userType === "socio") obtenerListaRfpsSocio();
  }, []);

  for (var i = 0; i < listaRfps.length; i++) {
    listaRfps[i].participandoActual = false;
    for (var j = 0; j < listaParticipaciones.length; j++) {
      if (listaRfps[i]._id == listaParticipaciones[j].rfpInvolucrado) {
        listaRfps[i].participandoActual = true;
      }
    }
  }

  let allViews = Object.keys(Views).map((k) => Views[k]);

  return (
    <>
      <SideMenu />

      <Grid container className="container-dashboard-margin"></Grid>

      {/* {userType === "cliente" ? (
            <FabButton link="/registro-oportunidad" />
         ) : (
            <Grid container className="container-dashboard-margin"></Grid>
         )} */}

      <Grid container direction="column" className="container-calendar-white ">
        {/* <BigCalendar
               localizer={localizer}
               events={myEventsList}
               startAccessor="start"
               endAccessor="end"
            /> */}
        <div className="container-calendar">
          <CalendarEventDetails
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            selectedEventOpportunityName={selectedEventOpportunityName}
            selectedEventName={selectedEventName}
            selectedEventDate={selectedEventDate}
            selectedEventTime={selectedEventTime}
            selectedEventLink={selectedEventLink}
          />
          <Calendar
            localizer={localizer}
            events={myEventsList}
            views={allViews}
            step={60}
            components={{
              timeSlotWrapper: ColoredDateCellWrapper,
            }}
            onSelectEvent={(selectedEvent) =>
              handleSelectedEvent(selectedEvent)
            }
          />
        </div>
      </Grid>
    </>
  );
};

export default Calendario;
