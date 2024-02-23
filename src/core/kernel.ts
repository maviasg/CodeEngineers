import * as bodyParser from "body-parser";
import { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import i18n from "i18n";
import * as Sentry from "@sentry/node";
import { RequestIDMiddleware } from "@middleware/request-id";
import errorMiddleware from "@middleware/error";
import SwaggerDocument from "@util/swagger-document";
import { ENVIRONMENT, SENTRY_DSN } from "@config/secret";
import constant from "@config/constant";
import path from "path";
import { requestCtx } from "@middleware/request-ctx-middleware";
import { dbConnection } from "@database/db-connection";
import { logger } from "@studiographene/nodejs-telemetry";

export class Kernel {
  private requestId: RequestIDMiddleware = new RequestIDMiddleware();

  public initBodyParser(app: Application): void {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
  }

  public addRequestId(app: Application): void {
    app.use(this.requestId.assign);
  }

  public attachRequestContext(app: Application): void {
    app.use(requestCtx);
  }

  public errorMiddleware(app: Application): void {
    app.use(errorMiddleware);
  }

  public databaseConnection(): Promise<void> {
    // establish database connection
    return dbConnection
      .initialize()
      .then(() => {
        logger.info(
          "Data Source has been initialized!",
          "Kernel.databaseConnection"
        );
      })
      .catch((err: Error) => {
        logger.error(
          "Error during Data Source initialization:",
          "Kernel.databaseConnection",
          {
            data: { err },
          }
        );
      });
  }

  public initTranslation(app: Application): void {
    i18n.configure({
      locales: [constant.ENGLISH_LOCALE, constant.SPANISH_LOCALE],
      defaultLocale: constant.ENGLISH_LOCALE,
      queryParameter: "lang",
      directory: path.join(__dirname, "..", "..", "locales"),
    });
    app.use(i18n.init);
  }

  public setupSwagger(app: Application): void {
    if (constant.PRODUCTION !== ENVIRONMENT) {
      const swaggerSpecV1 = swaggerJSDoc(SwaggerDocument);
      app.use("/docs", swaggerUi.serveFiles(swaggerSpecV1));
      app.get("/docs", (req, res) => {
        res.send(swaggerUi.generateHTML(swaggerSpecV1));
      });
    }
  }

  public addCommonMiddleware(app: Application): void {
    app.use(this.requestId.assign);
    const corsOptions = {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      allowedHeaders: "*",
      exposedHeaders: "*",
      optionsSuccessStatus: 200,
    };
    app.use(cors(corsOptions));
  }

  public initSentry(app: Application): void {
    Sentry.init({ dsn: SENTRY_DSN });
    app.use(Sentry.Handlers.requestHandler());
  }

  public sentryErrorHandler(app: Application): void {
    if (SENTRY_DSN) {
      app.use(Sentry.Handlers.errorHandler());
    }
  }
}
