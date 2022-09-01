import "../loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import app from "./index";

const debug = Debug("futCards:server:startServer");

const startServer = (port: number) =>
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

export default startServer;
