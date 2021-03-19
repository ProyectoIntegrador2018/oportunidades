const Participacion = require("../models/Participaciones");
const notificationService = require("../services/NotificationService");
const Event = require("../models/Event");
const User = require("../models/User");
let participacionController = {};

participacionController.createParticipacion = (rawPart, id) => {
   return new Promise((resolve, reject) => {
      rawPart.socioInvolucrado = id;
      const participacion = new Participacion(rawPart);
      participacion
         .save()
         .then(() => {
            Event.find({ rfp: rawPart.rfpInvolucrado }).then((events) => {
               User.update({ _id: id }, { $push: { events: events } })
                  .then((update) => {
                     return resolve(participacion);
                  })
                  .catch((err) => {
                     return reject(err);
                  });
            })
            .then(()=>{
               return notificationService
               .notificacionNuevaParticipacion(participacion)
               .then((participacion) => {
                  return participacion;
               })
               .catch((error) => {
               reject(error);
               });
            });
         })
         .catch((error) => {
            return reject(error);
         });
   });
};

participacionController.deleteParticipacion = (id) => {
   return new Promise((resolve, reject) => {
      Participacion.findByIdAndDelete(id)
         .then((participacion) => {
            Event.find({ rfp: participacion.rfpInvolucrado }).then((events) => {
               User.update({ _id: participacion.socioInvolucrado }, { $pullAll: { events: events } })
                  .then((update) => {
                     resolve(participacion);
                  })
                  .catch((err) => {
                     reject(err);
                  });
            });
         })
         .catch((error) => {
            reject(error);
         });
   });
};

participacionController.getParticipacionesSocio = (id) => {
   return new Promise((resolve, reject) => {
      Participacion.find({ socioInvolucrado: id })
         .then((participaciones) => {
            return resolve(participaciones);
         })
         .catch((error) => {
            return reject({ error });
         });
   });
};

participacionController.getParticipacionesRFP = (id) => {
  return new Promise((resolve, reject) => {
     Participacion.find({rfpInvolucrado: id})
        .then((participaciones) => {
          return resolve( participaciones );
        })
        .catch((error) => {
           return reject({ error });
        });
  });
};

module.exports = participacionController;
