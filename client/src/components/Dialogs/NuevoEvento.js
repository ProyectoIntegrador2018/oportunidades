import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import DatePicker from "react-datepicker";
import { FormLabel } from "@material-ui/core";
import "react-datepicker/dist/react-datepicker.css";
import Axios from "axios";
import moment from "moment";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  fechaDiv: {
    height: 200,
    margin: theme.spacing(2),
  },
  title: {},
  marginBott: {
    marginBottom: theme.spacing(1),
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

// Función para date picker
let handleColor = (time) => {
  return time.getHours() > 12 ? "text-success" : "text-error";
};

// Función que redondea una Date hacia arriba, al intervalo de 30 minutos más cercano
const roundUpTime = (date) => {
  if (date.getMinutes() >= 30) {
    date.setHours(date.getHours() + 1, 0, 0, 0);
  } else {
    date.setHours(date.getHours(), 30, 0, 0, 0);
  }
  return date;
};

export default function NuevoEvento(params) {
  const [open, setOpen] = React.useState(false);
  const [nombre, guardarNombre] = React.useState("");
  const [horaActualRedondeada, guardarHoraActualRedondeada] = React.useState(
    roundUpTime(new Date())
  );
  const [fecha, guardarFecha] = React.useState(horaActualRedondeada);
  const [link, guardarLink] = React.useState("");
  const [excludedTimes, setExcludedTimes] = React.useState([]);

  const config = {
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    updateExcludedTimes();

    setOpen(params.isOpen);
  }, [params]);

  const handleClose = () => {
    params.setModalIsOpen(false);
    setOpen(false);
  };
  const handleSave = () => {
    // Guardar el nuevo evento en la base de datos
    Axios.post(
      "/events/",
      {
        name: nombre,
        date: fecha,
        link: link,
        rfp: params.rfp,
      },
      config
    )
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => {
        if (error.message.includes('409')) {
          updateExcludedTimes();
        }
        console.log(error);
      });
  };

  const updateExcludedTimes = () => {
    Axios.get(
      "/events/get-occupied-event-times/" + horaActualRedondeada.toISOString(),
      config
    )
      .then((res) => {
        const occupiedTimes = res.data.occupiedTimes.map((elem) => {
          return new Date(elem);
        });

        setExcludedTimes(occupiedTimes);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const isExcludedDate = () => {
    return fecha < new Date() || excludedTimes.some((elem) => elem.getTime() === fecha.getTime());
  };

  const isSendDisabled = () => {
    return nombre.length < 1 || link.length < 1 || isExcludedDate();
  };

  const calculateMinTime = () => {
    // Si la fecha seleccionada es hoy, deshabilitar horarios anteriores a la hora actual
    const now = new Date();
    if (now.getDate() === fecha.getDate()) {
      return now;
    } else {
      return now.setHours(0, 0, 0, 0);
    }
  };

  const dateMinTime = calculateMinTime();

  const excludedTimesInSelectedDay = excludedTimes.filter((date) => {
    return date.getDate() === fecha.getDate();
  });

  return (
    <div>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth={true}
        scroll="paper"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Agregar Evento
        </DialogTitle>
        <DialogContent dividers>
          <div className="mb-0">
            <FormLabel className="mb-1">
              Selecciona la fecha de la siguiente reunión
            </FormLabel>
          </div>
          <DatePicker
            showTimeSelect
            selected={fecha}
            onChange={(date) => guardarFecha(date)}
            excludeTimes={excludedTimesInSelectedDay}
            timeClassName={handleColor}
            timeCaption="Hora"
            dateFormat="dd/MM/yyyy h:mm aa"
            timeFormat="h:mm aa"
            minDate={dateMinTime}
            minTime={dateMinTime}
            maxTime={new Date(new Date().setHours(23, 59, 0, 0))}
            //timeIntervals={15}
            locale="es"
            title="Selecciona un horario"
          />
          <div>
            {isExcludedDate() ? (
              <p className="error-titulo-rojo">
                El horario seleccionado no está disponible
              </p>
            ) : (
              <br />
            )}
          </div>
          <TextField
            id="nombre"
            className={styles.textField}
            label="Nombre"
            margin="dense"
            fullWidth
            defaultValue={nombre}
            onChange={(event) => guardarNombre(event.target.value)}
          />
          <TextField
            id="link"
            className={styles.marginBott}
            label="Link"
            margin="normal"
            fullWidth
            defaultValue={link}
            onChange={(event) => guardarLink(event.target.value)}
          />
          <div className="mb-4"> </div>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleSave}
            color="primary"
            disabled={isSendDisabled()}
          >
            GUARDAR EVENTO
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
