import { google } from "googleapis";
import env from "../env.js";
import dayjs from "dayjs";
const credentials = JSON.parse(env.CREDENTIALS);

const client = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

client.authorize((err) => {
  if (err) {
    console.error("Erro na autenticação com o Google Agenda:", err);
  } else {
    console.log("Autenticado com sucesso com o Google Agenda!");
  }
});

const calendar = google.calendar({ version: "v3", auth: client });

async function checkEvent(evento) {
  const { start, end } = evento;

  try {
    const response = await calendar.events.list({
      calendarId: credentials.calendarId,
      timeMin: start.dateTime,
      timeMax: end.dateTime,
    });

    const { items } = response.data;

    return items.length === 0 ? false : true;
  } catch (error) {
    throw error;
  }
}

async function createdEvent(evento) {
  try {
    const response = await calendar.events.insert({
      calendarId: credentials.calendarId,
      resource: evento,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar o evento:", error);
    throw error;
  }
}

async function listeEventFromDate(date) {
  const today = date;

  try {
    await calendar.events.list(
      {
        calendarId: credentials.calendarId,
        timeMin: `${today}T00:00:00-03:00`,
        timeMax: `${today}T23:59:59-03:00`,
      },
      (err, res) => {
        if (err) {
          console.error("Erro ao listar os eventos:", err);
          return;
        }

        const eventos = res.data.items;
        if (eventos.length === 0) {
          console.log("Nenhum evento encontrado");
        } else {
          eventos.forEach((evento) => {
            console.log(evento);
          });
        }
      }
    );
  } catch (error) {
    return error;
  }
}

async function listeEvent() {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  today.toISOString();
  try {
    await calendar.events.list(
      {
        calendarId: credentials.calendarId,
        timeMin: today,
      },
      (err, res) => {
        if (err) {
          console.error("Erro ao listar os eventos:", err);
          return;
        }

        let e = [];
        const eventos = res.data.items;
        if (eventos.length === 0) {
          return "Nenhum evento encontrado";
        } else {
          eventos.forEach((evento) => {
            e.push(evento);
          });
          return e;
        }
      }
    );
  } catch (error) {
    return error;
  }
}

async function getEventConfirmed(range) {
  try {
    if (!range) {
      range = 7;
    }

    const currentDate = new Date();
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + range);

    const startTime = new Date(currentDate);

    if (startTime.getHours() < 9) {
      startTime.setHours(9, 0, 0);
      if (startTime.getMinutes() >= 15) {
        startTime.setHours(startTime.getHours() + 1, 0, 0);
      }
    }
    if (startTime.getMinutes() >= 15) {
      startTime.setHours(startTime.getHours() + 1, 0, 0);
    }

    if (startTime.getHours() > 16) {
      startTime.setDate(startTime.getDate() + 1);
      startTime.setHours(9, 0, 0);
    }

    startTime.setHours(startTime.getHours(), 0, 0);

    const endTime = new Date(nextWeek);
    endTime.setHours(17, 0, 0);

    const result = await checkConfirmed(startTime, endTime);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function checkConfirmed(startTime, endTime) {
  try {
    const response = await calendar.events.list({
      calendarId: credentials.calendarId,
      timeMin: startTime,
      timeMax: endTime,
    });

    const { items } = response.data;
    if (!items.length) {
      throw new Error("items not found");
    }
    const events = items.map((event) => {
      return {
        id: event.id,
        summary: event.summary,
        start: event.start.dateTime,
        end: event.end.dateTime,
      };
    });

    events.sort((a, b) => new Date(a.start) - new Date(b.start));

    const result = events.map((event) => {
      return {
        id: event.id,
        summary: event.summary,
        start: dayjs(event.start).format("DD/MM/YYYY HH:mm:ss"),
        end: dayjs(event.end).format("DD/MM/YYYY HH:mm:ss"),
      };
    });
    return result;
  } catch (error) {
    return error;
  }
}

async function getAvailableTimes(range) {
  try {
    if (!range) {
      range = 7;
    }
    const dateRange = [];
    const currentDate = new Date();
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + range);

    const startTime = new Date(currentDate);

    if (startTime.getHours() < 9) {
      startTime.setHours(9, 0, 0);
    }
    if (startTime.getMinutes() >= 15) {
      startTime.setHours(startTime.getHours() + 1, 0, 0);
    }
    if (startTime.getHours() > 16) {
      startTime.setDate(startTime.getDate() + 1);
      startTime.setHours(9, 0, 0);
    }

    startTime.setHours(startTime.getHours(), 0, 0);

    const endTime = new Date(nextWeek);
    endTime.setHours(17, 0, 0);

    const result = await getTimes(startTime, endTime);

    while (startTime < endTime) {
      const slotEnd = new Date(startTime);
      slotEnd.setHours(startTime.getHours() + 1);
      if (startTime.getDay() >= 1 && startTime.getDay() <= 5) {
        dateRange.push({
          start: dayjs(startTime).format("DD/MM/YYYY HH:mm:ss"),
          end: dayjs(slotEnd).format("DD/MM/YYYY HH:mm:ss"),
        });
      }
      if (startTime.getHours() < 16) {
        startTime.setHours(startTime.getHours() + 1);
      } else {
        startTime.setDate(startTime.getDate() + 1);
        startTime.setHours(9, 0, 0);
      }
    }

    const resultArray = removeItemsFromArray(result, dateRange);
    const data = resultArray.sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteEvent(eventId) {
  try {
    await calendar.events.delete({
      calendarId: credentials.calendarId,
      eventId: eventId.eventId,
    });
    return;
  } catch (error) {
    console.error(`Erro ao excluir o evento: ${error.message}`);
    throw error;
  }
}

async function getTimes(startTime, endTime) {
  try {
    const response = await calendar.events.list({
      calendarId: credentials.calendarId,
      timeMin: startTime,
      timeMax: endTime,
    });

    const { items } = response.data;
    if (!items.length) {
      throw new Error("items not found");
    }
    const events = items.map((event) => {
      return {
        start: event.start.dateTime,
        end: event.end.dateTime,
      };
    });

    events.sort((a, b) => new Date(a.start) - new Date(b.start));

    const result = events.map((event) => {
      return {
        start: dayjs(event.start).format("DD/MM/YYYY HH:mm:ss"),
        end: dayjs(event.end).format("DD/MM/YYYY HH:mm:ss"),
      };
    });
    return result;
  } catch (error) {
    return error;
  }
}

function objectsAreEqual(objA, objB) {
  return JSON.stringify(objA) === JSON.stringify(objB);
}

function removeItemsFromArray(array1, array2) {
  const result = array2.filter((item2) => {
    return !array1.some((item1) => objectsAreEqual(item1, item2));
  });
  return result;
}

export {
  createdEvent,
  listeEvent,
  listeEventFromDate,
  checkEvent,
  getEventConfirmed,
  getAvailableTimes,
  deleteEvent,
};
