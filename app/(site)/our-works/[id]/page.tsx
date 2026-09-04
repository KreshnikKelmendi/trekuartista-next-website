import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import WorkDetail from "@/app/COMPONENTS/Works/WorkDetail";
import { getWorkBySlugOrId } from "@/lib/works/queries";
import { getWorkSlug } from "@/lib/works/slug";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const work = await getWorkBySlugOrId(id);
  if (!work) return { title: "Work | Trekuartista" };

  return {
    title: `${work.workName} | Trekuartista`,
    description: work.description.trim() || `${work.specialCategory} — ${work.workName}`,
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;
  const work = await getWorkBySlugOrId(id);
  if (!work) notFound();

  const slug = getWorkSlug(work);
  if (id !== slug) {
    redirect(`/our-works/${slug}`);
  }

  return <WorkDetail work={work} />;
}
