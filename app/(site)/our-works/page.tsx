import OurWorks from "@/app/COMPONENTS/Works/OurWorks";
import { getWorks } from "@/lib/works/queries";

export const dynamic = "force-dynamic";

export default async function OurWorksPage() {
  const works = await getWorks();
  return <OurWorks works={works} />;
}
