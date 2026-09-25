import type { DatabaseClient } from "@fury/database";
import type { MediaStorage } from "../../infrastructure/media/media-storage.js";

import type { HealthResult } from "./health.types.js";

export class HealthService {
  constructor(
    private readonly database: DatabaseClient,
    private readonly mediaStorage: MediaStorage,
  ) {}

  getLiveness(): HealthResult {
    return {
      status: "ok",
      database: "not_checked",
      uptime: `${String(Math.floor(process.uptime()))}s`,
      timestamp: new Date().toISOString(),
    };
  }

  async checkHealth(): Promise<HealthResult> {
    const database = await this.checkDatabase();
    const storage = this.checkStorage();

    return {
      status: database === "ok" && storage === "ok" ? "ok" : "degraded",
      database,
      uptime: `${String(Math.floor(process.uptime()))}s`,
      timestamp: new Date().toISOString(),
    };
  }

  private checkStorage(): "ok" | "error" {
    try {
      this.mediaStorage.checkHealth();
      return "ok";
    } catch {
      return "error";
    }
  }

  private async checkDatabase(): Promise<"ok" | "error"> {
    try {
      await this.database.$queryRaw`SELECT 1`;
      return "ok";
    } catch {
      return "error";
    }
  }
}
