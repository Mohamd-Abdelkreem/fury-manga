import { Prisma } from "@fury/database";

export const isTransactionWriteConflict = (error: unknown): boolean => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code === "P2034") return true;
  if (error.code !== "P2010") return false;
  const detail = `${error.message} ${JSON.stringify(error.meta)}`;
  return (
    detail.includes("40001") ||
    detail.includes("40P01") ||
    detail.includes("TransactionWriteConflict") ||
    detail.includes("could not serialize access") ||
    detail.includes("deadlock detected")
  );
};
