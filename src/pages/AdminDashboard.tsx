/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
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
  Hotel,
} from "lucide-react";
import { endpoints } from "@/config/api";

import { HotelsTab } from "@/components/admin/tabs/HotelsTab";
import { TicketsTab } from "@/components/admin/tabs/TicketsTab";
import { BettingTab } from "@/components/admin/tabs/BettingTab";
import { VisaTab } from "@/components/admin/tabs/VisaTab";
import { PaymentsTab } from "@/components/admin/tabs/PaymentsTab";
import { UsersTab } from "@/components/admin/tabs/UsersTab";

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("tickets");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState<any>({});

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      try {
        const statsRes = await fetch(endpoints.admin.stats, { headers });
        if (statsRes.ok) setStatsData(await statsRes.json());
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        toast.error("Failed to load dashboard stats");
      }
    };

    fetchStats();
  }, [user]);

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
    { id: "hotels", label: "Hotels", icon: Hotel, tab: "hotels" },
    { id: "payments", label: "Payments", icon: CreditCard, tab: "payments" },
  ];

  const handleNavClick = (tab: string | null) => {
    if (tab) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
              <TabsTrigger value="hotels" className="rounded-lg">
                Hotels
              </TabsTrigger>
              <TabsTrigger value="payments" className="rounded-lg">
                Payments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tickets">
              <TicketsTab />
            </TabsContent>

            <TabsContent value="users">
              <UsersTab />
            </TabsContent>

            <TabsContent value="betting">
              <BettingTab />
            </TabsContent>

            <TabsContent value="visa">
              <VisaTab />
            </TabsContent>

            <TabsContent value="hotels">
              <HotelsTab />
            </TabsContent>

            <TabsContent value="payments">
              <PaymentsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
