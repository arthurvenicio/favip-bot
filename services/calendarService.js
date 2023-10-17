const { google } = require("googleapis");
const credentials = require("../config/credentials.json");

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

    const eventos = response.data.items;
    console.log(`eventos: ${eventos}`);

    return eventos.length === 0 ? false : true;
  } catch (error) {
    console.error(error);
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
      range = 5;
    }
    const currentDate = new Date();
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + range);

    const available = [];

    while (currentDate <= nextWeek) {
      if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
        const startTime = new Date(currentDate);
        startTime.setHours(9, 0, 0);

        const endTime = new Date(currentDate);
        endTime.setHours(17, 0, 0);

        let currentTime = new Date(startTime);

        while (currentTime < endTime) {
          const endTimeSlot = new Date(currentTime.getTime() + 60 * 60 * 1000);
          const isAvailable = await checkConfirmed(currentTime, endTimeSlot);

          if (isAvailable) {
            available.push({
              start: currentTime.toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              }),
              end: endTimeSlot.toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              }),
            });
          }
          currentTime = endTimeSlot;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return available;
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

    const eventos = response.data.items;
    return eventos.length === 0 ? false : true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function getAvailableTimes(range) {
  try {
    if (!range) {
      range = 5;
    }
    const currentDate = new Date();
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + range);

    const available = [];
    if (currentDate.getHours() > 17) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
    while (currentDate <= nextWeek) {
      if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
        const startTime = new Date(currentDate);
        startTime.setHours(9, 0, 0);

        const endTime = new Date(currentDate);
        endTime.setHours(17, 0, 0);

        let currentTime = new Date(startTime);

        while (currentTime < endTime) {
          const endTimeSlot = new Date(currentTime.getTime() + 60 * 60 * 1000);
          const isAvailable = await checkAvailableTimes(
            currentTime,
            endTimeSlot
          );

          if (isAvailable) {
            available.push({
              start: currentTime.toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              }),
              end: endTimeSlot.toLocaleString("pt-BR", {
                timeZone: "America/Sao_Paulo",
              }),
            });
          }
          currentTime = endTimeSlot;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return available;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function checkAvailableTimes(startTime, endTime) {
  try {
    const response = await calendar.events.list({
      calendarId: credentials.calendarId,
      timeMin: startTime,
      timeMax: endTime,
    });

    const eventos = response.data.items;
    return eventos.length === 0 ? true : false;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  createdEvent,
  listeEvent,
  listeEventFromDate,
  checkEvent,
  getEventConfirmed,
  getAvailableTimes,
};
