import "./loadEnvironment";
import startServer from "./server/startServer";
import connectDatabase from "./dataBase/index";

const port = process.env.PORT ?? 4500;
const urlMongo = process.env.DATABASE;

(async () => {
  try {
    await connectDatabase(urlMongo);
    await startServer(+port);
  } catch {
    process.exit(5);
  }
})();
