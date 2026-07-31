import Banner from "@/components/Additionals/Banner";
import Frequently from "@/components/Additionals/Frequently";
import HowItWorks from "@/components/Additionals/HowItWorks";
import Pricing from "@/components/Additionals/Pricing";
import TrustAndProof from "@/components/Additionals/Trustandproof";
import FeaturedEvents from "@/components/FeaturedEvents/FeaturedEventes";
import FeaturedOrganizations from "@/components/FeaturedOrganizations/FeaturedOrganizations";

export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedEvents />
      <FeaturedOrganizations />
      <HowItWorks />
      <TrustAndProof />
      <Pricing />
      <Frequently />
    </div>
  );
}