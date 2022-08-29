import mongoose from "mongoose";
import Debug from "debug";
import chalk from "chalk";

const debug = Debug("futCards:database:index");

const connectDatabase = (mongoUrl: string) =>
  new Promise((resolve, reject) => {
    mongoose.set("toJSON", {
      virtuals: true,
      transform: (doc, ret) => {
        const newDocument = { ...ret };

        // eslint-disable-next-line no-underscore-dangle
        delete newDocument.__v;
        // eslint-disable-next-line no-underscore-dangle
        delete newDocument._id;
        // eslint-disable-next-line no-underscore-dangle
        delete newDocument.password;

        return newDocument;
      },
    });
    mongoose.connect(mongoUrl, (error) => {
      if (error) {
        debug(chalk.red("Error conecting to database"));
        reject(error);
        return;
      }
      debug(chalk.green("Connected to database"));
      resolve(true);
    });
  });

export default connectDatabase;
