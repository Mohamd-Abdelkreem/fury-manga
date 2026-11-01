import { appConfig } from "../../core/config/app.config.js";

const CREDENTIAL_QUERY_KEYS = new Set([
  "token",
  "access_token",
  "refresh_token",
  "id_token",
  "code",
  "secret",
  "password",
]);

const safelyDecode = (value: string): string => {
  try {
    return decodeURIComponent(value.replace(/\+/gu, " "));
  } catch {
    return value;
  }
};

export const publicContentRouteIdentity = (
  value: string,
): string | undefined => {
  const path = value.split(/[?#]/u, 1)[0] ?? "";
  const prefix = `${appConfig.apiPrefix}/content`;
  const normalizedPath = path.toLowerCase();
  const normalizedPrefix = prefix.toLowerCase();
  if (
    normalizedPath !== normalizedPrefix &&
    !normalizedPath.startsWith(`${normalizedPrefix}/`)
  )
    return undefined;
  const relative = path.slice(prefix.length);
  if (/^\/admin(?:\/|$)/iu.test(relative)) return undefined;
  const staticRoute =
    /^\/catalog\/(works|categories|home|sitemap-works)\/?$/iu.exec(relative);
  if (staticRoute !== null)
    return `${prefix}/catalog/${staticRoute[1]?.toLowerCase() ?? ""}`;
  if (/^\/catalog\/works\/[^/]+\/?$/iu.test(relative))
    return `${prefix}/catalog/works/:workSlug`;
  if (/^\/works\/?$/iu.test(relative)) return `${prefix}/works`;
  if (/^\/works\/[^/]+\/?$/iu.test(relative))
    return `${prefix}/works/:workSlug`;
  const workChild = /^\/works\/[^/]+\/(cover|background|chapters)\/?$/iu.exec(
    relative,
  );
  if (workChild !== null)
    return `${prefix}/works/:workSlug/${workChild[1]?.toLowerCase() ?? ""}`;
  if (/^\/works\/[^/]+\/chapters\/[^/]+\/?$/iu.test(relative))
    return `${prefix}/works/:workSlug/chapters/:chapterNumber`;
  return `${prefix}/[unknown]`;
};

export const sanitizeRequestUrl = (value: string): string => {
  const publicRoute = publicContentRouteIdentity(value);
  if (publicRoute !== undefined) return publicRoute;
  const queryStart = value.indexOf("?");
  if (queryStart === -1) return value;
  const fragmentStart = value.indexOf("#", queryStart);
  const path = value.slice(0, queryStart);
  const query =
    fragmentStart === -1
      ? value.slice(queryStart + 1)
      : value.slice(queryStart + 1, fragmentStart);
  const fragment = fragmentStart === -1 ? "" : value.slice(fragmentStart);
  const sanitized = query
    .split("&")
    .map((part) => {
      const equals = part.indexOf("=");
      const rawKey = equals === -1 ? part : part.slice(0, equals);
      return CREDENTIAL_QUERY_KEYS.has(safelyDecode(rawKey).toLowerCase())
        ? `${rawKey}=[REDACTED]`
        : part;
    })
    .join("&");
  return `${path}?${sanitized}${fragment}`;
};

export const sanitizeRequestQuery = (
  value: unknown,
): Record<string, unknown> | undefined => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      CREDENTIAL_QUERY_KEYS.has(key.toLowerCase()) ? "[REDACTED]" : item,
    ]),
  );
};

export const sanitizeRequestForLog = (
  value: Record<string, unknown>,
): Record<string, unknown> => {
  const url = value["originalUrl"] ?? value["url"];
  const publicRoute =
    typeof url === "string" ? publicContentRouteIdentity(url) : undefined;
  // Same-origin Referer and proxy URL headers can retain the public search or raw path.
  return {
    ...value,
    ...(publicRoute === undefined
      ? {}
      : {
          query: undefined,
          params: undefined,
          headers: undefined,
          path: publicRoute,
        }),
    ...(typeof value["url"] === "string"
      ? { url: sanitizeRequestUrl(value["url"]) }
      : {}),
    ...(typeof value["originalUrl"] === "string"
      ? { originalUrl: sanitizeRequestUrl(value["originalUrl"]) }
      : {}),
    ...(publicRoute !== undefined ||
    sanitizeRequestQuery(value["query"]) === undefined
      ? {}
      : { query: sanitizeRequestQuery(value["query"]) }),
    raw: undefined,
  };
};
