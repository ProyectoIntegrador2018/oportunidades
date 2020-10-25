const Participacion = require("../models/Participaciones");
let participacionController = {};

participacionController.createParticipacion = (rawPart, id) => {
  return new Promise((resolve, reject) => {
     rawPart.socioInvolucrado = id;
     const participacion = new Participacion(rawPart);
     participacion
        .save()
        .then(() => {
           resolve(participacion);
        })
        .catch((error) => {
           reject(error);
        });
  });
};

participacionController.deleteParticipacion = (req, res) => {
  const _id = req.params.id
  Participacion.findByIdAndDelete(_id).then(function(participacion) {
    if (!participacion) {
      return res.status(404).send({})
    }
    return res.send(participacion)
  }).catch(function(error) {
    res.status(505).send({ error })
  })
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
