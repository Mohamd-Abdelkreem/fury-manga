import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDirectory = fileURLToPath(
  new URL("../apps/web/src/app/", import.meta.url),
);
const baseUrl = process.argv[2] ?? "http://localhost:3000";
const examples = {
  id: "1",
  workId: "trait-hoarder",
  userId: "user-1",
  messageId: "msg-1",
};
const getExample = (name, segments) => {
  if (name === "chapterId") {
    return segments[0] === "admin" ? "th-43" : "1";
  }
  return examples[name];
};

async function collectRoutes(directory, segments = []) {
  const routes = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith("_") || entry.name.startsWith("@")) continue;
      const segment = entry.name.startsWith("(")
        ? []
        : [
            entry.name.replace(/^\[(\w+)\]$/, (_, name) => {
              const example = getExample(name, segments);
              assert.ok(
                example,
                `Add a sample value for route parameter ${name}`,
              );
              return example;
            }),
          ];
      routes.push(
        ...(await collectRoutes(path.join(directory, entry.name), [
          ...segments,
          ...segment,
        ])),
      );
    } else if (/^page\.(tsx?|jsx?)$/.test(entry.name)) {
      routes.push("/" + segments.join("/"));
    }
  }
  return routes;
}

const routes = new Set([
  ...(await collectRoutes(appDirectory)),
  "/story/trait-hoarder",
  "/story/trait-hoarder/chapter/43",
  "/story/1/chapter/1",
  "/story/1/chapter/2",
]);

for (const route of routes) {
  const response = await fetch(new URL(route, baseUrl), {
    signal: AbortSignal.timeout(60_000),
  });
  await response.text();
  assert.equal(
    response.status,
    200,
    `${route} returned HTTP ${response.status}`,
  );
  console.log(`PASS ${route}`);
}

const missing = await fetch(new URL("/__routing_check_missing__", baseUrl));
await missing.text();
assert.equal(missing.status, 404, "Unknown routes should still return 404");
console.log(
  `Verified ${routes.size} existing routes and the 404 fallback at ${baseUrl}.`,
);
