import { registerBodySchema } from "@fury/contracts";
import type { z } from "zod";

export const registerBodyDtoSchema = registerBodySchema;
export type RegisterBodyDto = z.infer<typeof registerBodyDtoSchema>;
