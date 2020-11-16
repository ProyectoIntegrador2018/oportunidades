const express = require("express");
const userMiddleware = require("../middleware/User");
const eventController = require("../controllers/EventController");

const router = express.Router();

router.get("/get-events", userMiddleware, (req, res) => {
   eventController
      .getUserEvents(req.user._id)
      .then((events) => {
         return res.send({ events });
      })
      .catch((err) => {
         return res.status(401).send({ err });
      });
});

router.post("/", userMiddleware, (req, res) => {
   eventController
      .createEvent(req.body)
      .then((newEvent) => {
         eventController.assignToUsers(req.body.rfp, newEvent._id);
      }).then(() => {
         return res.send({
            message: "Event created successfully"
         })
      })
      .catch((err) => {
         return res.status(401).send({ err });
      });
});

module.exports = router;
