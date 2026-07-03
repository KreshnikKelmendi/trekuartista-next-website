import VideoAnimation from "../COMPONENTS/Main/VideoAnimation";
import LetsTalkArt from "../COMPONENTS/Main/LetsTalkArt";
import FeaturedWork from "../COMPONENTS/Latest/FeaturedWork";
import FirstContentOfAbout from "../COMPONENTS/about/FirstContentOfAbout";
import Services from "../COMPONENTS/services/Services";
import Clients from "../COMPONENTS/clients/Clients";
import { getWorks } from "@/lib/works/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const works = await getWorks();

  return (
    <>
      <VideoAnimation />
      <LetsTalkArt />
      <FeaturedWork works={works} />
      <FirstContentOfAbout />
      <Services />
      <Clients />
    </>
  );
}
