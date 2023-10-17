const express = require("express");
const app = express();
const calendarController = require("./controllers/calendarController");

app.use(express.json());
app.use("/calendar", calendarController);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Node.js em execução na porta ${PORT}`);
});
