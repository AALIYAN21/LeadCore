import type { LeadStatus } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<LeadStatus, { className: string }> = {
  Lead: { className: "bg-status-lead/20 text-status-lead border-status-lead/30" },
  Contacted: { className: "bg-status-contacted/20 text-status-contacted border-status-contacted/30" },
  Negotiation: { className: "bg-status-negotiation/20 text-status-negotiation border-status-negotiation/30" },
  Closed: { className: "bg-status-closed/20 text-status-closed border-status-closed/30" },
  Lost: { className: "bg-status-lost/20 text-status-lost border-status-lost/30" },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {status}
    </Badge>
  );
}
