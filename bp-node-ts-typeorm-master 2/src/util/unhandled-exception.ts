import { logger } from "@studiographene/nodejs-telemetry";

const handleRejectedPromise = (
  reason: Record<string, unknown>,
  promise: Promise<unknown>
): void => {
  logger.error(
    "Unexpected promise rejection occured.",
    "handleRejectedPromise",
    {
      data: {
        reason,
        ex: promise,
      },
    }
  );

  process.exit(1);
};

export const unhandledExceptionHandler = (): void => {
  process.on("unhandledRejection", handleRejectedPromise);
};
