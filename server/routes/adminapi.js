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
         return res.status(401).send({ error });
      });
});

/**
 * Route to test middleware for admin users
 * @param {Object} req request
 * @param {Object} res response
 */
router.get("/ping", adminMiddleware, (req, res) => {
   return res.send({info: "ping is working for authorized user"})
});

module.exports = router;