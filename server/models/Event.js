const mongoose = require("mongoose");

const schema = new mongoose.Schema({
   name: {
      type: String,
   },
   date: {
      type: Date,
   },
   hour: {
      type: Number,
      validate(value) {
         if (value < 0 && value > 23) {
            throw new Error("Invalid hour");
         }
      },
   },
   minute: {
      type: Number,
      validate(value) {
         if (value < 0 && value > 59) {
            throw new Error("Invalid minute");
         }
      },
   },
   link: {
      type: String,
   },
   rfp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RFP",
   },
});

const Event = mongoose.model("Event", schema);

module.exports = Event;
