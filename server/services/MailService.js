const nodemailer = require("nodemailer");
const moment = require("moment");
var pdf = require("html-pdf");
const {
  NUEVA_OPORTUNIDAD,
  NUEVA_PARTICIPACION,
  NUEVO_EVENTO,
  CAMBIO_EVENTO,
  CAMBIO_ESTATUS
} = require("../utils/NotificationTypes");

var options = { format: "Letter" };
const mailService = {};

var mailConfig = {
  service: process.env.MAIL_SERVICE,
  pool: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  },
};

var transporter = nodemailer.createTransport(mailConfig, {
  from: `Oportunidades Comerciales CSOFTMTY <${process.env.MAIL_USER}>`
});

// email sender function
mailService.sendEmail = (jobData) => {
  return new Promise((resolve, reject) => {
    const { mailContent, destinatario } = jobData;

    const mailOptions = {
      to: destinatario.email,
      subject: mailContent.subject,
      text: `Hola ${destinatario.name}, ${mailContent.text}`,
      html: `<p>Hola ${destinatario.name}, ${mailContent.html}`
    };

    if (mailContent.attachments) {
      mailOptions.attachments = {
        filename: mailContent.attachments.filename,
        content: mailContent.attachments.content,
        encoding: "base64"
      };
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log(`Notification email sent to ${destinatario.email}`);
        resolve(info);
      }
    });
  });
};

