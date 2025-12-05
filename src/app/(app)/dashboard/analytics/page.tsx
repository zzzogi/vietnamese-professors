import { AccessGate } from "@/components/access/access-gate";
import { UserRole } from "@/lib/constants/roles";

export default function AnalyticsPage() {
  return (
    <AccessGate required={UserRole.PRO}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        {/* PRO analytics content */}
      </div>
    </AccessGate>
  );
}
