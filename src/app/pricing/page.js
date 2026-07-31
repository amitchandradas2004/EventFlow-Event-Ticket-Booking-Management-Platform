import Pricing from "@/components/Additionals/Pricing";

export const metadata = {
  title: "Pricing Plans - EventFlow",
  description: "Explore EventFlow pricing plans. Choose between our Free plan ($0) and Premium plan ($49) with unlimited organization publishing.",
};

export default function PricingPage() {
  return (
    <div>
      <Pricing />
    </div>
  );
}
