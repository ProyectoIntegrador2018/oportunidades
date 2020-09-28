const express = require("express");
const userMiddleware = require("../middleware/User");
const rfpController = require("../controllers/rfpController");

const router = express.Router();

/**
 * Route to create an RFP by a client
 * @implements {userMiddleWare} Function to check if the request is sent by a logged user
 * @param {Object} req contains the RFP's data in its body.
 * @param {Object} res response for the request
 */

router.post("/create-rfp", userMiddleware, (req, res) => {
   let name = req.body.name;
   let position = req.body.position;
   let phone = req.body.phone;
   let email = req.body.email;
   let category = req.body.category;
   let meeting = req.body.meeting;
   rfpController
      .createrfp(req.body)
      .then((rfp) => {
         return res.send({
           success: 1,
           rfp: rfp,
         });
      })
      .catch((error) => {
         console.log("error", error)
         return res.status(400).send({ error });
      });
});

router.get("/ping", userMiddleware, (req, res) => {
   return res.send({info: "ping is working for authorized user"})
});

module.exports = router;
