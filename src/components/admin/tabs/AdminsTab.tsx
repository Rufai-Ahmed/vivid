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

export const AdminsTab = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

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
    type: "admin",
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
    type: "admin",
  });

  const fetchAdmins = async (page = 1) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      setLoading(true);
      const res = await fetch(
        `${endpoints.admin.getAdmins}?page=${page}&limit=10`,
        {
          headers,
        },
      );
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.docs || []);
        setPagination({
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSaveEdit = async (updatedData: Record<string, any>) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const id = updatedData.id || updatedData._id;
      const response = await fetch(endpoints.auth.update(id), {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Admin updated successfully");
        setAdmins((prev) =>
          prev.map((u) =>
            u._id === id || u.id === id ? { ...u, ...data } : u,
          ),
        );
        setEditModal((prev) => ({ ...prev, open: false }));
      } else {
        throw new Error("Failed to update admin");
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
      const res = await fetch(endpoints.auth.delete(String(id)), {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        toast.success("Admin deleted successfully");
        fetchAdmins(pagination.page);
        setDeleteModal((prev) => ({ ...prev, open: false }));
      } else {
        throw new Error("Failed to delete admin");
      }
    } catch (error) {
      toast.error("Failed to delete admin");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Admin Management</h3>
        <Button size="sm" variant="gradient">
          Add Admin
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
                Name
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Email
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr
                  key={admin.id || admin._id}
                  className="border-t border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4 font-mono text-sm">
                    {admin.id || admin._id}
                  </td>
                  <td className="p-4">{admin.name || admin.fullName}</td>
                  <td className="p-4 text-muted-foreground">{admin.email}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() =>
                          setViewModal({
                            open: true,
                            title: "Admin Details",
                            data: admin,
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
                            title: "Admin",
                            data: admin,
                            type: "admin",
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
                            title: "Admin",
                            id: admin.id || admin._id,
                            type: "admin",
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
        onPageChange={(page) => fetchAdmins(page)}
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
        statusOptions={["active", "suspended"]}
        roleOptions={["user", "admin"]}
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
