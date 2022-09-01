import express from "express";
import morgan from "morgan";
import cors from "cors";
import usersRouter from "./routers/usersRouter";
import generalError, { notFoundError } from "./middlewares/errors";

const app = express();
app.disable("x-powered-by");

app.use(cors());
app.disable("x-powered-by");
app.use(express.json());
app.use(morgan("dev"));

app.use("/users", usersRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
