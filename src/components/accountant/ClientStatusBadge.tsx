import { Badge } from "@/components/ui/badge";

interface ClientStatusBadgeProps {
  status: string;
}

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
  const variant = status === "active" ? "default" : "secondary";

  return <Badge variant={variant}>{status}</Badge>;
}
