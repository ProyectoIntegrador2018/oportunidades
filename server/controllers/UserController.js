const User = require("../models/User");
let userController = {};

userController.login = (email, password) => {
   return new Promise((resolve, reject) => {
      User.findByCredentials(email, password)
         .then((user) => {
            user
               .generateToken()
               .then((token) => {
                  return resolve({ user, token });
               })
               .catch((error) => {
                  return reject({ error });
               });
         })
         .catch((error) => {
            return reject({ error });
         });
   });
};

userController.logout = (req) => {
   return new Promise((resolve, reject) => {
      req.user.tokens = req.user.tokens.filter((token) => {
         return token.token !== req.token;
      });

      req.user
         .save()
         .then(() => {
            return resolve();
         })
         .catch((error) => {
            return reject(error);
         });
   });
};

userController.createUser = (rawUser) => {
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

module.exports = userController;
