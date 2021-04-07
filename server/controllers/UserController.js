const bcrypt = require("bcrypt");
const User = require("../models/User");
let userController = {};

/**
 * @param {String} email user email
 * @param {String} password user password
 */
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

/**
 *
 * @param {Object} req request
 */
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

/**
 * Function for creating a new user
 * @param {Object} rawUser object containing the user info to create
 */
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

/**
 * Function for getting the user's profile by Id.
 * @param {String} id user's id
 */
userController.getMyProfile = (id) => {
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

/**
 * Function for updating a user's profile by Id.
 * @param {String} id user's id.
 * @param {Object} updates object containing the fields to be updated.
 */
userController.updateMyProfile = (id, updates) => {
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

userController.changePassword = (id, password) => {
  return new Promise((resolve, reject) => {
    bcrypt
      .hash(password, 8)
      .then(function (hash) {
        User.findByIdAndUpdate(id, { password: hash })
          .then((user) => {
            resolve(user);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

/**
 * Function for getting the user's info by Id.
 * @param {String} id user's id
 */
userController.getSocioInfo = (id) => {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then((user) => {
        return resolve(user);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

/**
 * Get user notifications
 * @param {String} id user's id
 */
userController.getNotifications = (id) => {
  return new Promise((resolve, reject) => {
    User.findById(id, "notificaciones")
      .populate({
        path: "notificaciones",
        populate: {
          path: "notificacion",
          model: "Notificacion",
          populate: {
            path: "detalles",
            model: "DetallesNotificacion",
            populate: [
              {
                path: "participante",
                model: "User",
                select: "name",
              },
              {
                path: "rfp",
                model: "RFP",
              },
            ],
          },
        },
      })
      .then((notificaciones) => {
        return resolve(notificaciones);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

module.exports = userController;
