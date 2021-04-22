const Event = require("../models/Event");
const User = require("../models/User");
const Participacion = require("../models/Participaciones");
let eventController = {};

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
      newEvent
         .save()
         .then((event) => {
            
            resolve(newEvent);
         })
         .catch((err) => {
            reject(err);
         });
   });
};

eventController.assignToUsers = (opportunityId, eventId, evento, oppOwnerId) => {
   return new Promise((resolve, reject) => {
      let involvedUsersIds = [oppOwnerId];
      Participacion.find({ rfpInvolucrado: opportunityId })
         .then((participaciones) => {
            participaciones.map((participacion) => {
               involvedUsersIds.push(participacion.socioInvolucrado);
            });
            User.find({ _id: { $in: involvedUsersIds } })
               .then((involvedUsers) => {
                  let emailsList = []
                  involvedUsers.map((involvedUser) => {
                     emailsList.push(involvedUser.email)
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
      Event.findByIdAndUpdate(eventId, updates)
      .then(eventUpdated => {
         resolve(eventUpdated);
      })
      .catch(err => {
         reject(err);
      })
   })
}

eventController.deleteEvent = (eventId) => {
   return new Promise((resolve, reject) => {
      Event.findByIdAndDelete(eventId)
      .then(deletedEvent => {
         resolve(deletedEvent);
      })
      .catch(err => {
         reject(err);
      })
   })
}

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
      .then(events => {
         resolve(events);
      })
      .catch(err => {
         reject(err);
      })
   })
}

module.exports = eventController;
