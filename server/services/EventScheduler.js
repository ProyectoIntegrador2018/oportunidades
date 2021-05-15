const UserModel = require("../models/User");
const RFPModel = require("../models/RFP");
const EventModel = require("../models/Event");
const { CAMBIO_ESTATUS, OPORTUNIDAD_CERRADA_NO_PARTICIPACIONES } = require("../utils/NotificationTypes");
const notificationQueue = require("../services/NotificationQueue");
const cron = require("node-cron");
const eventScheduler = {};

const nextStatus = {
  Activo: "En proceso",
  "En proceso": "En proceso",
  Cerrada: "Cerrada",
};

const getNextStatus = (status) => nextStatus[status];

/**
 * Actualiza a En proceso el estatus de las oportunidades
 * con estatus Activo, que ya tuvieron el primer evento
 */
eventScheduler.checkForEventStatusUpdate = () => {
  cron.schedule("0 1 * * *", () => {
    EventModel.getEventsFromLastDay()
      .then((events) => {
        events.map((event) => {
          const rfpId = event.rfp;
          RFPModel.findById(rfpId)
            .then((rfp) => {
              if (rfp.estatus === "Activo") {
                const prevStatus = rfp.estatus;
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
                      const job = {
                        rfpId: rfp._id,
                        estatusPrevio: prevStatus,
                        estatusNuevo: nextStatus,
                        nombrecliente: rfp.nombreCliente,
                        nombreOportunidad: rfp.nombreOportunidad,
                      };
                      notificationQueue.add(CAMBIO_ESTATUS, job);
                    }
                  }
                );
              }
            })
            .catch((error) => console.log(error));
        });
      })
      .catch((error) => console.log(error));
  });
};

/**
 * Cierra las oportunidades que tienen 14 dias de antiguedad y
 * que no tienen ningun participante
 */
eventScheduler.checkForOldRfps = () => {
  cron.schedule("0 1 * * *", () => {
    const daysAgo = 14;
    RFPModel.getRfpsFromNDaysAgo(daysAgo)
      .then((rfps) => {
        rfps.map((rfp) => {
          const rfpId = rfp._id;
          UserModel.findParticipantesByRfp(rfpId).then(
            (sociosParticipantes) => {
              if (sociosParticipantes.length === 0) {
                RFPModel.update(
                  { _id: rfpId },
                  {
                    estatus: "Cerrada",
                  },
                  function (err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      const job = {
                        cliente: rfp.createdBy,
                        nombreOportunidad: rfp.nombreOportunidad,
                      };
                      notificationQueue.add(
                        OPORTUNIDAD_CERRADA_NO_PARTICIPACIONES,
                        job
                      );
                    }
                  }
                );
              }
            }
          );
        });
      })
      .catch((error) => console.log(error));
  });
};

module.exports = eventScheduler;
