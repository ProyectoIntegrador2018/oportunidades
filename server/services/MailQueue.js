const Queue = require("bull");
const redisConfig = require("../config/redisConfig");
const { NUEVA_OPORTUNIDAD, NUEVA_PARTICIPACION } = require("../utils/NotificationTypes");
const mailService = require("./MailService");

const mailQueue = new Queue("mail-queue", { redisConfig });

mailQueue.process(NUEVA_OPORTUNIDAD, (job) => {
  return mailService.sendEmail(job.data);
});

mailQueue.process(NUEVA_PARTICIPACION, (job) => {
  return mailService.sendEmail(job.data);
});

mailQueue.on("stalled", function (job) {
  console.log("stalled job, restarting it again!", job.queue.name, job.data);
});

module.exports = mailQueue;
