/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { ViewModal } from "@/components/admin/ViewModal";
import { TicketModal } from "@/components/admin/modals/TicketModal";
import { DeleteModal } from "@/components/admin/DeleteModal";
import { endpoints } from "@/config/api";
import { toast } from "sonner";
import { Eye, Edit, Trash2, Ticket } from "lucide-react";

export const TicketsTab = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Modal states
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    title: string;
    data: Record<string, any> | null;
  }>({
    open: false,
    title: "",
    data: null,
  });
  const [ticketModal, setTicketModal] = useState<{
    open: boolean;
    ticket: any | null;
  }>({
    open: false,
    ticket: null,
  });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    title: string;
    id: string | number | null;
    type: string;
  }>({
    open: false,
    title: "",
    id: null,
    type: "ticket",
  });

  const fetchTickets = async (page = 1) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      setLoading(true);
      const res = await fetch(
        `${endpoints.tickets.getAll}?page=${page}&limit=10`,
        { headers },
      );
      if (res.ok) {
        const data = await res.json();
        setTickets(data.docs || []);
        setPagination({
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSaveTicket = async (data: any) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      let res;
      if (ticketModal.ticket) {
        // Update
        res = await fetch(endpoints.tickets.update(ticketModal.ticket._id), {
          method: "PUT",
          headers,
          body: JSON.stringify(data),
        });
      } else {
        // Create
        res = await fetch(endpoints.tickets.create, {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        });
      }

      if (res.ok) {
        toast.success(
          `Ticket ${ticketModal.ticket ? "updated" : "created"} successfully`,
        );
        fetchTickets(pagination.page);
        setTicketModal((prev) => ({ ...prev, open: false }));
      } else {
        const err = await res.json();
        throw new Error(err.message || "Operation failed");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string | number) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const res = await fetch(endpoints.tickets.delete(String(id)), {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        toast.success("Ticket deleted successfully");
        fetchTickets(pagination.page);
        setDeleteModal((prev) => ({ ...prev, open: false }));
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete ticket");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      redeemed: "bg-success/20 text-success",
      active: "bg-success/20 text-success",
      expired: "bg-destructive/20 text-destructive",
    };
    return (
      styles[status?.toLowerCase()] || "bg-secondary text-secondary-foreground"
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Ticket Management</h3>
        <Button
          size="sm"
          variant="gradient"
          onClick={() => setTicketModal({ open: true, ticket: null })}
        >
          Add Ticket
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                ID
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                User
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Code
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Date
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr
                  key={ticket._id}
                  className="border-t border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4 font-mono text-sm">
                    {ticket._id.substring(0, 8)}...
                  </td>
                  <td className="p-4">
                    {ticket.redeemedBy?.fullName || "N/A"}
                  </td>
                  <td className="p-4 font-mono text-sm">{ticket.code}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        ticket.status,
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() =>
                          setViewModal({
                            open: true,
                            title: "Ticket Details",
                            data: ticket,
                          })
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setTicketModal({ open: true, ticket })}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() =>
                          setDeleteModal({
                            open: true,
                            title: "Ticket",
                            id: ticket._id,
                            type: "ticket",
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <PaginationControls
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => fetchTickets(page)}
        isLoading={loading}
      />

      <ViewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal((prev) => ({ ...prev, open }))}
        title={viewModal.title}
        data={viewModal.data}
      />
      <TicketModal
        open={ticketModal.open}
        onOpenChange={(open) => setTicketModal((prev) => ({ ...prev, open }))}
        ticket={ticketModal.ticket}
        onSave={handleSaveTicket}
      />
      <DeleteModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        title={deleteModal.title}
        itemId={deleteModal.id}
        onConfirm={handleDelete}
      />
    </div>
  );
};
