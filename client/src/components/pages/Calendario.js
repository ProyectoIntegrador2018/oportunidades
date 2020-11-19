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
import axios from "axios";

import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import FabButton from "../ui/FabButton";

const addHours = function (d) {
   let hours = d.getHours();
   let minutes = d.getMinutes();
   console.log(hours, minutes);
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
   const [selectedEventName, setSelectedEventName] = useState("");
   const [selectedEventDate, setSelectedEventDate] = useState("");
   const [selectedEventLink, setSelectedEventLink] = useState("");
   const [selectedEventTime, setSelectedEventTime] = useState("")

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
   }
   const openModal = () => {
      setIsModalOpen(true);
   }

   const handleSelectedEvent = (theEvent) => {
      // Opciones para mostrar la fecha en string
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      console.log(theEvent)
      setSelectedEventName(theEvent.title)
      let spanishDate = translateDate(theEvent.start)
      setSelectedEventDate(moment.utc(theEvent.start).toDate().toLocaleDateString('es-ES', options))
      setSelectedEventTime(moment.utc(theEvent.start).toDate().toLocaleTimeString('en-US'))
      setSelectedEventLink(theEvent.link)
      openModal()
   }

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
      let year = theDate.getFullYear()
      return `${day} de ${month} del ${year}`;
   }

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
               console.log(res.data);
               let events = [];
               res.data.events.forEach((evento) => {
                  events.push({
                     id: evento._id,
                     title: evento.name,
                     start: new Date(evento.date),
                     end: addHours(new Date(evento.date)),
                     link: evento.link
                  });
               });
               guardarmyEventsList(events);
            })
            .catch((err) => {
               console.log(err);
            });
      };
      getUserEvents();

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

         <Grid
            container
            direction="column"
            className="container-calendar-white "
         >
            {/* <BigCalendar
               localizer={localizer}
               events={myEventsList}
               startAccessor="start"
               endAccessor="end"
            /> */}
            <div className="container-calendar">
               <Dialog open={isModalOpen} onClose={closeModal}>
                  <DialogTitle>
                     {" "}
                     {`Detalles sobre evento ${selectedEventName}`}
                  </DialogTitle>
                  <DialogContent>
                     <TextField
                        label="Nombre del evento"
                        defaultValue={selectedEventName}
                        disabled={true}
                        margin="dense"
                        fullWidth
                     />
                     <br />
                     <TextField
                        label="Fecha"
                        defaultValue={selectedEventDate}
                        disabled={true}
                        fullWidth
                     />
                     <br />
                     <TextField
                        label="Hora"
                        defaultValue={selectedEventTime}
                        disabled={true}
                        fullWidth
                     />
                     <br />
                     <TextField
                        label="Liga del evento"
                        defaultValue={selectedEventLink}
                        disabled={true}
                        fullWidth
                     />
                  </DialogContent>

                  <DialogActions>
                     <Button
                        onClick={closeModal}
                        color="primary"
                     >
                        OK
                     </Button>
                  </DialogActions>
               </Dialog>
               <Calendar
                  localizer={localizer}
                  events={myEventsList}
                  views={allViews}
                  step={60}
                  components={{
                     timeSlotWrapper: ColoredDateCellWrapper,
                  }}
                  onSelectEvent={selectedEvent => handleSelectedEvent(selectedEvent)}
               />
            </div>
         </Grid>
      </>
   );
};

export default Calendario;
