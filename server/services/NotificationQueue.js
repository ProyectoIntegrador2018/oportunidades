const Queue = require("bull");
const { port, host, db, url } = require("../config/redisConfig");
const {
  NUEVA_OPORTUNIDAD,
  OPORTUNIDAD_ELIMINADA,
  CAMBIO_ESTATUS,
} = require("../utils/NotificationTypes");
const notificationService = require("../services/NotificationService");

let notificationQueue;
if (process.env.HEROKU_ENV === "production") {
  notificationQueue = new Queue("notification-queue", url)
} else {
  notificationQueue = new Queue("notification-queue", {
    redis: { port: port, host: host},
  });
}

notificationQueue.process(NUEVA_OPORTUNIDAD, (job) => {
  return notificationService.notificacionNuevaOportunidad(job);
});

notificationQueue.process(OPORTUNIDAD_ELIMINADA, (job) => {
  return notificationService.notificacionOportunidadEliminada(job);
});

notificationQueue.process(CAMBIO_ESTATUS, (job) => {
  return notificationService.notificacionCambioEstatusOportunidad(job);
});

notificationQueue.on("stalled", function (job) {
  console.log("stalled job, restarting it again!", job.queue.name, job.data);
});

module.exports = notificationQueue;
