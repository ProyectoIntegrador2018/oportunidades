const express = require("express");
const userMiddleware = require("../middleware/User");
const adminMiddleware = require("../middleware/Admin");
const eventController = require("../controllers/EventController");

const router = express.Router();

router.get("/get-user-events", userMiddleware, (req, res) => {
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
      eventController.assignToUsers(
        req.body.rfp,
        newEvent._id,
        newEvent,
        req.user._id
      );
    })
    .then((usersIds) => {
      return res.send({
        message: "Event created successfully",
      });
    })
    .catch((err) => {
      if (err === eventController.ERR_EVENT_DATE_UNAVAILABLE) {
        // 409. Conflict
        return res.status(409).send({ err });
      } else {
        // 401. Unauthorized
        return res.status(401).send({ err });
      }
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

router.get("/get-rfp-events/:id", userMiddleware, (req, res) => {
  eventController
    .getRFPEvents(req.params.id)
    .then((events) => {
      return res.send({ events });
    })
    .catch((err) => {
      return res.status(401).send({ err });
    });
});

router.get("/get-occupied-event-times/:date", userMiddleware, (req, res) => {
  eventController
    .getOccupiedEventTimesFromDate(req.params.date)
    .then((occupiedTimes) => {
      return res.send({ occupiedTimes });
    })
    .catch((err) => {
      return res.status(401).send({ err });
    });
});

router.patch("/:id", userMiddleware, (req, res) => {
  const updates = req.body;
  const allowedUpdates = ["name", "date", "link"];
  const isValidUpdate = Object.keys(updates).every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(401).send({
      error: "invalid update fields",
      success: 0,
    });
  }
  eventController
    .editEvent(req.params.id, updates)
    .then((updatedEvent) => {
      return res.send({ updatedEvent });
    })
    .catch((err) => {
      return res.status(401).send({ err });
    });
});

router.delete("/:id", userMiddleware, (req, res) => {
  eventController
    .deleteEvent(req.params.id)
    .then((deletedEvent) => {
      return res.send({ deletedEvent });
    })
    .catch((err) => {
      return res.status(401).send({ err });
    });
});

router.get("/all-events", adminMiddleware, (req, res) => {
  eventController
    .getAllEvents()
    .then((events) => {
      return res.send({ events });
    })
    .catch((err) => {
      return res.status(401).send({ err });
    });
});

module.exports = router;
