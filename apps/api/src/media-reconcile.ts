import { createDatabaseClient } from "@fury/database";

import { databaseConfig } from "./core/config/database.config.js";
import { getMediaConfig } from "./core/config/media.config.js";
import { MediaReconciler } from "./infrastructure/media/media-reconcile.js";
import { MediaStorage } from "./infrastructure/media/media-storage.js";
import { logger } from "./infrastructure/logger/logger.js";

const parseLimit = (): number => {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.length === 0) return 100;
  if (argumentsList.length !== 1 || !argumentsList[0]?.startsWith("--limit=")) {
    throw new Error("Usage: pnpm media:reconcile [--limit=100]");
  }
  const limit = Number(argumentsList[0].slice("--limit=".length));
  if (!Number.isInteger(limit) || limit < 1 || limit > 1_000) {
    throw new Error("Reconciliation limit must be an integer from 1 to 1000.");
  }
  return limit;
};

const run = async (): Promise<void> => {
  const limit = parseLimit();
  const database = createDatabaseClient(databaseConfig.url);
  try {
    await database.$connect();
    const report = await new MediaReconciler(
      database,
      new MediaStorage(getMediaConfig()),
    ).run(limit);
    logger.info({ report }, "Media reconciliation completed.");
  } finally {
    await database.$disconnect();
  }
};

run().catch((error: unknown) => {
  logger.error({ err: error }, "Media reconciliation failed.");
  process.exitCode = 1;
});
