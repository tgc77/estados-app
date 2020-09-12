const mongoose = require("mongoose");

const estadoSchema = mongoose.Schema({
  nome: { type: String, required: true },
  abreviacao: { type: String, required: true },
  data_criacao: { type: Date },
  data_ultima_alteracao: { type: Date },
});

module.exports = mongoose.model("Estado", estadoSchema);
