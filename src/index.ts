import express from "express";
import morgan from "morgan";
import cors from "cors";
import "./loadEnvironment";
import { startServer, app } from "./server/index";
import connectDatabase from "./dataBase/index";
import usersRouter from "./routers/usersRouter";

const port = process.env.PORT ?? 4500;
const urlMongo = process.env.DATABASE;

app.use(cors());
app.disable("x-powered-by");
app.use(express.json());
app.use(morgan("dev"));
app.use("/users", usersRouter);

(async () => {
  try {
    await connectDatabase(urlMongo);
    await startServer(+port);
  } catch {
    process.exit(5);
  }
})();
