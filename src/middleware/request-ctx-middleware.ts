import { logger } from "@studiographene/nodejs-telemetry";
import { Request, Response, NextFunction } from "express";
// import { v1 as uuid } from "uuid";

/**
 * Global middleware to assign "requestId" to async storage
 * @param req
 * @param res
 * @param next
 */
export function requestCtx(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const reqCtxObj: Record<string, unknown> = {
    url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    method: req.method,
    request_id: res.get("x-request-id"),
  };
  logger.contextData(reqCtxObj);
  next();
}
