const express = require("express");
const router = express.Router();

const Estado = require("../models/estado");
const Cidade = require("../models/cidade");

router.post("", (req, res) => {
  const estado = new Estado({
    nome: req.body.nome,
    abreviacao: req.body.abreviacao,
    data_criacao: new Date(),
    data_ultima_alteracao: new Date(),
  });
  estado
    .save()
    .then((estadoCriado) => {
      res.status(201).json({
        message: "Estado criado com sucesso!",
        estadoId: estadoCriado._id,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Opps! Erro ao criar novo estado!",
      });
    });
});

router.put("/:id", (req, res) => {
  const estado = new Estado({
    _id: req.body.id,
    nome: req.body.nome,
    abreviacao: req.body.abreviacao,
    data_ultima_alteracao: new Date(),
  });
  Estado.updateOne({ _id: req.params.id }, estado)
    .then(() => {
      res.status(200).json({ message: "Estado atualizado com sucesso!" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Opps! Erro ao atualizar estado!",
      });
    });
});

router.get("", (req, res) => {
  Estado.find()
    .then((estados) => {
      res.status(200).json({
        message: "Estados listados com sucesso!",
        estados,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Opps! Erro ao obter lista de estados!",
      });
    });
});

router.get("/:id", (req, res) => {
  Estado.findById(req.params.id)
    .then((estado) => {
      if (estado) {
        res.status(200).json(estado);
      } else {
        res.status(404).json({ message: "Estado não encontrado!" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Opps! Não foi possível obter dados do estado!",
      });
    });
});

router.delete("/:id", (req, res) => {
  Cidade.deleteMany({ estadoId: req.params.id })
    .then((status) => {
      if (status.ok) {
        console.log("Cidades removidas com sucesso!");

        Estado.deleteOne({ _id: req.params.id })
          .then((result) => {
            if (result.ok) {
              console.log("Estado removido com sucesso!");
              res.status(200).json({ message: "Estado removido com sucesso!" });
            } else {
              res.status(500).json({
                message: "Opps! Erro ao remover o estado!",
              });
            }
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({
              message: "Opps! Erro ao remover o estado!",
            });
          });
      }
    })
    .catch((err) => {
      console.error("Oops! Algo errado!", err);
      res.status(500).json({
        message: "Opps! Erro ao remover as cidades do estado selecionado!",
      });
    });
});

module.exports = router;
