const EventModel = require("../models/Event");
const cron = require("node-cron");
const eventScheduler = {};

eventScheduler.checkForEventStatusUpdate = () => {
  cron.schedule("* * * * *", () => {
    EventModel.getEventsFromLastDay()
      .then((events) => {
        console.log(events);
      })
      .catch((error) => console.log(error));
  });
};

module.exports = eventScheduler;
