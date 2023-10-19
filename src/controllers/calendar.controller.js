import {
  createdEvent,
  deleteEvent,
  getAvailableTimes,
  getEventConfirmed,
} from "../facades/calendarFacade.js";

export class CalendarController {
  constructor() {}

  async getEventInfo(req, res) {
    try {
      const { range } = req.params;
      const availableTimes = await getEventConfirmed(range);
      return res.send(availableTimes);
    } catch (error) {
      console.error("Erro ao obter eventos:", error);
      return res.status(500).send({ erro: "Erro ao obter horários" });
    }
  }

  async getAvailableTimes(req, res) {
    try {
      const date = req.params.range;
      const availableTimes = await getAvailableTimes(date);
      res.status(200).json(availableTimes);
    } catch (error) {
      console.error("Erro ao obter horários:", error);
      res.status(500).json({ erro: "Erro ao obter horários" });
    }
  }

  async createdEvent(req, res) {
    try {
      const evento = req.body;
      const novoEvento = await createdEvent(evento);
      res.send(novoEvento);
    } catch (error) {
      console.error("Erro ao criar o evento:", error);
      res.status(500).json({ erro: "Erro ao criar o evento" });
    }
  }

  async deleteEvent(req, res) {
    try {
      const eventId = req.body;
      const delet = await deleteEvent(eventId);
      res.send(delet);
    } catch (error) {
      console.error("Erro ao deletar o evento:", error);
      res.status(500).json({ erro: "Erro ao deletar o evento" });
    }
  }
}
