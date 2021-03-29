const Queue = require("bull");
const redisConfig = require("../config/redisConfig");
const {
  NUEVA_OPORTUNIDAD,
  OPORTUNIDAD_ELIMINADA,
} = require("../utils/NotificationTypes");
const notificationService = require("../services/NotificationService");

const notificationQueue = new Queue("notification-queue", { redisConfig });
// notificationQueue.LOCK_RENEW_TIME = 60 * 1000;

notificationQueue.process(NUEVA_OPORTUNIDAD, (job) => {
  return notificationService.notificacionNuevaOportunidad(job);
});

notificationQueue.process(OPORTUNIDAD_ELIMINADA, (job) => {
  return notificationService.notificacionOportunidadEliminada(job);
});

notificationQueue.on('stalled', function(job){
  console.log('stalled job, restarting it again!', job.queue.name, job.data);
});

module.exports = notificationQueue;
