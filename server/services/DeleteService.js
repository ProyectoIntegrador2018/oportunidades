const UserModel = require("../models/User");
const RfpModel = require("../models/RFP");
const EventModel = require("../models/Event");
const NotificacionModel = require("../models/Notificacion");
const ParticipacionModel = require("../models/Participaciones");
const UsuarioNotificacionModel = require("../models/UsuarioNotificacion");
const DetallesNotificacionModel = require("../models/DetallesNotificacion");

const deleteService = {};
const SUCCESS_RESP = { success: 1 };

deleteService.deleteNotificacionesRfp = (rfpId) => {
  return new Promise((resolve, reject) => {
    DetallesNotificacionModel.findDetallesNotificacionByRfpId(rfpId)
      .then((detallesNotificaciones) => {
        const detallesNotifIds = detallesNotificaciones.map((detalles) => {
          return detalles._id;
        });
        return DetallesNotificacionModel.deleteManyDetallesNotificacionByIds(
          detallesNotifIds
        )
          .then((deleteResp) => {
            return detallesNotifIds;
          })
          .catch((error) => {
            reject(error);
          });
      })
      .then((detallesNotifIds) => {
        return NotificacionModel.findNotificacionByDetallesNotifIds(
          detallesNotifIds
        )
          .then((notificaciones) => {
            const notifIds = notificaciones.map((notificaciones) => {
              return notificaciones._id;
            });
            return NotificacionModel.deleteManyNotificacionByIds(notifIds)
              .then((deleteResp) => {
                return notifIds;
              })
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
      })
      .then((notifIds) => {
        return UsuarioNotificacionModel.findUsuarioNotificacionByNotificacionIds(
          notifIds
        )
          .then((usuarioNotificaciones) => {
            return usuarioNotificaciones.map((usuarioNotificacion) => {
              const { user: userId, _id: usuarioNotifId } = usuarioNotificacion;
              UserModel.findById(userId)
                .then((user) => {
                  user.notificaciones.pull({ _id: usuarioNotifId });
                  user.save();
                })
                .catch((error) => reject(error));
              return usuarioNotifId;
            });
          })
          .then((usuarioNotifIds) => {
            UsuarioNotificacionModel.deleteManyUsuarioNotifByIds(
              usuarioNotifIds
            )
              .then((deleteResp) => {
                resolve(SUCCESS_RESP);
              })
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
      })
      .catch((error) => {
        reject(error);
      });
  });
};

deleteService.deleteRfpRelatedData = (job) => {
  const rfpId = job.data.rfpId;
  return new Promise((resolve, reject) => {
    deleteRfpEvents(rfpId)
      .then((resp) => {
        resolve(SUCCESS_RESP);
      })
      .catch((error) => reject(error));
  });
};

const deleteRfpEvents = (rfpId) => {
  return new Promise((resolve, reject) => {
    EventModel.find({ rfp: { $eq: rfpId } })
      .then((events) => {
        const eventIds = events.map((event) => event._id);
        EventModel.deleteManyEvents(eventIds)
          .then((resp) => {
            resolve(success);
          })
          .catch((error) => reject(error));
        resolve(SUCCESS_RESP);
      })
      .catch((error) => reject(error));
  });
};

module.exports = deleteService;
