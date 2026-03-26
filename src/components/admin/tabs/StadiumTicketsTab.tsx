/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { ViewModal } from "@/components/admin/ViewModal";
import { DeleteModal } from "@/components/admin/DeleteModal";
import { endpoints, apiFetch } from "@/config/api";
import { toast } from "sonner";
import { Eye, Edit, Trash2, Upload } from "lucide-react";
import { StadiumTicketModal } from "../modals/StadiumTicketModal";

export const StadiumTicketsTab = () => {
  const navigate = useNavigate();
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
    type: "stadium ticket",
  });

  const fetchTickets = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiFetch(
        `${endpoints.tickets.stadium.all}?page=${page}&limit=10`,
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
      console.error("Error fetching stadium tickets:", error);
      toast.error("Failed to load stadium tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSaveTicket = async (data: any) => {
    try {
      let res;
      if (ticketModal.ticket) {
        // Update
        res = await apiFetch(
          endpoints.tickets.stadium.update(ticketModal.ticket._id),
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          },
        );
      } else {
        // Create
        res = await apiFetch(endpoints.tickets.stadium.create, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }

      if (res.ok) {
        toast.success(
          `Stadium ticket ${ticketModal.ticket ? "updated" : "created"} successfully`,
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
    try {
      const res = await apiFetch(endpoints.tickets.stadium.delete(String(id)), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        toast.success("Stadium ticket deleted successfully");
        fetchTickets(pagination.page);
        setDeleteModal((prev) => ({ ...prev, open: false }));
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete stadium ticket");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Stadium Tickets Management</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/admin/bulk-tickets")}
          >
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button
            size="sm"
            variant="gradient"
            onClick={() => setTicketModal({ open: true, ticket: null })}
          >
            Add Listing
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Section & Row
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Cat
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Price
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Availability
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Address
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Tag
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
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
                    {ticket.section} - Row {ticket.row}
                  </td>
                  <td className="p-4 font-mono text-sm">{ticket.category}</td>
                  <td className="p-4 font-mono text-sm">${ticket.price}</td>
                  <td className="p-4 font-mono text-sm">
                    {ticket.ticketsAvailable} tickets
                  </td>
                  <td className="p-4 font-mono text-sm">
                    {ticket.address || "-"}
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {ticket.tag || "-"}
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
                            title: "Listing Details",
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
                            title: "Listing",
                            id: ticket._id,
                            type: "listing",
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
      <StadiumTicketModal
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
