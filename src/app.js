import express from "express";
import router from "./routes/index.js";
const app = express();
import cors from "cors";
import { HealthController } from "./controllers/health.controller.js";

const healthController = new HealthController();

app.use(express.json());
app.use("/calendar", router);
app.get("/health", healthController.handle);
app.use(cors());

export { app };
