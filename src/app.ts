import express, {Application} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import config from "config";
import * as bodyParser from "body-parser";
import logger from "./libs/logger";
import {Controller} from "./main.controller";

class App {
  public app: Application;
  public fiscalController: Controller;

  constructor() {
    this.app = express();
    this.setConfig();
    App.setMongoConfig();
    this.fiscalController = new Controller(this.app);
  }

  private setConfig() {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(cors());
    this.app.use(cookieParser());
  }

  private static setMongoConfig() {
    const mongoUrl: string = config.get("app.db.mongoUrl");
    mongoose.Promise = global.Promise;
    // @ts-ignore
    mongoose.Schema.Types.Boolean.convertToFalse.add("");
    mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
      .then(obj => {
        logger.info("Mongo OK!");
      })
      .catch(err => {
        logger.error("Mongo ERROR! : " + err);
        process.exit();
      });
  }
}

const app: Application = new App().app;
export default app;
