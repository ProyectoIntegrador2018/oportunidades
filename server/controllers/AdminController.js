const User = require('../models/User');
const nodemailer = require('nodemailer');
let adminController = {};

/**
 * @param {Object} rawUser contains the user info to create
 */
adminController.createSocio = (rawUser) => {
   return new Promise((resolve, reject) => {
      const user = new User(rawUser);
      user
         .save()
         .then(() => {
            let transporter = nodemailer.createTransport({
               host: "smtp-mail.outlook.com",
               port: 587,
               secure: false,
               tls: {
                  ciphers: 'SSLv3',
               },
               auth: {
                  user: process.env.MAILER_USER,
                  pass: process.env.MAILER_PASSWORD,
               },
            });

            const mailOptions = {
               from: '"Jose Antonio Aleman Salazar" <antonio.9714@outlook.com>', // sender address
               to: 'antonio.9714@gmail.com', // list of receivers
               subject: "Tu usuario para Oportunidades Comerciales", // Subject line
               text: "Bienvenido", // plain text body
               html: `
               <b>Bienvenido al sistema de Oportunidades Comerciales del Clúster TIC de Nuevo León<b>
               <b>A continuación están tus credenciales para iniciar sesión en el sistema. Te recomendamos cambiar
               tu contraseña al iniciar sesión por primera vez.<b>
               <p>Username: ${user.email}</p>
               <p>Password: ${rawUser.password}</p>`,
            };
            transporter.sendMail(mailOptions, function(error, info) {
               if(error) {
                  console.log(error)
               } else {
                  console.log("se envio el correo")
               }
            });
            resolve(user);
         })
         .catch((error) => {
            reject(error);
         });
   })
}

module.exports = adminController;