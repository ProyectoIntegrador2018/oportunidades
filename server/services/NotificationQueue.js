const Queue = require("bull");
const redisConfig = require("../config/redisConfig");
const {
  NUEVA_OPORTUNIDAD,
  OPORTUNIDAD_ELIMINADA,
  CAMBIO_ESTATUS,
  NUEVO_EVENTO,
  CAMBIO_EVENTO,
  EVENTO_ELIMINADO,
  NUEVA_PARTICIPACION,
  CAMBIO_ESTATUS_PARTICIPACION,
} = require("../utils/NotificationTypes");
const notificationService = require("../services/NotificationService");

const notificationQueue = new Queue("notification-queue", { redisConfig });

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
})

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

notificationQueue.on("stalled", function (job) {
  console.log("stalled job, restarting it again!", job.queue.name, job.data);
});

module.exports = notificationQueue;
