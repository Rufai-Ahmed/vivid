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

export const UsersTab = () => {
  const [users, setUsers] = useState<any[]>([]);
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
    type: "user",
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
    type: "user",
  });

  const fetchUsers = async (page = 1) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      setLoading(true);
      const res = await fetch(
        `${endpoints.auth.getAll}?page=${page}&limit=10`,
        { headers },
      );
      if (res.ok) {
        const data = await res.json();
        setUsers(data.docs || []);
        setPagination({
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
        toast.success("User updated successfully");
        setUsers((prev) =>
          prev.map((u) =>
            u._id === id || u.id === id ? { ...u, ...data } : u,
          ),
        );
        setEditModal((prev) => ({ ...prev, open: false }));
      } else {
        throw new Error("Failed to update user");
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
        toast.success("User deleted successfully");
        fetchUsers(pagination.page);
        setDeleteModal((prev) => ({ ...prev, open: false }));
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: "bg-success/20 text-success",
      suspended: "bg-destructive/20 text-destructive",
    };
    return (
      styles[status?.toLowerCase()] || "bg-secondary text-secondary-foreground"
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">User Management</h3>
        <Button size="sm" variant="gradient">
          Add User
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
                Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Wallet
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
              users.map((user) => (
                <tr
                  key={user.id || user._id}
                  className="border-t border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4 font-mono text-sm">
                    {user.id || user._id}
                  </td>
                  <td className="p-4">{user.name || user.fullName}</td>
                  <td className="p-4 text-muted-foreground">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        user.status,
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-primary">
                    {user.wallet || 0}
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
                            title: "User Details",
                            data: user,
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
                            title: "User",
                            data: user,
                            type: "user",
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
                            title: "User",
                            id: user.id || user._id,
                            type: "user",
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
        onPageChange={(page) => fetchUsers(page)}
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
        roleOptions={["user", "admin", "receptionist"]}
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
