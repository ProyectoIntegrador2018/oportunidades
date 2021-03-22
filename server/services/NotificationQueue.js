const Queue = require("bull");
const redisConfig = require("../config/redisConfig");
const { NUEVA_OPORTUNIDAD } = require("../utils/NotificationTypes");
const notificationService = require("../services/NotificationService");

const notificationQueue = new Queue("notification-queue", { redisConfig });

notificationQueue.process(NUEVA_OPORTUNIDAD, (job) => {
  return notificationService.notificacionNuevaOportunidad(job);
});

module.exports = notificationQueue;
