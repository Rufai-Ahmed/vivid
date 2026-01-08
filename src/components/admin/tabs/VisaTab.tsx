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

export const VisaTab = () => {
  const [visaApplications, setVisaApplications] = useState<any[]>([]);
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
  }>({ open: false, title: "", data: null, type: "visa" });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    title: string;
    id: any;
    type: string;
  }>({ open: false, title: "", id: null, type: "visa" });

  const fetchVisa = async (page = 1) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      setLoading(true);
      const res = await fetch(
        `${endpoints.visa.getAll}?page=${page}&limit=10`,
        { headers }
      );
      if (res.ok) {
        const data = await res.json();
        setVisaApplications(data.docs || []);
        setPagination({
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      toast.error("Failed to load visa applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisa();
  }, []);

  const handleSaveEdit = async (updatedData: any) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    try {
      const id = updatedData.id || updatedData._id;
      const res = await fetch(endpoints.visa.update(id), {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        const data = await res.json();
        setVisaApplications((prev) =>
          prev.map((v) => (v._id === id || v.id === id ? { ...v, ...data } : v))
        );
        setEditModal((prev) => ({ ...prev, open: false }));
        toast.success("Visa application updated");
      } else {
        throw new Error("Update failed");
      }
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: any) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await fetch(endpoints.visa.delete(String(id)), {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        setVisaApplications((prev) =>
          prev.filter((v) => v._id !== id && v.id !== id)
        );
        setDeleteModal((prev) => ({ ...prev, open: false }));
        toast.success("Visa application deleted");
        fetchVisa(pagination.page);
      } else {
        throw new Error("Delete failed");
      }
    } catch (e) {
      toast.error("Delete failed");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-success/20 text-success",
      rejected: "bg-destructive/20 text-destructive",
      pending: "bg-warning/20 text-warning",
    };
    return (
      styles[status?.toLowerCase()] || "bg-secondary text-secondary-foreground"
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Visa Management</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                ID
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Passport
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Country
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
                <td colSpan={6} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              visaApplications.map((visa) => (
                <tr
                  key={visa._id}
                  className="border-t border-border hover:bg-secondary/30"
                >
                  <td className="p-4 font-mono text-sm">
                    {visa._id.substring(0, 8)}...
                  </td>
                  <td className="p-4">
                    {visa.firstName} {visa.lastName}
                  </td>
                  <td className="p-4">{visa.passportNumber}</td>
                  <td className="p-4">{visa.destinationCountry}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        visa.status
                      )}`}
                    >
                      {visa.status}
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
                            title: "Visa Details",
                            data: visa,
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
                            title: "Visa",
                            data: visa,
                            type: "visa",
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
                            title: "Visa",
                            id: visa._id,
                            type: "visa",
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
        onPageChange={(page) => fetchVisa(page)}
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
        statusOptions={["pending", "approved", "rejected"]}
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
