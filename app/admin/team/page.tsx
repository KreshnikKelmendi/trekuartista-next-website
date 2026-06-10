import { getTeamMembers } from "@/lib/team/queries";
import TeamManager from "./TeamManager";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  try {
    const members = await getTeamMembers();
    return <TeamManager initialMembers={members} />;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not load team members.";

    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        <p className="font-semibold">Team admin is unavailable</p>
        <p className="mt-2">{message}</p>
        <p className="mt-3 text-red-700/80">
          Check that{" "}
          <code className="rounded bg-red-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          is set and run the team section of{" "}
          <code className="rounded bg-red-100 px-1">supabase/migrations/works.sql</code>{" "}
          in Supabase.
        </p>
      </div>
    );
  }
}
