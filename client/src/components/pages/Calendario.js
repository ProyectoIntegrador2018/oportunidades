import React, {useState, useEffect} from "react";
import { Grid, Typography } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from '@material-ui/core/Card';
import axios from 'axios';

import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment'


import "../../styles/globalStyles.css";
import SideMenu from "../SideMenu/SideMenu";
import FabButton from "../ui/FabButton";

const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: '#EE5D36',
    },
  })

const Calendario = () => {
   // state de lista de RFPs
   const [listaRfps, guardarListaRfps] = useState([]);
   // state de lista de participaciones de socio en RFPs
   const [listaParticipaciones, guardarListaParticipaciones] = useState([]);

   // state de control de si ya se hizo la llamada a la base de datos
   const [llamada, guardarLlamada] = useState('false');

   // Obtener tipo de usuario
   const userType = sessionStorage.getItem("userType");

   // Setup the localizer by providing the moment (or globalize) Object
   // to the correct localizer.
   //const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer
   const [myEventsList, guardarmyEventsList] = useState([]);
   var events = [
      {
         id: 2,
         title: 'Evento 1',
         start: new Date(2020, 10, 15, 0, 0, 0),
         end: new Date(2020, 10, 15, 1, 0, 0),
       },
       {
         id: 3,
         title: 'Evento 2',
         start: new Date(2020, 10, 25, 0, 0, 0),
         end: new Date(2020, 10, 25, 1, 0, 0),
       },
   ];
   const localizer = momentLocalizer(moment)

   useEffect(() => {
      const config = {
         headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
            "Content-Type": "application/json",
         },
      };

      const obtenerListaRfpsAdmin = () => {
        axios
            .get("/RFP/get-rfp", config)
            .then((res) => {
               // guardar lista de RFPs en state
               guardarListaRfps(res.data);
               // actualizar variable de control
               guardarLlamada('true');
            })
            .catch((error) => {
               console.log(error);
            })
      };
      const obtenerListaRfpsCliente = () => {
         axios
             .get("/RFP/get-rfp-cliente", config)
             .then((res) => {
                // guardar lista de RFPs en state
                guardarListaRfps(res.data);
                // actualizar variable de control
               guardarLlamada('true');
             })
             .catch((error) => {
                console.log(error);
             })
       };
       const obtenerListaRfpsSocio = () => {
          axios
              .get("/RFP/get-rfp-socio", config)
              .then((res) => {
                 // guardar lista de RFPs en state
                 guardarListaRfps(res.data);
                 // actualizar variable de control
                 guardarLlamada('true');
              })
              .catch((error) => {
                 console.log(error);
              })
          axios
              .get("/participacion/get-participaciones-socio", config)
              .then((res) => {
                 // guardar lista de RFPs en state
                 guardarListaParticipaciones(res.data);
                 // actualizar variable de control
                 guardarLlamada('true');
              })
              .catch((error) => {
                 console.log(error);
              })
       };

      if (userType === 'admin') obtenerListaRfpsAdmin();
      if (userType === 'cliente') obtenerListaRfpsCliente();
      if (userType === 'socio') obtenerListaRfpsSocio();
    }, []);

    for (var i = 0; i < listaRfps.length; i++) {
       listaRfps[i].participandoActual = false;
       for (var j = 0; j < listaParticipaciones.length; j++) {
           if (listaRfps[i]._id == listaParticipaciones[j].rfpInvolucrado) {
               listaRfps[i].participandoActual = true;
           }
       }
    }

    let allViews = Object.keys(Views).map(k => Views[k])
    console.log(events);

      return (
      <>
         <SideMenu />
         {userType === 'cliente'
            ? (<FabButton link="/registro-oportunidad"/>)
            : (<Grid container className="container-dashboard-margin" ></Grid>)
         }

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
               <Calendar 
                  localizer={localizer} 
                  events={events}
                  views={allViews}
                  step={60}
                  components={{
                     timeSlotWrapper: ColoredDateCellWrapper,
                   }}
               />
            </div>
            
           
         </Grid>
      </>
   );
};

export default Calendario;
