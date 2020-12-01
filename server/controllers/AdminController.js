const User = require("../models/User");
let adminController = {};

/**
 * @param {Object} rawUser contains the user info to create
 */
adminController.createSocio = (rawUser) => {
   return new Promise((resolve, reject) => {
      const user = new User(rawUser);
      user
         .save()
         .then(() => {
            resolve(user);
         })
         .catch((error) => {
            reject(error);
         });
   });
};

adminController.getSocios = () => {
   return new Promise((resolve, reject) => {
      User.find({userType: "socio"})
         .then((users) => {
            resolve(users);
         })
         .catch((error) => {
            reject(error);
         });
   });
};

adminController.getSocio = (id) => {
   return new Promise((resolve, reject) => {
      User.findById(id)
         .then((user) => {
            resolve(user);
         })
         .catch((error) => {
            reject(error);
         });
   });
};

adminController.deleteSocio = (id) => {
   return new Promise((resolve, reject) => {
      User.findByIdAndDelete(id)
         .then((user) => {
            resolve(user);
         })
         .catch((error) => {
            reject(error);
         });
   });
};

adminController.updateSocio = (id, updates) => {
   return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(id, updates)
         .then((user) => {
            resolve(user);
         })
         .catch((error) => {
            reject(error);
         });
   });
};

function generatePassword() {
   var length = 8,
      charset =
         "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
   for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
   }
   return retVal;
}

module.exports = adminController;
