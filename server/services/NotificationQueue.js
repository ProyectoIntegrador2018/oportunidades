const Queue = require("bull");
const redisConfig = require("../config/redisConfig");
const {
  NUEVA_OPORTUNIDAD,
  OPORTUNIDAD_ELIMINADA,CAMBIO_ESTATUS,
  NUEVO_EVENTO,
} = require("../utils/NotificationTypes");
const notificationService = require("../services/NotificationService");

const notificationQueue = new Queue("notification-queue", { redisConfig });

notificationQueue.process(NUEVA_OPORTUNIDAD, (job) => {
  return notificationService.notificacionNuevaOportunidad(job);
});

notificationQueue.process(OPORTUNIDAD_ELIMINADA, (job) => {
  return notificationService.notificacionOportunidadEliminada(job);
});

notificationQueue.process(CAMBIO_ESTATUS, (job) => {
  return notificationService.notificacionCambioEstatusOportunidad(job);
});

notificationQueue.process(NUEVO_EVENTO, (job) => {
  return notificationService.notificacionNuevoEvento(job);
})

notificationQueue.on('stalled', function(job){
  console.log('stalled job, restarting it again!', job.queue.name, job.data);
});

module.exports = notificationQueue;
