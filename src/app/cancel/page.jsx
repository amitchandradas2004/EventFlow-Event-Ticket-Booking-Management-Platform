import { redirect } from "next/navigation";
import { Suspense } from "react";
import CancelContent from "./CancelContent";

export const metadata = {
  title: "Payment Canceled | EventFlow",
  description: "Your EventFlow payment process was canceled. No charges were made.",
};

export default async function CancelPage({ searchParams }) {
  const params = await searchParams;
  const canceled = params?.canceled;

  // Redirect to homepage if user attempts to access /cancel directly without canceling a payment session
  if (canceled !== "true") {
    redirect("/");
  }

  return (
    <Suspense fallback={null}>
      <CancelContent />
    </Suspense>
  );
}
