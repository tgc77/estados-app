const mongoose = require("mongoose");

const cidadeSchema = mongoose.Schema({
  nome: { type: String, required: true },
  estadoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Estado",
    required: true,
  },
  data_criacao: { type: Date },
  data_ultima_alteracao: { type: Date },
});

module.exports = mongoose.model("Cidade", cidadeSchema);
