import VideoAnimation from "../COMPONENTS/Main/VideoAnimation";
import LetsTalkArt from "../COMPONENTS/Main/LetsTalkArt";
import FeaturedWork from "../COMPONENTS/Latest/FeaturedWork";
import FirstContentOfAbout from "../COMPONENTS/about/FirstContentOfAbout";
import Services from "../COMPONENTS/services/Services";
import Clients from "../COMPONENTS/clients/Clients";

export default function Home() {
  return (
    <>
      <VideoAnimation />
      <LetsTalkArt />
      <FeaturedWork />
      <FirstContentOfAbout />
      <Services />
      <Clients />
    </>
  );
}
