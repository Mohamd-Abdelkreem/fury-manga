import { createDatabaseClient } from "@fury/database";

import { databaseConfig } from "./core/config/database.config.js";
import { logger } from "./infrastructure/logger/logger.js";
import { inventoryPublishedText } from "./modules/content/chapter-readiness-inventory.js";

const run = async (): Promise<void> => {
  const database = createDatabaseClient(databaseConfig.url);
  try {
    await database.$connect();
    const report = await inventoryPublishedText(database);
    process.stdout.write(`${JSON.stringify(report)}\n`);
    if (report.invalidIds.length > 0) process.exitCode = 2;
  } finally {
    await database.$disconnect();
  }
};

run().catch((error: unknown) => {
  logger.error({ err: error }, "Chapter text inventory failed.");
  process.exitCode = 1;
});
