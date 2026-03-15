import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  RefreshCw,
  Mail,
  CheckCircle,
  XCircle,
  Upload,
} from "lucide-react";
import { endpoints } from "@/config/api";

interface BulkTicket {
  _id: string;
  name: string;
  status: string;
  totalRecipients: number;
  successCount?: number;
  failedCount?: number;
  createdAt: string;
  processedAt?: string;
}

export const BulkTicketsTab = () => {
  const [tickets, setTickets] = useState<BulkTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoints.bulkTickets.getAll, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.docs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleUploadClick = () => {
    window.location.href = "/admin/bulk-tickets";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bulk Ticket Distributions</h2>
          <p className="text-muted-foreground">
            Manage free ticket email campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchTickets} disabled={loading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={handleUploadClick}>
            <Upload className="w-4 h-4 mr-2" />
            New Distribution
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No bulk ticket distributions yet
            </p>
            <Button onClick={handleUploadClick}>
              <Upload className="w-4 h-4 mr-2" />
              Create First Distribution
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <Card key={ticket._id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{ticket.name}</h3>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {ticket.totalRecipients} recipients
                      </span>
                      {ticket.successCount !== undefined && (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          {ticket.successCount} sent
                        </span>
                      )}
                      {ticket.failedCount !== undefined &&
                        ticket.failedCount > 0 && (
                          <span className="flex items-center gap-1 text-red-600">
                            <XCircle className="w-4 h-4" />
                            {ticket.failedCount} failed
                          </span>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                      {ticket.processedAt &&
                        ` • Completed: ${new Date(ticket.processedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
