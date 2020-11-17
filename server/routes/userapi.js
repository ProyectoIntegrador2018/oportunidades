const express = require("express");
const userMiddleware = require("../middleware/User");
const userController = require("../controllers/UserController");

const router = express.Router();

/**
 * Route to login a user
 * @param {Object} req contains the email and the password in its body.
 * @param {Object} res response
 */

router.post("/login", (req, res) => {
   let email = req.body.email;
   let password = req.body.password;
   userController
      .login(email, password)
      .then((response) => {
         return res.send(response);
      })
      .catch((error) => {
         return res.status(401).send(error);
      });
});

/**
 * Route to login a user
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user.
 * @param {Object} req contains the user making the request
 * @param {Object} res response
 */

router.post("/logout", userMiddleware, (req, res) => {
   userController
      .logout(req)
      .then(() => {
         return res.send();
      })
      .catch((error) => {
         return res.status(500).send({ error });
      });
});

/**
 * Route to create a client user.
 * @param {Object} req contains the user info
 * @param {Object} res response for the request
 */
router.post("/create-client-user", (req, res) => {
   userController
      .createUser(req.body)
      .then((user) => {
         return res.send({
            success: 1,
            user: user,
         });
      })
      .catch((error) => {
         console.log("error", error);
         return res.status(401).send({ error });
      });
});

/**
 * Route to get a socio by ID
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req
 * @param {Object} res response for the request
 */
router.get("/get-socio/:id", userMiddleware, (req, res) => {
    userController
       .getSocioInfo(req.params.id)
       .then((user) => {
          return res.send({ user });
       })
       .catch((error) => {
          return res.status(401).send({ error });
       });
});

// Routes for getting and editing the profile for the user who's making the request.
router
   .route("/")
   .get(userMiddleware, (req, res) => {
      userController
         .getMyProfile(req.user._id)
         .then((user) => {
            return res.send({ user });
         })
         .catch((error) => {
            return res.status(401).send({ error });
         });
   })
   .patch(userMiddleware, (req, res) => {
      const updates = Object.keys(req.body);
      const allowedUpdates = [
         "name",
         "email",
         "telefono",
         "empresa",
         "password",
      ];
      const isValidUpdate = updates.every((update) =>
         allowedUpdates.includes(update)
      );
      if (!isValidUpdate) {
         return res.status(401).send({
            error: "invalid update fields",
            success: 0,
         });
      }
      userController
         .updateMyProfile(req.user._id, req.body)
         .then((user) => {
            return res.send({
               success: 1,
               user,
            });
         })
         .catch((error) => {
            return res.status(401).send({
               success: 0,
               error,
            });
         });
   });

router.get("/ping", userMiddleware, (req, res) => {
   return res.send({ info: "ping is working for authorized user" });
});

module.exports = router;
