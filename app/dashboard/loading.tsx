import { RevenueCardsSkeleton } from "@/app/ui/skeletons";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <RevenueCardsSkeleton />
    </div>
  );
}
