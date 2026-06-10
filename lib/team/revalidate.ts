import { revalidatePath } from "next/cache";

export function revalidateTeamPages() {
  revalidatePath("/about-trekuartista");
  revalidatePath("/admin/team");
}
