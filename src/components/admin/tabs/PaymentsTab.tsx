/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { ViewModal } from "@/components/admin/ViewModal";
import { DeleteModal } from "@/components/admin/DeleteModal";
import { endpoints } from "@/config/api";
import { toast } from "sonner";
import { Eye, Trash2 } from "lucide-react";

export const PaymentsTab = () => {
  const [payments, setPayments] = useState<any[]>([]);
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
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    title: string;
    id: any;
    type: string;
  }>({ open: false, title: "", id: null, type: "payment" });

  const fetchPayments = async (page = 1) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      setLoading(true);
      const res = await fetch(
        `${endpoints.hotels.getAllTransactions}?page=${page}&limit=10`,
        { headers }
      );
      if (res.ok) {
        const data = await res.json();
        setPayments(data.docs || []);
        setPagination({
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleDelete = (id: any) => {
    // Logic for deleting payments is not backend-implemented, keeping local
    setPayments((prev) => prev.filter((p) => p._id !== id));
    setDeleteModal((prev) => ({ ...prev, open: false }));
    toast.success("Payment deleted locally");
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: "bg-success/20 text-success",
      pending: "bg-warning/20 text-warning",
      failed: "bg-destructive/20 text-destructive",
    };
    return (
      styles[status?.toLowerCase()] || "bg-secondary text-secondary-foreground"
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Payment Transactions</h3>
        <Button size="sm" variant="gradient">
          Export
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
                Amount
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Method
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
                <td colSpan={7} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="border-t border-border hover:bg-secondary/30"
                >
                  <td className="p-4 font-mono text-sm">
                    {payment._id.substring(0, 8)}...
                  </td>
                  <td className="p-4">
                    {payment.user?.fullName || payment.user?.name || "N/A"}
                  </td>
                  <td className="p-4 font-medium">${payment.amount}</td>
                  <td className="p-4 capitalize">{payment.paymentMethod}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleDateString()}
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
                            title: "Payment Details",
                            data: payment,
                          })
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() =>
                          setDeleteModal({
                            open: true,
                            title: "Payment",
                            id: payment._id,
                            type: "payment",
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
        onPageChange={(page) => fetchPayments(page)}
        isLoading={loading}
      />
      <ViewModal
        open={viewModal.open}
        onOpenChange={(o) => setViewModal((p) => ({ ...p, open: o }))}
        title={viewModal.title}
        data={viewModal.data}
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
