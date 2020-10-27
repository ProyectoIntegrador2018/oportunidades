const express = require("express");
const adminController = require("../controllers/AdminController");
const adminMiddleware = require("../middleware/Admin");

const router = express.Router();

/**
 * Route to create a user of type "socio"
 * @param {Object} req contains the email and the password in its body.
 * @param {Object} res response
 */
router.post("/create-socio", adminMiddleware, (req, res) => {
   adminController
      .createSocio(req.body)
      .then((user) => {
         return res.send({
            success: 1,
            user,
         });
      })
      .catch((error) => {
         console.log(error);
         return res.status(401).send({ error });
      });
});

router.get("/get-socios", adminMiddleware, (req, res) => {
   adminController
      .getSocios()
      .then((users) => {
         return res.send({
            success: 1,
            users,
         });
      })
      .catch((error) => {
         return res.status(401).send({ error });
      });
});

router
   .route("/socio/:id")
   .get(adminMiddleware, (req, res) => {
      adminController
         .getSocio(req.params.id)
         .then((user) => {
            return res.send({ user });
         })
         .catch((error) => {
            return res.status(401).send({ error });
         });
   })
   .delete(adminMiddleware, (req, res) => {
      adminController
         .deleteSocio(req.params.id)
         .then((user) => {
            return res.send({ user });
         })
         .catch((error) => {
            return res.status(401).send({ error });
         });
   })
   .patch(adminMiddleware, (req, res) => {
      const updates = Object.keys(req.body);
      const allowedUpdates = ["name", "email", "password", "empresa"];
      const isValidUpdate = updates.every((update) =>
         allowedUpdates.includes(update)
      );
      if (!isValidUpdate) {
         return res.status(401).send({
            error: "Invalid updates.",
         });
      }
      adminController
         .updateSocio(req.params.id, req.body)
         .then((user) => {
            return res.send({ user });
         })
         .catch((error) => {
            return res.status(401).send({ error });
         });
   });

/**
 * Route to test middleware for admin users
 * @param {Object} req request
 * @param {Object} res response
 */
router.get("/ping", adminMiddleware, (req, res) => {
   return res.send({ info: "ping is working for authorized user" });
});

module.exports = router;
