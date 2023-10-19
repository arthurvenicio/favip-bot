import * as calendarService from "../services/calendarService.js";

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
    return ErrorEvent;
  }

  const novoEvento = await calendarService.createdEvent(evento);
  return novoEvento;
}

async function deleteEvent(eventId) {
  const deleteEvent = await calendarService.deleteEvent(eventId);
  return deleteEvent;
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

export {
  listeEvent,
  listeEventFromDate,
  createdEvent,
  deleteEvent,
  getEventConfirmed,
  getAvailableTimes,
};
