export type TeamMember = {
  id: string;
  name: string;
  position: string;
  image: string;
  createdAt: string;
};

export type TeamMemberRow = {
  id: string;
  name: string;
  position: string;
  image: string;
  sort_order: number;
  created_at: string;
};

export function rowToTeamMember(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    image: row.image,
    createdAt: row.created_at,
  };
}
