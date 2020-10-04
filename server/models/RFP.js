const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema(
   {
      nombrecliente: {
         type: String,
         required: true,
      },
      posicioncliente: {
         type: String,
         required: true,
      },
      telefono: {
         type: Number,
         required: true,
      },
      email: {
         type: String,
         required: true,
      },
      nombreOportunidad: {
         type: String,
         required: true,
      },
      objetivoOportunidad: {
         type: String,
         required: true,
      },
      fechasRelevantes: {
         type: String,
         required: true,
      },
      descripcionProblematica: {
         type: String,
         required: true,
      },
      descripcionFuncional: {
         type: String,
         required: true,
      },
      requerimientosObligatorios: {
         type: String,
         required: true,
      },
      aprobadaAreaUsuario: {
         type: String,
         required: true,
      },
      aprobadaAreaTI: {
         type: String,
         required: true,
      },
      presupuestoAsignado: {
         type: String,
         required: true,
      },
      comentariosAdicionales: {
         type: String,
         required: true,
      },
      tipoGeneralProyecto: {
         type: String,
         required: true,
      },
      tipoEspecificoProyecto: {
         type: String,
         required: true,
      },
      fechaCita: {
         type: Date,
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
