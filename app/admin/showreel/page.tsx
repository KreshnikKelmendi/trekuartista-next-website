import { getShowreelSettings } from "@/lib/showreel/queries";
import ShowreelManager from "./ShowreelManager";

export const dynamic = "force-dynamic";

export default async function AdminShowreelPage() {
  const settings = await getShowreelSettings();
  return <ShowreelManager initialSettings={settings} />;
}
