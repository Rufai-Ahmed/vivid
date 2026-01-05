import { ChatWidget } from "@/components/ChatWidget";
import Sidebar from "./DashboardPages/SideBar/Sidebar";
import MobileHeader from "./DashboardPages/MobileHeader/MobileHeader";
import DashboardHeader from "./DashboardPages/DashBoardHeader/DashboardHeader";
import StatusCards from "./DashboardPages/StatusCards/StatusCards";
import ContentGrid from "./DashboardPages/ContentGrid/ContentGrid";
import QuickActions from "./DashboardPages/QuickActions/QuickActions";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-8 pb-8 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <DashboardHeader />

          {/* Status Cards */}
          <StatusCards />

          {/* Content Grid */}
          <ContentGrid />

          {/* Quick Actions - Hidden on mobile (available in sidebar) */}
          <QuickActions />
        </div>
      </main>

      <ChatWidget />
    </div>
  );
};

export default Dashboard;
