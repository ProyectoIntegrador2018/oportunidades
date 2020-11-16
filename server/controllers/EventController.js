const Event = require("../models/Event");
const User = require("../models/User");
const Participacion = require("../models/Participaciones");
let eventController = {};

eventController.getUserEvents = (userId) => {
   return new Promise((resolve, reject) => {
      User.findById(userId)
         .then((user) => {
            resolve(user.retrieveEvents);
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
         .then(() => {
            resolve(newEvent);
         })
         .catch((err) => {
            reject(err);
         });
   });
};

eventController.assignToUsers = (opportunityId, eventId) => {
   return new Promise((resolve, reject) => {
      let involvedUsersIds = []
      Participacion.find( {rfpInvolucrado: opportunityId} )
      .then(participaciones => {
         participaciones.map(participacion => {
            involvedUsersIds.push(participacion.socioInvolucrado)
         });
         User.find({ '_id': { $in: involvedUsersIds } })
         .then(involvedUsers => {
            involvedUsers.map(involvedUser => {
               involvedUser.addEvent(eventId)
            })
         }).catch(err => {
            console.log(err);
            reject(err)
         })
      }).catch(err => {
         reject(err);
      })
   })
}
module.exports = eventController;
