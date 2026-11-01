import { connection } from "next/server";
import { PublicWorkNotFound } from "@/features/public-catalog/components/PublicWorkNotFound";

export default async function WorkNotFound() {
  await connection();
  return <PublicWorkNotFound boundaryId={crypto.randomUUID()} />;
}
