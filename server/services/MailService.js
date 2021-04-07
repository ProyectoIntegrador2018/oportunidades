const nodemailer = require("nodemailer");
const notificationTypes = require("../utils/NotificationTypes");

const mailService = {};

var mailConfig = {
  service: process.env.MAIL_SERVICE,
  pool: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
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
      case notificationTypes.NUEVA_OPORTUNIDAD:
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
Posición: ${rfp.posicioncliente}
Teléfono: ${rfp.telefono}
Correo electrónico: ${rfp.email}

Gracias,
Notificaciones de CSOFTMTY`;

        mailOptions.html = `te comunicamos que se ha abierto una nueva Oportunidad Comercial, te compartimos los detalles:</p>
          <p><b>Nombre de la Oportunidad Comercial:</b> ${rfp.nombreOportunidad}<br>
          <b>Objetivo de la oportunidad:</b> ${rfp.objetivoOportunidad}<br>
          <b>Descripción funcional de la oportunidad:</b> ${rfp.descripcionFuncional}<br>
          <b>Requerimientos obligatorios:</b> ${rfp.requerimientosObligatorios}<br>
          <b>Fechas relevantes:</b> ${rfp.fechasRelevantes}<br>
          <b>¿Ha sido aprobada por el área usuaria?:</b> ${rfp.aprobadaAreaUsuario}<br>
          <b>¿Ha sido aprobada por el área de TI?:</b> ${rfp.aprobadaAreaTI}<br>
          <b>¿Tiene un presupuesto asignado?:</b> ${rfp.presupuestoAsignado}<br>
          <b>Tipo general del proyecto:</b> ${rfp.tipoGeneralProyecto}<br>
          <b>Tipo específico del proyecto:</b> ${rfp.tipoEspecificoProyecto}<br>
          <b>Comentarios adicionales:</b> ${rfp.comentariosAdicionales}</p>
          <h3>Datos de contacto</h3>
          <p><b>Nombre:</b> ${rfp.nombrecliente}<br>
          <b>Posición:</b> ${rfp.posicioncliente}<br>
          <b>Teléfono:</b> ${rfp.telefono}<br>
          <b>Correo electrónico:</b> ${rfp.email}</p>
          <p>Gracias,<br>
          Notificaciones de CSOFTMTY</p>
          <img src="https://www.csoftmty.org/assets/images/header/logo.png" alt="logo_csoftmty"/>`;
        break;
      
      default:
        reject("Invalid notificationType");
    }
    resolve(mailOptions);
  });
};

module.exports = mailService;
