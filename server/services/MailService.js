const nodemailer = require("nodemailer");
const notificationTypes = require("../utils/NotificationTypes");

// email sender function
exports.sendEmail = function(notificationType, rfp, destinatarios) {

  var transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
    }
  });

  var mailsDestinatarios = [];
  destinatarios.map((destinatario) => {
    mailsDestinatarios.push(destinatario.email);
  });

  var mailOptions = {
    from: `Oportunidades Comerciales CSOFTMTY <${process.env.MAIL_USER}>`,
    to: mailsDestinatarios
  };

  switch(notificationType) {
    case notificationTypes.NUEVA_OPORTUNIDAD:
      mailOptions.subject = "Nueva Oportunidad Comercial"
      mailOptions.text = `Hola NOMBRE DESTINATARIO, te comunicamos que se ha abierto una nueva Oportunidad Comercial, te compartimos los detalles:

        Nombre de la Oportunidad Comercial: ${rfp.nombreOportunidad}
        Objetivo de la oportunidad: ${rfp.objetivoOportunidad}
        Descripción funcional de la oportunidad: ${rfp.descripcionFuncional}
        Requerimientos obligatorios: ${rfp.requerimientosObligatorios}
        Fechas relevantes: ${rfp.fechasRelevantes}
        ¿Ha sido aprobada por el área usuaria?: ${rfp.aprobadaAreaUsuario}
        ¿Ha sido aprobada por el área de TI?: ${rfp.aprobadaAreaTI}
        ¿Tiene un presupuesto asignado?: ${rfp.presupuestoAsignado}
        Tipo general del proyecto: ${rfp.tipoGeneralProyecto}
        Tipo especifico del proyecto: ${rfp.tipoEspecificoProyecto}
        Comentarios adicionales: ${rfp.comentariosAdicionales}
        
        Datos de contacto
        Nombre: ${rfp.nombrecliente}
        Posición: ${rfp.posicioncliente}
        Teléfono: ${rfp.telefono}
        Correo electrónico: ${rfp.email}
        
        Gracias,
        Notificaciones de CSOFTMTY`

      mailOptions.html = `<p>Hola NOMBRE DESTINATARIO, te comunicamos que se ha abierto una nueva Oportunidad Comercial, te compartimos los detalles:</p>
        <p><b>Nombre de la Oportunidad Comercial:</b> ${rfp.nombreOportunidad}<br>
        <b>Objetivo de la oportunidad:</b> ${rfp.objetivoOportunidad}<br>
        <b>Descripción funcional de la oportunidad:</b> ${rfp.descripcionFuncional}<br>
        <b>Requerimientos obligatorios:</b> ${rfp.requerimientosObligatorios}<br>
        <b>Fechas relevantes:</b> ${rfp.fechasRelevantes}<br>
        <b>¿Ha sido aprobada por el área usuaria?:</b> ${rfp.aprobadaAreaUsuario}<br>
        <b>¿Ha sido aprobada por el área de TI?:</b> ${rfp.aprobadaAreaTI}<br>
        <b>¿Tiene un presupuesto asignado?:</b> ${rfp.presupuestoAsignado}<br>
        <b>Tipo general del proyecto:</b> ${rfp.tipoGeneralProyecto}<br>
        <b>Tipo especifico del proyecto:</b> ${rfp.tipoEspecificoProyecto}<br>
        <b>Comentarios adicionales:</b> ${rfp.comentariosAdicionales}<br></p>
        <p><h3>Datos de contacto</h3>
        <b>Nombre:</b> ${rfp.nombrecliente}<br>
        <b>Posición:</b> ${rfp.posicioncliente}<br>
        <b>Teléfono:</b> ${rfp.telefono}<br>
        <b>Correo electrónico:</b> ${rfp.email}</p>
        <p>Gracias,<br>
        Notificaciones de CSOFTMTY</p>`

      break;
    default:
      console.log("Invalid notificationType");
  }

  transporter.sendMail(mailOptions, function(error, info){
    if (error){
      console.log(error);
    } else {
      console.log("Notification email sent");
    }
  });

};