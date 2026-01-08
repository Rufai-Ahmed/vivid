/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { ViewModal } from "@/components/admin/ViewModal";
import { EditModal } from "@/components/admin/EditModal";
import { DeleteModal } from "@/components/admin/DeleteModal";
import { endpoints } from "@/config/api";
import { toast } from "sonner";
import { Eye, Edit, Trash2 } from "lucide-react";

export const BettingTab = () => {
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [viewModal, setViewModal] = useState<{
    open: boolean;
    title: string;
    data: any;
  }>({ open: false, title: "", data: null });
  const [editModal, setEditModal] = useState<{
    open: boolean;
    title: string;
    data: any;
    type: string;
  }>({ open: false, title: "", data: null, type: "bet" });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    title: string;
    id: any;
    type: string;
  }>({ open: false, title: "", id: null, type: "bet" });

  const fetchBets = async (page = 1) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      setLoading(true);
      const res = await fetch(
        `${endpoints.worldcup.getAllPredictions}?page=${page}&limit=10`,
        { headers }
      );
      if (res.ok) {
        const data = await res.json();
        setBets(data.docs || []);
        setPagination({
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      toast.error("Failed to load bets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
  }, []);

  const handleSaveEdit = (updatedData: any) => {
    // Logic for editing bets is not backend-implemented, keeping local
    setBets((prev) =>
      prev.map((b) =>
        b._id === updatedData._id ? { ...b, ...updatedData } : b
      )
    );
    setEditModal((prev) => ({ ...prev, open: false }));
    toast.success("Bet updated locally");
  };

  const handleDelete = (id: any) => {
    // Logic for deleting bets is not backend-implemented, keeping local
    setBets((prev) => prev.filter((b) => b._id !== id));
    setDeleteModal((prev) => ({ ...prev, open: false }));
    toast.success("Bet deleted locally");
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      open: "bg-info/20 text-info",
      won: "bg-success/20 text-success",
      lost: "bg-destructive/20 text-destructive",
    };
    return (
      styles[status?.toLowerCase()] || "bg-secondary text-secondary-foreground"
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Betting Management</h3>
        <Button size="sm" variant="gradient">
          Add Match
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
                Match
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Prediction
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Stake
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Status
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
              bets.map((bet) => (
                <tr
                  key={bet._id}
                  className="border-t border-border hover:bg-secondary/30"
                >
                  <td className="p-4 font-mono text-sm">
                    {bet._id.substring(0, 8)}...
                  </td>
                  <td className="p-4">
                    {bet.user?.fullName || bet.user?.name}
                  </td>
                  <td className="p-4">
                    {bet.match
                      ? `${bet.match.teamA} vs ${bet.match.teamB}`
                      : "N/A"}
                  </td>
                  <td className="p-4">{bet.predictedWinner}</td>
                  <td className="p-4 font-medium text-primary">
                    {bet.wagerAmount}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        bet.status
                      )}`}
                    >
                      {bet.status}
                    </span>
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
                            title: "Bet Details",
                            data: bet,
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
                            title: "Bet",
                            data: bet,
                            type: "bet",
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
                            title: "Bet",
                            id: bet._id,
                            type: "bet",
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
        onPageChange={(page) => fetchBets(page)}
        isLoading={loading}
      />
      <ViewModal
        open={viewModal.open}
        onOpenChange={(o) => setViewModal((p) => ({ ...p, open: o }))}
        title={viewModal.title}
        data={viewModal.data}
      />
      <EditModal
        open={editModal.open}
        onOpenChange={(o) => setEditModal((p) => ({ ...p, open: o }))}
        title={editModal.title}
        data={editModal.data}
        onSave={handleSaveEdit}
        statusOptions={["Open", "Won", "Lost"]}
      />
      <DeleteModal
        open={deleteModal.open}
        onOpenChange={(o) => setDeleteModal((p) => ({ ...p, open: o }))}
        title={deleteModal.title}
        itemId={deleteModal.id}
        onConfirm={handleDelete}
      />
    </div>
  );
};
