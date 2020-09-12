const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const estadosRoutes = require("./routes/estados");
const cidadesRoutes = require("./routes/cidades");
const dbconfig = require("./dbconfig");

const app = express();

mongoose
  .connect(dbconfig.dbconn, dbconfig.options)
  .then(() => {
    console.log("Conectado ao banco de dados!");
  })
  .catch((err) => {
    console.error("Erro ao conectar com o banco de dados!", err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/estados", estadosRoutes);
app.use("/api/cidades", cidadesRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
