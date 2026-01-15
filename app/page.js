import HomeMain from "@/components/home/HomeMain";
import Releasing from "@/components/releasing/Releasing";
import Image from "next/image";

export const metadata = {
  title: "Customise - Casemandu",
  description: "Customise your own phone case with Casemandu.",
}


export default function Home() {
  return (
    <>
      <HomeMain />
    </>
  );
}
