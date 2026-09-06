import { tokenQuerySchema } from "@fury/contracts";
import type { z } from "zod";

export const tokenQueryDtoSchema = tokenQuerySchema;
export type TokenQueryDto = z.infer<typeof tokenQueryDtoSchema>;
