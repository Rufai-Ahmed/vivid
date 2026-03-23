import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: Record<string, any> | null;
}

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    Redeemed: "bg-success/20 text-success border-success/30",
    Pending: "bg-warning/20 text-warning border-warning/30",
    Expired: "bg-destructive/20 text-destructive border-destructive/30",
    Active: "bg-success/20 text-success border-success/30",
    Suspended: "bg-destructive/20 text-destructive border-destructive/30",
    Open: "bg-info/20 text-info border-info/30",
    Won: "bg-success/20 text-success border-success/30",
    Lost: "bg-destructive/20 text-destructive border-destructive/30",
    "Under Review": "bg-warning/20 text-warning border-warning/30",
    Approved: "bg-success/20 text-success border-success/30",
    "Pending Documents": "bg-info/20 text-info border-info/30",
    Completed: "bg-success/20 text-success border-success/30",
  };
  return styles[status] || "bg-secondary text-secondary-foreground";
};

export const ViewModal = ({
  open,
  onOpenChange,
  title,
  data,
}: ViewModalProps) => {
  if (!data) return null;

  // Filter out certain fields that shouldn't be displayed
  const excludeFields = ["password", "__v", "updatedAt"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(data).map(([key, value]) => {
            // Skip excluded fields
            if (excludeFields.includes(key)) return null;

            // Handle profile photo
            if (key.toLowerCase() === "profilephoto" && value) {
              return (
                <div key={key} className="space-y-2">
                  <span className="text-sm text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                  </span>
                  <div className="flex justify-center">
                    <img
                      src={value as string}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                    />
                  </div>
                </div>
              );
            }

            // Handle payment slip
            if (key === "paymentSlipUrl" && value) {
              return (
                <div key={key} className="space-y-2 col-span-full">
                  <span className="text-sm font-semibold text-muted-foreground">
                    Payment Slip Proof
                  </span>
                  <div className="flex justify-center mt-2">
                    <img
                      src={value as string}
                      alt="Payment Slip"
                      className="max-w-full rounded-md border"
                    />
                  </div>
                </div>
              );
            }

            // Handle date fields
            const isDate =
              value instanceof Date ||
              (typeof value === "string" &&
                (value.includes("T") || !isNaN(Date.parse(value))));

            return (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <span className="text-sm text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                </span>
                {key.toLowerCase() === "status" ? (
                  <Badge
                    variant="outline"
                    className={`${getStatusBadge(value as string)}`}
                  >
                    {value as string}
                  </Badge>
                ) : (
                  <span className="text-sm font-medium">
                    {isDate && typeof value === "string"
                      ? new Date(value).toLocaleDateString()
                      : (value as string)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
