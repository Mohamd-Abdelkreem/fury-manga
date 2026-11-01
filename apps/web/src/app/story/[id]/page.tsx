import { workSlugParamsSchema } from "@fury/contracts";
import { notFound } from "next/navigation";
import { PublicWorkDetails } from "@/features/public-catalog/components/PublicWorkDetails";
import {
  getPublicWork,
  publicWorkMetadata,
  unavailableWorkMetadata,
} from "@/features/public-catalog/api/public-catalog.seo";
import { SafePublicCatalogError } from "@/features/public-catalog/model/public-catalog.errors";

export const dynamic = "force-dynamic";
type PageProps = Readonly<{ params: Promise<{ id: string }> }>;
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  try {
    return publicWorkMetadata(await getPublicWork(id));
  } catch (error) {
    return unavailableWorkMetadata(error);
  }
}
export default async function StoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  let seed;
  try {
    seed = await getPublicWork(id);
  } catch (error) {
    if (!(error instanceof SafePublicCatalogError)) throw error;
    if (
      error.statusCode === 404 ||
      (error.statusCode === 400 &&
        !workSlugParamsSchema.safeParse({ workSlug: id }).success)
    )
      notFound();
  }
  return (
    <PublicWorkDetails
      slug={id}
      serverRenderId={crypto.randomUUID()}
      {...(seed === undefined ? { initialUnavailable: true } : { seed })}
    />
  );
}
