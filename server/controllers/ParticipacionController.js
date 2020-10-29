const Participacion = require("../models/Participaciones");
let participacionController = {};

participacionController.createParticipacion = (rawPart, id) => {
  return new Promise((resolve, reject) => {
     rawPart.socioInvolucrado = id;
     const participacion = new Participacion(rawPart);
     participacion
        .save()
        .then(() => {
           return resolve(participacion);
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
            resolve(participacion);
         })
         .catch((error) => {
            reject(error);
         });
   });
};

participacionController.getParticipacionesSocio = (id) => {
  return new Promise((resolve, reject) => {
     Participacion.find({socioInvolucrado: id})
        .then((participaciones) => {
          return resolve( participaciones );
        })
        .catch((error) => {
           return reject({ error });
        });
  });
};



module.exports = participacionController;
