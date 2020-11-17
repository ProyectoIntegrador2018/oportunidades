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

const Event = mongoose.model("Event", schema);

module.exports = Event;
