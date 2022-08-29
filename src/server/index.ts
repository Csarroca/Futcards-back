import "../loadEnvironment";
import express from "express";
import Debug from "debug";
import chalk from "chalk";

export const app = express();
app.disable("x-powered-by");
const debug = Debug("futCards:server:index");

export const startServer = (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.bgGreen(`server listening on port http://localhost:${port}`));
      resolve(true);
    });

    server.on("error", (error) => {
      debug(chalk.bgRed("Error  connecting to database: ", error.message));
      reject(error);
    });
  });
