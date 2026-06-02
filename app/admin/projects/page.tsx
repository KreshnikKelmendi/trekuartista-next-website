import { getWorks } from "@/lib/works/queries";
import ProjectsManager from "./ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const works = await getWorks();
  return <ProjectsManager initialWorks={works} />;
}
