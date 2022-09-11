import express from "express";
import morgan from "morgan";
import cors from "cors";
import usersRouter from "./routers/usersRouter";
import generalError, { notFoundError } from "./middlewares/errors";
import cardsRouter from "./routers/cardsRouter";

const app = express();
app.disable("x-powered-by");

app.use(cors());
app.disable("x-powered-by");
app.use(express.json());
app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
