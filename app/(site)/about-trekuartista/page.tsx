import FirstContentOfAbout from "@/app/COMPONENTS/about/FirstContentOfAbout";
import Founder from "@/app/COMPONENTS/founder/Founder";
import Office from "@/app/COMPONENTS/office/Office";
import WhatWeDont from "@/app/COMPONENTS/office/WhatWeDont";
import Services from "@/app/COMPONENTS/services/Services";
import PeopleInTheRoom from "@/app/COMPONENTS/team/PeopleInTheRoom";
import TeamSection from "@/app/COMPONENTS/team/TeamSection";

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <>
      <FirstContentOfAbout />
      <Services />
      <Founder />
      <PeopleInTheRoom />
      <TeamSection />
      <Office />
      <WhatWeDont />
    </>
  );
}
