import EnhancedDashboard from "@/app/ui/dashboard/enhanced-dashboard";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ contractor?: string }>;
}) {
  const { contractor } = await searchParams;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnhancedDashboard contractorId={contractor} />
    </Suspense>
  );
}
