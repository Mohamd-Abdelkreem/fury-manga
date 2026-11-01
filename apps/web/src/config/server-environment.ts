import "server-only";

import { z } from "zod";

const httpUrlSchema = z.url().refine((raw) => {
  const url = URL.parse(raw);
  return (
    url !== null &&
    !/[\s\\]/u.test(raw) &&
    (url.protocol === "https:" || url.protocol === "http:") &&
    url.username === "" &&
    url.password === ""
  );
});

const serverEnvironmentSchema = z.object({
  SERVER_API_URL: httpUrlSchema
    .refine((raw) => {
      const url = URL.parse(raw);
      return url !== null && url.search === "" && url.hash === "";
    })
    .transform((url) => url.replace(/\/+$/u, "")),
  SITE_ORIGIN: httpUrlSchema
    .refine((raw) => {
      const url = URL.parse(raw);
      return (
        url !== null &&
        url.pathname === "/" &&
        url.search === "" &&
        url.hash === ""
      );
    })
    .transform((url) => new URL(url).origin),
  COMMUNITY_URL: httpUrlSchema
    .refine((url) => URL.parse(url)?.protocol === "https:")
    .optional(),
});

export const getServerEnvironment = () => {
  const parsed = serverEnvironmentSchema.safeParse({
    SERVER_API_URL: process.env["SERVER_API_URL"],
    SITE_ORIGIN: process.env["SITE_ORIGIN"],
    COMMUNITY_URL: process.env["COMMUNITY_URL"],
  });
  if (!parsed.success) {
    const fields = [
      ...new Set(parsed.error.issues.map((issue) => issue.path[0])),
    ];
    throw new Error(`Invalid server environment: ${fields.join(", ")}.`);
  }
  if (
    process.env.NODE_ENV === "production" &&
    new URL(parsed.data.SITE_ORIGIN).protocol !== "https:"
  ) {
    throw new Error("Invalid server environment: SITE_ORIGIN.");
  }
  return Object.freeze(parsed.data);
};
