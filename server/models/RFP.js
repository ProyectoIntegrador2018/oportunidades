const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      position: {
         type: String,
         required: true,
      },
      phone: {
         type: Number,
         required: true,
      },
      email: {
         type: String,
         required: true,
      },
      category: {
         type: String,
         required: true,
      },
      meeting: {
         type: Date,
         required: true,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
   }
);

const miRFP = mongoose.model('RFP', schema)

module.exports = miRFP
