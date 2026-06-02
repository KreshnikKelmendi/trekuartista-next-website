import { getTeamMembers } from "@/lib/team/queries";
import TeamManager from "./TeamManager";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const members = await getTeamMembers();
  return <TeamManager initialMembers={members} />;
}
