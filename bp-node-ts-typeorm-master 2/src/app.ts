/* eslint-disable @typescript-eslint/explicit-function-return-type */
import express from "express";
import "express-async-errors";
import "module-alias/register";
import { Routes } from "@api/route";
import { unhandledExceptionHandler } from "@util/unhandled-exception";
// import { adotInit } from "./core/kernel";
import { APP_NAME, APP_VERSION } from "@config/secret";
import { Kernel } from "./core/kernel";

class App {
  public app: express.Application = express();
  private kernel: Kernel = new Kernel();
  private router: Routes = new Routes();
  private appName = `${APP_NAME}@${APP_VERSION}`;

  constructor() {
    this.initMiddlewares();
  }

  private async initMiddlewares(): Promise<void> {
    this.kernel.initSentry(this.app);
    this.kernel.initBodyParser(this.app);
    this.kernel.addCommonMiddleware(this.app);
    this.kernel.attachRequestContext(this.app);
    await this.kernel.databaseConnection();
    this.kernel.initTranslation(this.app);
    this.kernel.setupSwagger(this.app);
    this.router.routes(this.app);
    this.kernel.sentryErrorHandler(this.app);
    this.kernel.errorMiddleware(this.app);
    unhandledExceptionHandler();
  }
}

export default new App().app;
