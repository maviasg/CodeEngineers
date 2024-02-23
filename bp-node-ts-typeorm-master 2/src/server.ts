import { adotInit, logger } from "@studiographene/nodejs-telemetry";
import { APP_NAME, APP_VERSION } from "./config/secret";

const serviceNode = `${APP_NAME}@${APP_VERSION}`;
adotInit(serviceNode, "/");

/* eslint-disable */
// import { logger } from "@studiographene/nodejs-telemetry";
import app from "./app";

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): string | boolean | number {
  const portVal = parseInt(val, 10);

  if (isNaN(portVal)) {
    // named pipe
    return val;
  }

  if (portVal >= 0) {
    // port number
    return portVal;
  }

  return false;
}

/**
 * Set HTTP port for application
 */

const port = normalizePort(process.env.PORT || "3001");
app.set("port", port);

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  logger.info(
    `App is running at http://localhost:${app.get("port")} in ${app.get(
      "env"
    )} mode`,
    "server.ts"
  );
  logger.info("Press CTRL-C to stop", "server.ts");
});

export default server;
