const express = require("express");
const router = express.Router();

const Cidade = require("../models/cidade");

router.post("", (req, res) => {
  const cidade = new Cidade({
    nome: req.body.nome,
    estadoId: req.body.estadoId,
    data_criacao: new Date(),
    data_ultima_alteracao: new Date(),
  });
  cidade
    .save()
    .then((cidadeCriada) => {
      res.status(201).json({
        message: "Cidade criada com sucesso!",
        cidadeId: cidadeCriada._id,
      });
    })
    .catch((err) => {
      console.error("Erro ao salvar cidade!", err);
      res.status(500).json({
        message: "Opps! Erro ao salvar cidade!",
      });
    });
});

router.put("/:id", (req, res) => {
  const cidade = new Cidade({
    _id: req.body.id,
    nome: req.body.nome,
    estadoId: req.body.estadoId,
    data_ultima_alteracao: new Date(),
  });
  Cidade.updateOne({ _id: req.params.id }, cidade)
    .then(() => {
      res.status(200).json({ message: "Cidade atualizada com sucesso!" });
    })
    .catch((err) => {
      console.error("Erro ao atualizar cidade!", err);
      res.status(500).json({
        message: "Opps! Erro ao atualizar cidade!",
      });
    });
});

router.get("/:estadoId", (req, res) => {
  Cidade.find({ estadoId: req.params.estadoId })
    .then((cidades) => {
      res.status(200).json({
        message: "Cidades listadas com sucesso!",
        cidades,
      });
    })
    .catch((err) => {
      console.error("Erro ao listar cidades", err);
      res.status(500).json({
        message: "Opps! Erro ao listar cidades!",
      });
    });
});

router.get("/:estadoId/:id", (req, res) => {
  Cidade.findById(req.params.id)
    .then((cidade) => {
      if (cidade) {
        res.status(200).json(cidade);
      } else {
        res.status(404).json({ message: "Cidade não encontrada!" });
      }
    })
    .catch((err) => {
      console.error("Erro ao buscar por cidade!", err);
      res.status(500).json({
        message: "Opps! Erro ao buscar pela cidade!",
      });
    });
});

router.delete("/:id", (req, res) => {
  Cidade.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Cidade excluida com sucesso!" });
    })
    .catch((err) => {
      console.error("Erro ao remover cidade!", err);
      res.status(500).json({
        message: "Opps! Erro ao remover cidade!",
      });
    });
});

module.exports = router;
