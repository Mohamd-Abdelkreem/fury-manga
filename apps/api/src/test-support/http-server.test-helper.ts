import { once } from "node:events";
import type { Server } from "node:http";
import { promisify } from "node:util";

import type { Application } from "express";

export const listenOnTestLoopback = async (
  app: Application,
): Promise<Server> => {
  // Supertest constructs IPv4 loopback URLs even when given an IPv6 listener.
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  return server;
};

export const closeTestServers = async (servers: Server[]): Promise<void> => {
  await Promise.all(
    servers.splice(0).map((server) => promisify(server.close.bind(server))()),
  );
};
