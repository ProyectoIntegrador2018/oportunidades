const express = require("express");
const userMiddleware = require("../middleware/User");
const eventController = require("../controllers/EventController");

const router = express.Router();

router.get("/get-user-events", userMiddleware, (req, res) => {
   console.log(req.user)
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
         eventController.assignToUsers(req.body.rfp, newEvent._id, newEvent);
      })
      .then((usersIds) => {
         return res.send({
            message: "Event created successfully",
         });
      })
      .catch((err) => {
         return res.status(401).send({ err });
      });
});

router.delete("/remove-from-event/:id", userMiddleware, (req, res) => {
   eventController
      .deleteUserFromEvent(req.user._id, req.params.id)
      .then((msg) => {
         return res.send({ msg });
      })
      .catch((err) => {
         return res.status(401).send({ err });
      });
});

router.post("/add-to-event/:id", userMiddleware, (req, res) => {
   eventController
      .addUserToEvent(req.user._id, req.params.id)
      .then((update) => {
         return res.send(update);
      })
      .catch((err) => {
         return res.status(401).send({ err });
      });
});

module.exports = router;
