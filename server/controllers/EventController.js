const Event = require("../models/Event");
const User = require("../models/User");
const Participacion = require("../models/Participaciones");
const {
  NUEVO_EVENTO,
  CAMBIO_EVENTO,
  EVENTO_ELIMINADO,
} = require("../utils/NotificationTypes");
const notificationQueue = require("../services/NotificationQueue");
let eventController = {};

const ERR_EVENT_DATE_UNAVAILABLE = "Event date is unavailable";
eventController.ERR_EVENT_DATE_UNAVAILABLE = ERR_EVENT_DATE_UNAVAILABLE;

eventController.getUserEvents = (userId) => {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .then((user) => {
        user
          .retrieveEvents()
          .then((events) => {
            resolve(events);
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

eventController.createEvent = (rawEvent) => {
  return new Promise((resolve, reject) => {
    let newEvent = new Event(rawEvent);

    overlappingEventExists(newEvent.date)
      .then((overlapExists) => {
        // If an overlapping event is found, abort event creation
        if (overlapExists) {
          return reject(ERR_EVENT_DATE_UNAVAILABLE);
        } else {
          newEvent
            .save()
            .then(() => {
              notificationQueue.add(NUEVO_EVENTO, { newEvent });
            })
            .then(() => {
              resolve(newEvent);
            })
            .catch((err) => { reject(err) });
        }
      })
      .catch((err) => { reject(err) });
  });
};

eventController.assignToUsers = (
  opportunityId,
  eventId,
  evento,
  oppOwnerId
) => {
  return new Promise((resolve, reject) => {
    let involvedUsersIds = [oppOwnerId];
    Participacion.find({ rfpInvolucrado: opportunityId })
      .then((participaciones) => {
        participaciones.map((participacion) => {
          involvedUsersIds.push(participacion.socioInvolucrado);
        });
        User.find({ _id: { $in: involvedUsersIds } })
          .then((involvedUsers) => {
            let emailsList = [];
            involvedUsers.map((involvedUser) => {
              emailsList.push(involvedUser.email);
              involvedUser.addEvent(eventId);
            });
            resolve(involvedUsers);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

eventController.deleteUserFromEvent = (userId, eventId) => {
  return new Promise((resolve, reject) => {
    User.update({ _id: userId }, { $pull: { events: eventId } })
      .then((user) => {
        resolve(user);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

eventController.editEvent = (eventId, updates) => {
  return new Promise((resolve, reject) => {
    const updatedDate = new Date(updates.date);

    overlappingEventExists(updatedDate)
      .then((overlapExists) => {
        // If an overlapping event is found, abort event update
        if (overlapExists) {
          return reject(ERR_EVENT_DATE_UNAVAILABLE);
        } else {
          Event.findByIdAndUpdate(eventId, updates)
            .then((eventUpdated) => {
              // eventUpdated contains the data of the event before the update operation was performed
              notificationQueue.add(CAMBIO_EVENTO, { eventUpdated });
              resolve(eventUpdated);
            })
            .catch((err) => { reject(err) });
        }
      })
      .catch((err) => { reject(err) });
  });
};

eventController.deleteEvent = (eventId) => {
  return new Promise((resolve, reject) => {
    Event.findByIdAndDelete(eventId)
      .then((deletedEvent) => {
        notificationQueue.add(EVENTO_ELIMINADO, { deletedEvent });
      })
      .then((deletedEvent) => {
        resolve(deletedEvent);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

eventController.getRFPEvents = (rfpId) => {
  return new Promise((resolve, reject) => {
    Event.find({ rfp: rfpId })
      .then((events) => {
        resolve(events);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

eventController.addUserToEvent = (userId, eventId) => {
  return new Promise((resolve, reject) => {
    User.update({ _id: userId }, { $push: { events: eventId } })
      .then((update) => {
        resolve(update);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

eventController.getAllEvents = () => {
  return new Promise((resolve, reject) => {
    Event.find({})
      .then((events) => {
        resolve(events);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

eventController.getOccupiedEventTimesFromDate = (eventDateISOString, eventId=null) => {
  return new Promise((resolve, reject) => {
    const oneHourBeforeEventDate = addMinutesToDate(new Date(eventDateISOString), -60);
    const dbQuery = {
      date: { $gte: oneHourBeforeEventDate },
    };
    if (eventId) {
      dbQuery._id = { $ne: eventId };
    }

    Event.find(dbQuery, "date")
      .then((events) => {
        const occupiedTimes = [];

        events.forEach((event) => {
          const date = event.date;
          // Events last 1:30 hrs, adds timeslots that would cause overlapping to occupiedTimes
          for (i = -60; i <= 60; i += 30) {
            const dateToBeAdded = addMinutesToDate(date, i).toISOString();
            if (!occupiedTimes.includes(dateToBeAdded)) {
              occupiedTimes.push(dateToBeAdded);
            }
          }
        });

        resolve(occupiedTimes);
      })
      .catch((err) => { reject(err) });
  });
};

/**
 * Function to check if a given date overlaps with another event
 * @param {Date} eventDate 
 * @returns {boolean} True if overlap exists, false otherwise
 */
function overlappingEventExists(eventDate) {
  return new Promise((resolve, reject) => {
    const oneHourBeforeEventDate = addMinutesToDate(eventDate, -60);
    const oneHourAfterEventDate = addMinutesToDate(eventDate, 60);

    // Check if there are no events with date that overlaps with newEvent, 
    // considering event duration is 1hr 30 min & event dates can be every 30 min
    Event.find({ date: { $gte: oneHourBeforeEventDate, $lte: oneHourAfterEventDate } }, "date")
      .then((overlappingEvents) => {
        resolve(overlappingEvents.length > 0);
      })
      .catch((err) => { reject(err) });
  });
}

function addMinutesToDate(date, minutes) {
  // Date is set in miliseconds, 1 minute is 60,000 ms
  return new Date(date.getTime() + minutes * 60000);
}

module.exports = eventController;
