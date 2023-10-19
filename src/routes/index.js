import { Router } from "express";
import { CalendarController } from "../controllers/calendar.controller.js";
import * as calendarFacade from "../facades/calendarFacade.js";

const router = Router();

const controller = new CalendarController();

router.post("/createdEvent", controller.createdEvent);

router.post("/deleteEvent", controller.deleteEvent);

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

router.get("/getEventConfirmed/:range?", controller.getEventInfo);

router.get("/getAvailableTimes/:range?", controller.getAvailableTimes);

export default router;
