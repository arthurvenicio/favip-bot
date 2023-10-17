const express = require("express");
const router = express.Router();
const calendarFacade = require("../facades/calendarFacade");

router.post("/createdEvent", async (req, res) => {
  try {
    const evento = req.body;
    const novoEvento = await calendarFacade.createdEvent(evento);
    res.status(201).json(novoEvento);
  } catch (error) {
    console.error("Erro ao criar o evento:", error);
    res.status(500).json({ erro: "Erro ao criar o evento" });
  }
});

router.get("/listEvent", async (req, res) => {
  try {
    const lista = await calendarFacade.listeEvent();
    res.status(200).json(lista);
  } catch (error) {
    console.error("Erro ao criar o evento:", error);
    res.status(500).json({ erro: "Erro ao criar o evento" });
  }
});

router.get("/listEvent/:date", async (req, res) => {
  try {
    const date = req.params.date;
    const lista = await calendarFacade.listeEventFromDate(date);
    res.status(200).json(lista);
  } catch (error) {
    console.error("Erro ao criar o evento:", error);
    res.status(500).json({ erro: "Erro ao criar o evento" });
  }
});

router.get("/getEventConfirmed/:range?", async (req, res) => {
  try {
    const date = req.params.range;
    const availableTimes = await calendarFacade.getEventConfirmed(date);
    res.status(200).json(availableTimes);
  } catch (error) {
    console.error("Erro ao obter horários:", error);
    res.status(500).json({ erro: "Erro ao obter horários" });
  }
});

router.get("/getAvailableTimes/:range?", async (req, res) => {
  try {
    const date = req.params.range;
    const availableTimes = await calendarFacade.getAvailableTimes(date);
    res.status(200).json(availableTimes);
  } catch (error) {
    console.error("Erro ao obter horários:", error);
    res.status(500).json({ erro: "Erro ao obter horários" });
  }
});

module.exports = router;
