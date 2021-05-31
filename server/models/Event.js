const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  date: {
    type: Date,
  },
  link: {
    type: String,
  },
  rfp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RFP",
  },
});

schema.statics.getEventsFromLastDay = function () {
  const today = new Date();
  const yesterday = new Date().setDate(today.getDate() - 1);
  return new Promise((resolve, reject) => {
    this.find({ date: { $gte: yesterday, $lt: today } })
      .then((events) => resolve(events))
      .catch((error) => reject(error));
  });
};

schema.statics.deleteManyEvents = function (eventIds) {
  return new Promise((resolve, reject) => {
    this.deleteMany(
      {
        _id: {
          $in: eventIds,
        },
      },
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const Event = mongoose.model("Event", schema);

module.exports = Event;