mailService.buildMailContent = (tipoNotificacion, mailData) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {};

    switch (tipoNotificacion) {
      case NUEVA_OPORTUNIDAD:
        mailOptions.subject = "Nueva Oportunidad Comercial";
        mailOptions.text = `te comunicamos que se ha abierto una nueva Oportunidad Comercial, te compartimos los detalles:

        Nombre de la Oportunidad Comercial: ${mailData.nombreOportunidad}
        Objetivo de la oportunidad: ${mailData.objetivoOportunidad}
        Descripción funcional de la oportunidad: ${mailData.descripcionFuncional}
        Requerimientos obligatorios: ${mailData.requerimientosObligatorios}
        Fechas relevantes: ${mailData.fechasRelevantes}
        ¿Ha sido aprobada por el área usuaria?: ${mailData.aprobadaAreaUsuario}
        ¿Ha sido aprobada por el área de TI?: ${mailData.aprobadaAreaTI}
        ¿Tiene un presupuesto asignado?: ${mailData.presupuestoAsignado}
        Tipo general del proyecto: ${mailData.tipoGeneralProyecto}
        Tipo específico del proyecto: ${mailData.tipoEspecificoProyecto}
        Comentarios adicionales: ${mailData.comentariosAdicionales}

        Datos de contacto
        Nombre: ${mailData.nombrecliente}
        Posición: ${mailData.posicioncliente}`;

        mailOptions.html = `<h3>Datos generales</h3>
        <p><b>Nombre de la Oportunidad Comercial:</b> ${mailData.nombreOportunidad}<br>
        <b>Objetivo de la oportunidad:</b> ${mailData.objetivoOportunidad}<br>
        <b>Descripción funcional de la oportunidad:</b> ${mailData.descripcionFuncional}</p>
        <h3>Detalle de la oportunidad</h3>
        <p><b>Requerimientos obligatorios:</b> ${mailData.requerimientosObligatorios}<br>
        <b>Fechas relevantes:</b> ${mailData.fechasRelevantes}</p>
        <h3>Estatus de la necesidad</h3>
        <p><b>¿Ha sido aprobada por el área usuaria?:</b> ${mailData.aprobadaAreaUsuario}<br>
        <b>¿Ha sido aprobada por el área de TI?:</b> ${mailData.aprobadaAreaTI}<br>
        <b>¿Tiene un presupuesto asignado?:</b> ${mailData.presupuestoAsignado}<br>
        <b>Tipo general del proyecto:</b> ${mailData.tipoGeneralProyecto}<br>
        <b>Tipo específico del proyecto:</b> ${mailData.tipoEspecificoProyecto}<br>
        <b>Comentarios adicionales:</b> ${mailData.comentariosAdicionales}</p>
        <h3>Datos de contacto</h3>
        <p><b>Nombre:</b> ${mailData.nombrecliente}<br>
        <b>Posición:</b> ${mailData.posicioncliente}</p>
        <br>`;
        break;

      case NUEVA_PARTICIPACION:
        mailOptions.subject = "Un socio de CSOFTMTY ha aplicado a tu Oportunidad Comercial";
        mailOptions.text = `queremos informarte que el socio ${mailData.participanteName} ha aplicado a tu Oportunidad Comercial "${mailData.nombreOportunidad}".`;
        mailOptions.html = `queremos informarte que el socio ${mailData.participanteName} ha aplicado a tu Oportunidad Comercial "${mailData.nombreOportunidad}".</p>`;
        break;

      case NUEVO_EVENTO:
        const eventDate = dateToString(mailData.date);

        mailOptions.subject = "Nueva junta para Oportunidad Comercial";
        mailOptions.text = `se ha agendado una nueva junta para la Oportunidad Comercial "${mailData.nombreOportunidad}" en la cual estás participando:
        Nombre: ${mailData.name}
        Fecha: ${eventDate}
        Liga de la reunión: ${mailData.link}`;

        mailOptions.html = `se ha agendado una nueva junta para la Oportunidad Comercial "${mailData.nombreOportunidad}" en la cual estás participando:</p>
        <p><b>Nombre:</b> ${mailData.name}<br>
        <b>Fecha:</b> ${eventDate}<br>
        <b>Liga de la reunión:</b> <a href="${mailData.link}">${mailData.link}</a></p>`;
        break;

      case CAMBIO_EVENTO:
        const dateEventUpdated = dateToString(mailData.eventUpdated.date);
        const dateEventBeforeUpdate =
          mailData.eventUpdated.date === mailData.eventBeforeUpdate.date
            ? dateEventUpdated
            : dateToString(mailData.eventBeforeUpdate.date);

        mailOptions.subject = "Cambio en junta para Oportunidad Comercial";
        mailOptions.text = `se han hecho cambios en una junta para la Oportunidad Comercial "${mailData.nombreOportunidad}" en la cual estás participando:
        Datos actualizados:
        Nombre: ${mailData.eventUpdated.name}
        Fecha: ${dateEventUpdated}
        Liga de la reunión: ${mailData.eventUpdated.link}
        Datos antiguos:
        Nombre: ${mailData.eventBeforeUpdate.name}
        Fecha: ${dateEventBeforeUpdate}
        Liga de la reunión: ${mailData.eventBeforeUpdate.link}`;

        mailOptions.html = `se han hecho cambios en una junta para la Oportunidad Comercial "${mailData.nombreOportunidad}" en la cual estás participando:</p>
        <h3>Datos actualizados:</h3>
        <p><b>Nombre:</b> ${mailData.eventUpdated.name}<br>
        <b>Fecha:</b> ${dateEventUpdated}<br>
        <b>Liga de la reunión:</b> <a href="${mailData.eventUpdated.link}">${mailData.eventUpdated.link}</a></p>
        <h3>Datos antiguos:</h3>
        <p><b>Nombre:</b> ${mailData.eventBeforeUpdate.name}<br>
        <b>Fecha:</b> ${dateEventBeforeUpdate}<br>
        <b>Liga de la reunión:</b> <a href="${mailData.eventBeforeUpdate.link}">${mailData.eventBeforeUpdate.link}</a></p>`;
        break;

      case CAMBIO_ESTATUS:
        mailOptions.subject = "Cambio de estatus en la Oportunidad Comercial";
        mailOptions.text = `queremos informarte que el cliente ${mailData.nombreCliente} ha cambiado el estatus de la oportunidad "${mailData.nombreOportunidad}" a ${mailData.estatus}.`;
        mailOptions.html = `queremos informarte que el cliente ${mailData.nombreCliente} ha cambiado el estatus de la oportunidad "${mailData.nombreOportunidad}" a ${mailData.estatus}.</p>`;
        break;

      default:
        reject("Invalid notificationType");
    }

    mailOptions.text += "\n\nGracias,\nNotificaciones de CSOFTMTY";
    mailOptions.html += `<p>Gracias,<br>
    Notificaciones de CSOFTMTY</p>
    <img src="https://www.csoftmty.org/assets/images/header/logo.png" alt="logo_csoftmty"/>`;

    if (tipoNotificacion === NUEVA_OPORTUNIDAD) {
      generatePdf("Nueva Oportunidad Comercial", mailOptions.html).then((base64String) => {
        mailOptions.attachments = {
          filename: `${mailData.nombreOportunidad}.pdf`,
          content: base64String,
        };
        mailOptions.html = "te comunicamos que se ha abierto una nueva Oportunidad Comercial, te compartimos los detalles:" + mailOptions.html;
        resolve(mailOptions);
      });
    } else {
      resolve(mailOptions);
    }
  });
};

const generatePdf = (bodyTitle, htmlBody) => {
  return new Promise((resolve, reject) => {
    htmlToPdf = `
    <!doctype html>
    <html>
      <head>
        <style>
        h1 {
          margin-top:40px;
          text-align:center;
        }
        h3 {
          font-weight:bold;
        }
        img {
          display:block;
          margin-left:auto;
          margin-right:auto;
          width:50%;
        }
        body {
          font-family:Helvetica;
          margin:50px;
        }
        </style>
      </head>
        <body>
          <h1>${bodyTitle}</h1>
          ${htmlBody}
        </body>
    </html>`;

    pdf.create(htmlToPdf, options).toBuffer(function (err, res) {
      if (err) reject(err);
      resolve(res.toString("base64"));
    });
  });
};

const dateToString = (date) => {
  moment.locale("es-us");
  return upperCaseFirstLetter(moment(date).format("LLLL"));
};

const upperCaseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

module.exports = mailService;
