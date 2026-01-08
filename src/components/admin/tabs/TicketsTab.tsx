/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { ViewModal } from "@/components/admin/ViewModal";
import { EditModal } from "@/components/admin/EditModal";
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
  const [editModal, setEditModal] = useState<{
    open: boolean;
    title: string;
    data: Record<string, any> | null;
    type: string;
  }>({
    open: false,
    title: "",
    data: null,
    type: "ticket",
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
        { headers }
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

  const handleSaveEdit = async (updatedData: Record<string, any>) => {
    // Ticket update is not fully implemented in backend in this session,
    // but we will keep the local state update for now or implement if needed.
    // For now, mirroring previous behavior (local update) as strict backend update for tickets wasn't explicitly requested/implemented in previous turn (only delete).
    // Wait, I see I only added deleteTicket. So edit is likely local or not supported.
    // I will leave it as local state update to avoid breaking UI flow, or just log it.
    // Actually, let's keep it consistent with AdminDashboard logic which had setTickets.
    setTickets((prev) =>
      prev.map((t) =>
        t._id === updatedData._id || t.id === updatedData.id
          ? { ...t, ...updatedData }
          : t
      )
    );
    setEditModal((prev) => ({ ...prev, open: false }));
    toast.success("Ticket updated locally (Backend not connected for Edit)");
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
        <Button size="sm" variant="gradient">
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
                        ticket.status
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
                        onClick={() =>
                          setEditModal({
                            open: true,
                            title: "Ticket",
                            data: ticket,
                            type: "ticket",
                          })
                        }
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
      <EditModal
        open={editModal.open}
        onOpenChange={(open) => setEditModal((prev) => ({ ...prev, open }))}
        title={editModal.title}
        data={editModal.data}
        onSave={handleSaveEdit}
        statusOptions={["Redeemed", "Pending", "Expired"]}
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
