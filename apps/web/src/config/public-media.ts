import { publicEnvironment } from "./public-environment";

export const publicImageUrl = (path: string): string =>
  new URL(path, publicEnvironment.NEXT_PUBLIC_API_URL).href;
