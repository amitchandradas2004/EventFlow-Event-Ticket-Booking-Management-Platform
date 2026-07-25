import Banner from "@/components/Additionals/Banner";
import CategoryExplorer from "@/components/Additionals/CategoryExplorer";
import Frequently from "@/components/Additionals/Frequently";
import HowItWorks from "@/components/Additionals/HowItWorks";
import TrustAndProof from "@/components/Additionals/Trustandproof";
import FeaturedEvents from "@/components/FeaturedEvents/FeaturedEventes";

export default function Home() {
  return (
    <div>
      <Banner />
      <CategoryExplorer />
      <FeaturedEvents />
      <HowItWorks />
      <TrustAndProof />
      <Frequently />
    </div>
  );
}