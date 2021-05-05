const Queue = require("bull");
const redisConfig = require("../config/redisConfig");
const {
  NUEVA_OPORTUNIDAD,
  NUEVA_PARTICIPACION,
  NUEVO_EVENTO,
  CAMBIO_EVENTO,
  CAMBIO_ESTATUS,
  PARTICIPACION_RECHAZADA,
  PARTICIPACION_GANADOR,
  OPORTUNIDAD_ELIMINADA,
} = require("../utils/NotificationTypes");
const mailService = require("./MailService");

const mailQueue = new Queue("mail-queue", { redisConfig });

mailQueue.process(NUEVA_OPORTUNIDAD, (job) => {
  return mailService.sendEmail(job.data);
});

mailQueue.process(NUEVA_PARTICIPACION, (job) => {
  return mailService.sendEmail(job.data);
});

mailQueue.process(NUEVO_EVENTO, (job) => {
  return mailService.sendEmail(job.data);
});

mailQueue.process(CAMBIO_EVENTO, (job) => {
  return mailService.sendEmail(job.data);
});

mailQueue.process(CAMBIO_ESTATUS, (job) => {
  return mailService.sendEmail(job.data);
});

mailQueue.process(PARTICIPACION_RECHAZADA, (job) => {
  return mailService.sendEmail(job.data);
});

mailQueue.process(PARTICIPACION_GANADOR, (job) => {
  return mailService.sendEmail(job.data);
});

mailQueue.process(OPORTUNIDAD_ELIMINADA, (job) => {
  return mailService.sendEmail(job.data);
});

mailQueue.on("stalled", function (job) {
  console.log("stalled job, restarting it again!", job.queue.name, job.data);
});

module.exports = mailQueue;
