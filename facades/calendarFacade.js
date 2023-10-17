const calendarService = require("../services/calendarService");

async function listeEvent() {
  const listarEventos = await calendarService.listeEvent();
  return listarEventos;
}

async function listeEventFromDate(date) {
  const listarEvento = await calendarService.listeEventFromDate(date);
  return { listarEvento };
}

async function createdEvent(evento) {
  const checkEvent = await calendarService.checkEvent(evento);

  if (checkEvent) {
    console.log("Não passou");
    return "evento ja cadastrado";
  }

  console.log("Passou");
  const novoEvento = await calendarService.createdEvent(evento);
  return novoEvento;
}

async function getEventConfirmed(date) {
  const range = parseInt(date);
  const listEventConfirmed = await calendarService.getEventConfirmed(range);
  return listEventConfirmed;
}

async function getAvailableTimes(date) {
  const range = parseInt(date);
  const listEventConfirmed = await calendarService.getAvailableTimes(range);
  return listEventConfirmed;
}

module.exports = {
  listeEvent,
  listeEventFromDate,
  createdEvent,
  getEventConfirmed,
  getAvailableTimes,
};
