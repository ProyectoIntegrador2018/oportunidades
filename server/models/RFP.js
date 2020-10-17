const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema(
   {
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
         default: 'Activo',
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
   }
);

const miRFP = mongoose.model('RFP', schema)

module.exports = miRFP
