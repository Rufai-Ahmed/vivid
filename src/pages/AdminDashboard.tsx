/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { ViewModal } from "@/components/admin/ViewModal";
import { EditModal } from "@/components/admin/EditModal";
import { DeleteModal } from "@/components/admin/DeleteModal";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { toast } from "sonner";
import {
  Ticket,
  Users,
  Trophy,
  Plane,
  CreditCard,
  BarChart3,
  Search,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { endpoints } from "@/config/api";

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("tickets");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Data states
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);
  const [visaApplications, setVisaApplications] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [statsData, setStatsData] = useState<any>({});

  // Pagination State
  const [pagination, setPagination] = useState({
    tickets: { page: 1, limit: 10, totalPages: 1 },
    users: { page: 1, limit: 10, totalPages: 1 },
    betting: { page: 1, limit: 10, totalPages: 1 },
    visa: { page: 1, limit: 10, totalPages: 1 },
    payments: { page: 1, limit: 10, totalPages: 1 },
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
    type: "",
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
    type: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      setLoading(true);
      // Parallel fetching
      const [
        statsRes,
        usersRes,
        ticketsRes,
        visaRes,
        predictionsRes,
        paymentsRes,
      ] = await Promise.all([
        fetch(endpoints.admin.stats, { headers }),
        fetch(endpoints.auth.getAll, { headers }),
        fetch(endpoints.tickets.getAll, { headers }),
        fetch(endpoints.visa.getAll, { headers }),
        fetch(endpoints.worldcup.getAllPredictions, { headers }),
        fetch(endpoints.hotels.getAllTransactions, { headers }),
      ]);

      if (statsRes.ok) setStatsData(await statsRes.json());

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.docs || []);
        setPagination((prev) => ({
          ...prev,
          users: {
            ...prev.users,
            page: data.page,
            totalPages: data.totalPages,
          },
        }));
      }

      if (ticketsRes.ok) {
        const data = await ticketsRes.json();
        setTickets(data.docs || []);
        setPagination((prev) => ({
          ...prev,
          tickets: {
            ...prev.tickets,
            page: data.page,
            totalPages: data.totalPages,
          },
        }));
      }

      if (visaRes.ok) {
        const data = await visaRes.json();
        setVisaApplications(data.docs || []);
        setPagination((prev) => ({
          ...prev,
          visa: { ...prev.visa, page: data.page, totalPages: data.totalPages },
        }));
      }

      if (predictionsRes.ok) {
        const data = await predictionsRes.json();
        setBets(data.docs || []);
        setPagination((prev) => ({
          ...prev,
          betting: {
            ...prev.betting,
            page: data.page,
            totalPages: data.totalPages,
          },
        }));
      }

      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data.docs || []);
        setPagination((prev) => ({
          ...prev,
          payments: {
            ...prev.payments,
            page: data.page,
            totalPages: data.totalPages,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const stats = [
    {
      title: "Total Users",
      value: statsData.totalUsers?.toLocaleString() || "0",
      change: "+0%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Tickets Redeemed",
      value: statsData.tickets?.redeemed?.toLocaleString() || "0",
      change: "+0%",
      trend: "up",
      icon: Ticket,
    },
    {
      title: "Visa Applications",
      value: statsData.visa?.total?.toLocaleString() || "0",
      change: "+0%",
      trend: "up",
      icon: Plane,
    },
    {
      title: "Revenue",
      value: `$${statsData.financials?.totalRevenue?.toLocaleString() || "0"}`,
      change: "0%",
      trend: "neutral",
      icon: CreditCard,
    },
  ];

  const sidebarLinks = [
    { id: "analytics", label: "Analytics", icon: BarChart3, tab: null },
    { id: "tickets", label: "Tickets", icon: Ticket, tab: "tickets" },
    { id: "users", label: "Users", icon: Users, tab: "users" },
    { id: "betting", label: "Betting", icon: Trophy, tab: "betting" },
    { id: "visa", label: "Visa Reviews", icon: Plane, tab: "visa" },
    { id: "payments", label: "Payments", icon: CreditCard, tab: "payments" },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      redeemed: "bg-success/20 text-success",
      pending: "bg-warning/20 text-warning",
      expired: "bg-destructive/20 text-destructive",
      active: "bg-success/20 text-success",
      suspended: "bg-destructive/20 text-destructive",
      open: "bg-info/20 text-info",
      won: "bg-success/20 text-success",
      lost: "bg-destructive/20 text-destructive",
      approved: "bg-success/20 text-success",
      rejected: "bg-destructive/20 text-destructive",
      completed: "bg-success/20 text-success",
    };
    return (
      styles[status?.toLowerCase()] || "bg-secondary text-secondary-foreground"
    );
  };

  const handleNavClick = (tab: string | null) => {
    if (tab) {
      setActiveTab(tab);
    }
  };

  // View handlers
  const handleView = (title: string, data: Record<string, string>) => {
    setViewModal({ open: true, title, data });
  };

  // Edit handlers
  const handleEdit = (
    title: string,
    data: Record<string, string>,
    type: string
  ) => {
    setEditModal({ open: true, title, data, type });
  };

  const handleSaveEdit = async (updatedData: Record<string, string>) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      let response;
      const id = updatedData.id || updatedData._id;

      switch (editModal.type) {
        case "user":
          response = await fetch(endpoints.auth.update(id), {
            method: "PUT",
            headers,
            body: JSON.stringify(updatedData),
          });
          break;
        case "visa":
          response = await fetch(endpoints.visa.update(id), {
            method: "PUT",
            headers,
            body: JSON.stringify(updatedData),
          });
          break;
        default:
          // For other types not yet implemented on backend, just update local state for now
          // or show a message. Keeping local update for 'bet'/'ticket'/'payment' as fallback
          // or just return to avoid false success.
          // For now, let's keep the local update behavior for non-implemented types to avoid breaking UI
          // but arguably we should block it. Given the instruction, I'll focus on implemented ones.
          toast.info("Edit not supported for this item type on backend yet.");
          return;
      }

      if (response && response.ok) {
        const data = await response.json();
        toast.success(`${editModal.title} updated successfully`);

        // Update local state with response data
        switch (editModal.type) {
          case "user":
            setUsers((prev) =>
              prev.map((u) =>
                u.id === id || u._id === id ? { ...u, ...data } : u
              )
            );
            break;
          case "visa":
            setVisaApplications((prev) =>
              prev.map((v) => (v._id === id ? { ...v, ...data } : v))
            );
            break;
        }
        setEditModal((prev) => ({ ...prev, open: false }));
      } else {
        const err = await response?.json();
        throw new Error(err?.message || "Failed to update");
      }
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error.message);
    }
  };

  // Delete handlers
  const handleDelete = (title: string, id: string | number, type: string) => {
    setDeleteModal({ open: true, title, id, type });
  };

  const handleConfirmDelete = async (id: string | number) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      let response;
      const idStr = String(id);

      switch (deleteModal.type) {
        case "ticket":
          response = await fetch(endpoints.tickets.delete(idStr), {
            method: "DELETE",
            headers,
          });
          break;
        case "user":
          response = await fetch(endpoints.auth.delete(idStr), {
            method: "DELETE",
            headers,
          });
          break;
        case "visa":
          response = await fetch(endpoints.visa.delete(idStr), {
            method: "DELETE",
            headers,
          });
          break;
        default:
          toast.info("Delete not supported for this item type on backend yet.");
          return;
      }

      if (response && response.ok) {
        toast.success(`${deleteModal.title} deleted successfully`);

        // Update local state
        switch (deleteModal.type) {
          case "ticket":
            setTickets((prev) =>
              prev.filter((t) => t.id !== id && t._id !== id)
            );
            break;
          case "user":
            setUsers((prev) => prev.filter((u) => u.id !== id && u._id !== id));
            break;
          case "visa":
            setVisaApplications((prev) =>
              prev.filter((v) => v.id !== id && v._id !== id)
            );
            break;
        }
        setDeleteModal((prev) => ({ ...prev, open: false }));
      } else {
        const err = await response?.json();
        throw new Error(err?.message || "Failed to delete");
      }
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error(error.message);
    }
  };

  // Handle Page Change
  const handlePageChange = async (section: string, page: number) => {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      let url = "";
      switch (section) {
        case "tickets":
          url = `${endpoints.tickets.getAll}?page=${page}&limit=10`;
          break;
        case "users":
          url = `${endpoints.auth.getAll}?page=${page}&limit=10`;
          break;
        case "betting":
          url = `${endpoints.worldcup.getAllPredictions}?page=${page}&limit=10`;
          break;
        case "visa":
          url = `${endpoints.visa.getAll}?page=${page}&limit=10`;
          break;
        case "payments":
          url = `${endpoints.hotels.getAllTransactions}?page=${page}&limit=10`;
          break;
      }

      if (url) {
        const res = await fetch(url, { headers });
        if (res.ok) {
          const data = await res.json();
          // Update data state
          switch (section) {
            case "tickets":
              setTickets(data.docs || []);
              break;
            case "users":
              setUsers(data.docs || []);
              break;
            case "betting":
              setBets(data.docs || []);
              break;
            case "visa":
              setVisaApplications(data.docs || []);
              break;
            case "payments":
              setPayments(data.docs || []);
              break;
          }
          // Update pagination state
          setPagination((prev) => ({
            ...prev,
            [section]: {
              ...prev[section as keyof typeof pagination],
              page: data.page,
              totalPages: data.totalPages,
            },
          }));
        }
      }
    } catch (error) {
      console.error(`Error fetching ${section} data:`, error);
      toast.error(`Failed to load ${section} data`);
    }
  };

  // Get status options based on type
  const getStatusOptions = (type: string) => {
    switch (type) {
      case "ticket":
        return ["Redeemed", "Pending", "Expired"];
      case "user":
        return ["Active", "Suspended"];
      case "bet":
        return ["Open", "Won", "Lost"];
      case "visa":
        return ["Under Review", "Approved", "Pending Documents", "Rejected"];
      case "payment":
        return ["Completed", "Pending", "Failed"];
      default:
        return ["Active", "Pending", "Completed"];
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Modals */}
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
        statusOptions={getStatusOptions(editModal.type)}
      />
      <DeleteModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        title={deleteModal.title}
        itemId={deleteModal.id}
        onConfirm={handleConfirmDelete}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card/50 backdrop-blur-sm hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold">Admin</span>
          </div>

          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  link.tab === activeTab ||
                  (link.id === "analytics" && !activeTab)
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="flex-1">
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="flex-1"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-8 pb-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-1">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor and manage your platform.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <ThemeToggle />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl border border-border bg-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">
                    {stat.title}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change} from last month
                </div>
              </div>
            ))}
          </div>

          {/* Tabs for Different Sections */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="bg-secondary/50 p-1 rounded-xl">
              <TabsTrigger value="tickets" className="rounded-lg">
                Tickets
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg">
                Users
              </TabsTrigger>
              <TabsTrigger value="betting" className="rounded-lg">
                Betting
              </TabsTrigger>
              <TabsTrigger value="visa" className="rounded-lg">
                Visa
              </TabsTrigger>
              <TabsTrigger value="payments" className="rounded-lg">
                Payments
              </TabsTrigger>
            </TabsList>

            {/* Tickets Tab */}
            <TabsContent value="tickets">
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
                      {tickets.map((ticket) => (
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
                          <td className="p-4 font-mono text-sm">
                            {ticket.code}
                          </td>
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
                                  handleView("Ticket Details", ticket)
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleEdit("Ticket", ticket, "ticket")
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive"
                                onClick={() =>
                                  handleDelete("Ticket", ticket._id, "ticket")
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={pagination.tickets.page}
                  totalPages={pagination.tickets.totalPages}
                  onPageChange={(page) => handlePageChange("tickets", page)}
                  isLoading={false}
                />
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
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
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t border-border hover:bg-secondary/30 transition-colors"
                        >
                          <td className="p-4 font-mono text-sm">{user.id}</td>
                          <td className="p-4">{user.name}</td>
                          <td className="p-4 text-muted-foreground">
                            {user.email}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                user.status
                              )}`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-primary">
                            {user.wallet}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => handleView("User Details", user)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => handleEdit("User", user, "user")}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive"
                                onClick={() =>
                                  handleDelete("User", user.id, "user")
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={pagination.users.page}
                  totalPages={pagination.users.totalPages}
                  onPageChange={(page) => handlePageChange("users", page)}
                  isLoading={false}
                />
              </div>
            </TabsContent>

            {/* Betting Tab */}
            <TabsContent value="betting">
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
                      {bets.map((bet) => (
                        <tr
                          key={bet._id}
                          className="border-t border-border hover:bg-secondary/30 transition-colors"
                        >
                          <td className="p-4 font-mono text-sm">
                            {bet._id.substring(0, 8)}...
                          </td>
                          <td className="p-4">{bet.user?.fullName}</td>
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
                                onClick={() => handleView("Bet Details", bet)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => handleEdit("Bet", bet, "bet")}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={pagination.betting.page}
                  totalPages={pagination.betting.totalPages}
                  onPageChange={(page) => handlePageChange("betting", page)}
                  isLoading={false}
                />
              </div>
            </TabsContent>

            {/* Visa Tab */}
            <TabsContent value="visa">
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold">Visa Application Reviews</h3>
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
                          Destination
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Submitted
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visaApplications.map((visa) => (
                        <tr
                          key={visa._id}
                          className="border-t border-border hover:bg-secondary/30 transition-colors"
                        >
                          <td className="p-4 font-mono text-sm">
                            {visa._id.substring(0, 8)}...
                          </td>
                          <td className="p-4">
                            {visa.firstName} {visa.lastName}
                          </td>
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
                          <td className="p-4 text-muted-foreground">
                            {new Date(visa.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleView("Visa Application Details", visa)
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive"
                                onClick={() =>
                                  handleDelete(
                                    "Visa Application",
                                    visa._id,
                                    "visa"
                                  )
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={pagination.visa.page}
                  totalPages={pagination.visa.totalPages}
                  onPageChange={(page) => handlePageChange("visa", page)}
                  isLoading={false}
                />
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments">
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
                      {payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-t border-border hover:bg-secondary/30 transition-colors"
                        >
                          <td className="p-4 font-mono text-sm">
                            {payment.id}
                          </td>
                          <td className="p-4">{payment.user}</td>
                          <td className="p-4 font-medium text-primary">
                            {payment.amount}
                          </td>
                          <td className="p-4">{payment.method}</td>
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
                            {payment.date}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleView("Payment Details", payment)
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationControls
                  currentPage={pagination.payments.page}
                  totalPages={pagination.payments.totalPages}
                  onPageChange={(page) => handlePageChange("payments", page)}
                  isLoading={false}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
