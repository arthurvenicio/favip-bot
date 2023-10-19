import express from "express";
import router from "./routes/index.js";
const app = express();
import cors from "cors";

app.use(express.json());
app.use("/calendar", router);
app.use(cors());

export { app };
