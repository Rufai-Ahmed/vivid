import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/bloc/Header/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Upload,
  Mail,
  Send,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  RefreshCw,
  Eye,
} from "lucide-react";
import { endpoints, apiFetch } from "@/config/api";

interface Recipient {
  email: string;
  name?: string;
}

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

export default function BulkTicketUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(false);
  const [distributing, setDistributing] = useState(false);
  const [name, setName] = useState("");
  const [customEmailTemplate, setCustomEmailTemplate] = useState("");
  const [bulkTickets, setBulkTickets] = useState<BulkTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<BulkTicket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all bulk tickets on mount
  useEffect(() => {
    fetchBulkTickets();
  }, []);

  const fetchBulkTickets = async () => {
    setLoadingTickets(true);
    try {
      const response = await fetch(endpoints.bulkTickets.getAll, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBulkTickets(data.docs || []);
      }
    } catch (error) {
      console.error("Failed to fetch bulk tickets:", error);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Accept CSV, TXT, or Excel files
    const validTypes = [
      "text/csv",
      "text/plain",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const validExtensions = [".csv", ".txt", ".xlsx", ".xls"];

    if (
      !validTypes.includes(selectedFile.type) &&
      !validExtensions.some((ext) =>
        selectedFile.name.toLowerCase().endsWith(ext),
      )
    ) {
      toast.error("Please upload a CSV, TXT, or Excel file");
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(endpoints.bulkTickets.parse, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to parse file");
      }

      const data = await response.json();
      setRecipients(data.recipients || []);
      toast.success(`Found ${data.recipients?.length || 0} recipients`);
    } catch (error) {
      console.error("Parse error:", error);
      toast.error("Failed to parse file");
    } finally {
      setLoading(false);
    }
  };

  const handleDistribute = async () => {
    if (!name || recipients.length === 0) {
      toast.error("Please provide a name and recipients");
      return;
    }

    setDistributing(true);

    try {
      // Use the new free ticket campaign endpoint for professional FIFA World Cup emails
      const response = await fetch(endpoints.bulkTickets.freeTicketCampaign, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          campaignName: name,
          recipients: recipients,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create bulk distribution");
      }

      const data = await response.json();
      toast.success(
        `Distribution completed! ${data.summary?.sent || 0} emails sent successfully.`,
      );

      // Reset form
      setFile(null);
      setRecipients([]);
      setName("");
      setCustomEmailTemplate("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh the list
      fetchBulkTickets();
    } catch (error) {
      console.error("Distribution error:", error);
      toast.error("Failed to start distribution");
    } finally {
      setDistributing(false);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Bulk Ticket Distribution
            </h1>
            <p className="text-muted-foreground">
              Upload a CSV file with recipient emails to send free ticket codes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Recipients
                </CardTitle>
                <CardDescription>
                  Upload a CSV or TXT file with email addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt,.xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload CSV, TXT or Excel file
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Format: email,name (one per line) or Excel columns
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(endpoints.bulkTickets.template, "_blank")
                    }
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>

                {loading && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Parsing file...
                  </div>
                )}

                {recipients.length > 0 && (
                  <div className="space-y-2">
                    <Label>Recipients Preview</Label>
                    <div className="max-h-40 overflow-y-auto border rounded-lg p-2">
                      {recipients.slice(0, 10).map((r, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm py-1"
                        >
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {r.email}
                          {r.name && (
                            <span className="text-muted-foreground">
                              ({r.name})
                            </span>
                          )}
                        </div>
                      ))}
                      {recipients.length > 10 && (
                        <p className="text-sm text-muted-foreground">
                          ...and {recipients.length - 10} more
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium">
                      Total: {recipients.length} recipients
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Configuration Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Distribution Settings
                </CardTitle>
                <CardDescription>
                  Configure the bulk distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Valentine's Giveaway"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">
                    Custom Email Template (Optional)
                  </Label>
                  <Textarea
                    id="template"
                    placeholder="Leave empty to use default template"
                    value={customEmailTemplate}
                    onChange={(e) => setCustomEmailTemplate(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {"{ticketCode}"} and {"{name}"} as placeholders
                  </p>
                </div>

                <Button
                  onClick={handleDistribute}
                  disabled={!name || recipients.length === 0 || distributing}
                  className="w-full"
                >
                  {distributing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Distributing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Start Distribution
                    </>
                  )}
                </Button>

                {distributing && (
                  <p className="text-xs text-muted-foreground text-center">
                    Emails are being sent in the background. You can navigate
                    away.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Prepare a CSV or TXT file with one email per line</li>
                <li>
                  Optional: Add a name after the email, separated by comma
                </li>
                <li>
                  Example format: <code>john@example.com,John Doe</code>
                </li>
                <li>Upload the file and verify recipients</li>
                <li>Give your campaign a name</li>
                <li>Click "Start Distribution" to begin sending emails</li>
                <li>
                  Each recipient will receive a unique ticket code via email
                </li>
                <li>Recipients can redeem by signing up with their email</li>
              </ol>
            </CardContent>
          </Card>

          {/* Bulk Tickets List */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Distribution History</CardTitle>
                <CardDescription>
                  View all bulk ticket distributions and their status
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchBulkTickets}
                disabled={loadingTickets}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    loadingTickets ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {loadingTickets ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : bulkTickets.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No bulk ticket distributions yet. Create your first one above!
                </p>
              ) : (
                <div className="space-y-4">
                  {bulkTickets.map((ticket) => (
                    <div
                      key={ticket._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{ticket.name}</h3>
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
                          Created:{" "}
                          {new Date(ticket.createdAt).toLocaleDateString()}{" "}
                          {ticket.processedAt &&
                            ` • Completed: ${new Date(
                              ticket.processedAt,
                            ).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
