import express from "express";
import morgan from "morgan";
import cors from "cors";
import "./loadEnvironment";
import { startServer, app } from "./server/index";

const port = process.env.PORT ?? 4500;

app.use(cors());
app.disable("x-powered-by");
app.use(express.json());
app.use(morgan("dev"));

(async () => {
  try {
    await startServer(+port);
  } catch {
    process.exit(5);
  }
})();
