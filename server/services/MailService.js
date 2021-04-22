const nodemailer = require("nodemailer");
const moment = require("moment");
var pdf = require("html-pdf");
const {
  NUEVA_OPORTUNIDAD,
  NUEVA_PARTICIPACION,
  NUEVO_EVENTO
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

mailService.buildMailContent = (tipoNotificacion, rfp) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {};

    switch (tipoNotificacion) {
      case NUEVA_OPORTUNIDAD:
        mailOptions.subject = "Nueva Oportunidad Comercial";
        mailOptions.text = `te comunicamos que se ha abierto una nueva Oportunidad Comercial, te compartimos los detalles:

        Nombre de la Oportunidad Comercial: ${rfp.nombreOportunidad}
        Objetivo de la oportunidad: ${rfp.objetivoOportunidad}
        Descripción funcional de la oportunidad: ${rfp.descripcionFuncional}
        Requerimientos obligatorios: ${rfp.requerimientosObligatorios}
        Fechas relevantes: ${rfp.fechasRelevantes}
        ¿Ha sido aprobada por el área usuaria?: ${rfp.aprobadaAreaUsuario}
        ¿Ha sido aprobada por el área de TI?: ${rfp.aprobadaAreaTI}
        ¿Tiene un presupuesto asignado?: ${rfp.presupuestoAsignado}
        Tipo general del proyecto: ${rfp.tipoGeneralProyecto}
        Tipo específico del proyecto: ${rfp.tipoEspecificoProyecto}
        Comentarios adicionales: ${rfp.comentariosAdicionales}

        Datos de contacto
        Nombre: ${rfp.nombrecliente}
        Posición: ${rfp.posicioncliente}`;

        mailOptions.html = `<h3>Datos generales</h3>
        <p><b>Nombre de la Oportunidad Comercial:</b> ${rfp.nombreOportunidad}<br>
        <b>Objetivo de la oportunidad:</b> ${rfp.objetivoOportunidad}<br>
        <b>Descripción funcional de la oportunidad:</b> ${rfp.descripcionFuncional}</p>
        <h3>Detalle de la oportunidad</h3>
        <p><b>Requerimientos obligatorios:</b> ${rfp.requerimientosObligatorios}<br>
        <b>Fechas relevantes:</b> ${rfp.fechasRelevantes}</p>
        <h3>Estatus de la necesidad</h3>
        <p><b>¿Ha sido aprobada por el área usuaria?:</b> ${rfp.aprobadaAreaUsuario}<br>
        <b>¿Ha sido aprobada por el área de TI?:</b> ${rfp.aprobadaAreaTI}<br>
        <b>¿Tiene un presupuesto asignado?:</b> ${rfp.presupuestoAsignado}<br>
        <b>Tipo general del proyecto:</b> ${rfp.tipoGeneralProyecto}<br>
        <b>Tipo específico del proyecto:</b> ${rfp.tipoEspecificoProyecto}<br>
        <b>Comentarios adicionales:</b> ${rfp.comentariosAdicionales}</p>
        <h3>Datos de contacto</h3>
        <p><b>Nombre:</b> ${rfp.nombrecliente}<br>
        <b>Posición:</b> ${rfp.posicioncliente}</p>
        <br>`;
        break;

      case NUEVA_PARTICIPACION:
        mailOptions.subject = "Un socio de CSOFTMTY ha aplicado a tu Oportunidad Comercial";
        mailOptions.text = `queremos informarte que el socio ${rfp.participanteName} ha aplicado a tu Oportunidad Comercial "${rfp.nombreOportunidad}".`;
        mailOptions.html = `queremos informarte que el socio ${rfp.participanteName} ha aplicado a tu Oportunidad Comercial "${rfp.nombreOportunidad}".</p>`;
        break;

      case NUEVO_EVENTO:
        moment.locale("es-us")
        const eventDate = upperCaseFirstLetter(moment(rfp.date).format("LLLL"));

        mailOptions.subject = "Nueva junta para Oportunidad Comercial";
        mailOptions.text = `se ha agendado una nueva junta para la Oportunidad Comercial "${rfp.nombreOportunidad}" en la cual estás participando:
        Nombre: ${rfp.name}
        Fecha: ${eventDate}
        Liga de la reunión: ${rfp.link}`;

        mailOptions.html = `se ha agendado una nueva junta para la Oportunidad Comercial "${rfp.nombreOportunidad}" en la cual estás participando:</p>
        <p><b>Nombre:</b> ${rfp.name}<br>
        <b>Fecha:</b> ${eventDate}<br>
        <b>Liga de la reunión:</b> <a href="${rfp.link}">${rfp.link}</a></p>`;
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
          filename: `${rfp.nombreOportunidad}.pdf`,
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

const upperCaseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = mailService;
