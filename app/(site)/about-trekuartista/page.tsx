import FirstContentOfAbout from "@/app/COMPONENTS/about/FirstContentOfAbout";
import Founder from "@/app/COMPONENTS/founder/Founder";
import Services from "@/app/COMPONENTS/services/Services";
import PeopleInTheRoom from "@/app/COMPONENTS/team/PeopleInTheRoom";
import TeamSection from "@/app/COMPONENTS/team/TeamSection";

export default function AboutPage() {
  return (
    <>
      <FirstContentOfAbout />
      <Services />
      <Founder />
      <PeopleInTheRoom />
      <TeamSection />
    </>
  );
}
