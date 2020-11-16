const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Event = require("./Event");

const schema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         validate(value) {
            if (!validator.isEmail(value)) {
               throw new Error("Email invalido");
            }
         },
      },
      telefono: {
         type: String
      },
      empresa: {
         type: String
      },
      password: {
         type: String,
         required: true,
         minlength: 8,
         trim: true,
      },
      tokens: [
         {
            token: {
               type: String,
               required: true,
            },
         },
      ],
      isAdmin: {
         type: Boolean,
         required: true,
         default: false,
      },
      userType: {
         type: String,
         required: true,
         validate(value) {
            const allowedValues = ["cliente", "socio", "admin"];
            if (!allowedValues.includes(value)) {
               throw new Error("Tipo de usuario no valido");
            }
         },
      },
      events: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: "Event"
      }]
   },
   {
      toObject: {
         virtuals: true,
      },
      toJSON: {
         virtuals: true,
      },
   }
);

/**
 * Generates token for login
 */
schema.methods.generateToken = function () {
   const user = this;
   const token = jwt.sign(
      { _id: user._id.toString(), email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_KEY,
      {
         expiresIn: "7 days",
      }
   );
   user.tokens = user.tokens.concat({ token });
   return new Promise((resolve, reject) => {
      user
         .save()
         .then((user) => {
            return resolve(token);
         })
         .catch((error) => {
            return reject(error);
         });
   });
};

schema.methods.addEvent = function(eventId) {
   const user = this
   this.events.push(eventId);
   user.save();
}

schema.methods.retrieveEvents = function() {
   const user = this;
   let userEvents = user.events;
   return new Promise((resolve, reject) => {
      Event.find({ '_id': { $in: userEvents } })
      .then(events => {
         resolve(events)
      }).catch(err => {
         reject(err)
      })
   })
}

/**
 * Gets user that matches email and validates password
 * @param {String} email 
 * @param {String} password 
 */
schema.statics.findByCredentials = (email, password) => {
   return new Promise(function (resolve, reject) {
      User.findOne({ email }).then(function (user) {
         if (!user) {
            return reject("User does not exist");
         }
         bcrypt
            .compare(password, user.password)
            .then(function (match) {
               if (match) {
                  return resolve(user);
               } else {
                  return reject("Wrong password!");
               }
            })
            .catch(function (error) {
               return reject("Wrong password!");
            });
      });
   });
};

/**
 * Gets user by email only
 * @param {String} email 
 */
schema.statics.findByEmail = function(email) {
   return this.findOne({ email }).exec();
}

/**
 * Hash password before saving user
 */
schema.pre("save", function (next) {
   const user = this;
   if (user.isModified("password")) {
      bcrypt
         .hash(user.password, 8)
         .then(function (hash) {
            user.password = hash;
            next();
         })
         .catch(function (error) {
            return next(error);
         });
   } else {
      next();
   }
});

const User = mongoose.model('User', schema)

module.exports = User