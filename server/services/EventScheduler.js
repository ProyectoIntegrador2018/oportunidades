const RFPModel = require("../models/RFP");
const EventModel = require("../models/Event");
const cron = require("node-cron");
const eventScheduler = {};

const nextStatus = {
  Activo: "Sesión 1 llevada a cabo",
  "Sesión 1 llevada a cabo": "Sesión 2 llevada a cabo",
  "Esperando respuesta": "Cerrada",
  Cerrada: "Cerrada",
};

const getNextStatus = (status) => nextStatus[status];

eventScheduler.checkForEventStatusUpdate = () => {
  cron.schedule("0 1 * * *", () => {
    EventModel.getEventsFromLastDay()
      .then((events) => {
        events.map((event) => {
          const rfpId = event.rfp;
          RFPModel.findById(rfpId)
            .then((rfp) => {
              const nextStatus = getNextStatus(rfp.estatus);
              RFPModel.update(
                { _id: rfpId },
                {
                  estatus: nextStatus,
                },
                function (err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(result);
                  }
                }
              );
            })
            .catch((error) => console.log(error));
        });
      })
      .catch((error) => console.log(error));
  });
};

module.exports = eventScheduler;
