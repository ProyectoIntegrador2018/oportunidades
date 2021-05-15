const Queue = require("bull");
const { port, host, db, url } = require("../config/redisConfig");
const {
  NUEVA_OPORTUNIDAD,
  OPORTUNIDAD_ELIMINADA,
  NUEVA_PARTICIPACION,
  CAMBIO_ESTATUS_PARTICIPACION,
  CAMBIO_ESTATUS,
  NUEVO_EVENTO,
  CAMBIO_EVENTO,
  EVENTO_ELIMINADO,
  OPORTUNIDAD_CERRADA_NO_PARTICIPACIONES,
} = require("../utils/NotificationTypes");
const notificationService = require("../services/NotificationService");

let notificationQueue;
if (process.env.REDIS_ENV === "production") {
  notificationQueue = new Queue("notification-queue", url);
} else {
  notificationQueue = new Queue("notification-queue", {
    redis: { port: port, host: host },
  });
}
notificationQueue.LOCK_RENEW_TIME = 60 * 1000;

notificationQueue.process(NUEVA_OPORTUNIDAD, (job) => {
  return notificationService.notificacionNuevaOportunidad(job);
});

notificationQueue.process(OPORTUNIDAD_ELIMINADA, (job) => {
  return notificationService.notificacionOportunidadEliminada(job);
});

notificationQueue.process(NUEVA_PARTICIPACION, (job) => {
  return notificationService.notificacionNuevaParticipacion(job);
});

notificationQueue.process(CAMBIO_ESTATUS_PARTICIPACION, (job) => {
  return notificationService.notificacionCambioEstatusParticipante(job);
});

notificationQueue.process(CAMBIO_ESTATUS, (job) => {
  return notificationService.notificacionCambioEstatusOportunidad(job);
});

notificationQueue.process(NUEVO_EVENTO, (job) => {
  return notificationService.notificacionNuevoEvento(job);
});

notificationQueue.process(CAMBIO_EVENTO, (job) => {
  return notificationService.notificacionCambioEvento(job);
});

notificationQueue.process(EVENTO_ELIMINADO, (job) => {
  return notificationService.notificacionEventoEliminado(job);
});

notificationQueue.process(OPORTUNIDAD_CERRADA_NO_PARTICIPACIONES, (job) => {
  return notificationService.notificacionOportunidadCerradaNoParticipaciones(
    job
  );
});

notificationQueue.on("stalled", function (job) {
  console.log("stalled job, restarting it again!", job.queue.name, job.data);
});

module.exports = notificationQueue;
