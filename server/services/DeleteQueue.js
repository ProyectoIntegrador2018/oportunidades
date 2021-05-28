const Queue = require("bull");
const { port, host, db, url } = require("../config/redisConfig");
const { DELETE_RFP } = require("../utils/DeleteTypes");
const deleteService = require("./DeleteService");

let deleteQueue;
if (process.env.REDIS_ENV === "production") {
  deleteQueue = new Queue("delete-queue", url);
} else {
  deleteQueue = new Queue("delete-queue", {
    redis: { port: port, host: host },
  });
}
deleteQueue.LOCK_RENEW_TIME = 60 * 1000;

deleteQueue.process(DELETE_RFP, (job) => {
  return deleteService.deleteRfpRelatedData(job);
});

deleteQueue.on("stalled", function (job) {
  console.log("stalled job, restarting it again!", job.queue.name, job.data);
});

module.exports = deleteQueue;
