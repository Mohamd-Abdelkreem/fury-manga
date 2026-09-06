import { resetPasswordBodySchema } from "@fury/contracts";
import type { z } from "zod";

export const resetPasswordBodyDtoSchema = resetPasswordBodySchema;
export type ResetPasswordBodyDto = z.infer<typeof resetPasswordBodyDtoSchema>;
