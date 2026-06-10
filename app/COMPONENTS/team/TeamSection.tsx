import { getTeamMembers } from "@/lib/team/queries";
import Team from "@/app/COMPONENTS/team/Team";

export const dynamic = "force-dynamic";

export default async function TeamSection() {
  const members = await getTeamMembers();
  return <Team members={members} />;
}
