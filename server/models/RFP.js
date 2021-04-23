const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
  nombrecliente: {
    type: String,
  },
  posicioncliente: {
    type: String,
  },
  telefono: {
    type: Number,
  },
  email: {
    type: String,
  },
  nombreOportunidad: {
    type: String,
  },
  objetivoOportunidad: {
    type: String,
  },
  fechasRelevantes: {
    type: String,
  },
  descripcionProblematica: {
    type: String,
  },
  descripcionFuncional: {
    type: String,
  },
  requerimientosObligatorios: {
    type: String,
  },
  aprobadaAreaUsuario: {
    type: String,
  },
  aprobadaAreaTI: {
    type: String,
  },
  presupuestoAsignado: {
    type: String,
  },
  comentariosAdicionales: {
    type: String,
  },
  tipoGeneralProyecto: {
    type: String,
  },
  tipoEspecificoProyecto: {
    type: String,
  },
  fechaCita: {
    type: Date,
  },
  estatus: {
    type: String,
    default: "Activo",
  },
  causa: {
    type: String,
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

schema.statics.findRfpById = function (rfpId) {
  return new Promise((resolve, reject) => {
    this.find({ _id: rfpId })
      .then((rfps) => {
        resolve(rfps);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

schema.statics.getCreatedBy = function (rfpId) {
  return new Promise((resolve, reject) => {
    this.findById( rfpId )
      .then((rfp) => {
        const createdBy = rfp.createdBy;
        resolve(createdBy);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

schema.statics.getNombreOportunidad = function (rfpId) {
  return new Promise((resolve, reject) => {
    this.findById( rfpId )
      .then((rfp) => {
        const nombreOportunidad = rfp.nombreOportunidad;
        resolve(nombreOportunidad);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const miRFP = mongoose.model("RFP", schema);

module.exports = miRFP;
