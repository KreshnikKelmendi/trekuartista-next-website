import { createServiceClient, getPublicMediaUrl } from "@/lib/supabase/service";
import { rowToTeamMember, type TeamMember, type TeamMemberRow } from "./types";

const BUCKET = "team-media";

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as TeamMemberRow[]).map(rowToTeamMember);
}

export async function insertTeamMember(input: {
  name: string;
  position: string;
  image: string;
}) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("team_members")
    .insert({
      name: input.name,
      position: input.position,
      image: input.image,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToTeamMember(data as TeamMemberRow);
}

export async function deleteTeamMember(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateTeamMember(
  id: string,
  input: { name?: string; position?: string; image?: string }
) {
  const supabase = createServiceClient();
  const patch: Record<string, string> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.position !== undefined) patch.position = input.position;
  if (input.image !== undefined) patch.image = input.image;

  if (Object.keys(patch).length === 0) {
    throw new Error("Nothing to update.");
  }

  const { data, error } = await supabase
    .from("team_members")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return rowToTeamMember(data as TeamMemberRow);
}

export async function uploadTeamImage(
  path: string,
  body: Buffer,
  contentType: string
) {
  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, body, { contentType, upsert: true });

  if (error) throw new Error(error.message);
}

export function getTeamImageUrl(path: string) {
  return getPublicMediaUrl(path, BUCKET);
}
