import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkDetail from "@/app/COMPONENTS/Works/WorkDetail";
import { getWorkById } from "@/lib/works/queries";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const work = await getWorkById(id);
  if (!work) return { title: "Work | Trekuartista" };

  return {
    title: `${work.workName} | Trekuartista`,
    description: work.description.trim() || `${work.specialCategory} — ${work.workName}`,
  };
}

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;
  const work = await getWorkById(id);
  if (!work) notFound();

  return <WorkDetail work={work} />;
}
