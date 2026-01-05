import vividstreamLogoDark from "@/assets/vividstream-logo-dark-mode.png";
import vividstreamLogoLight from "@/assets/vividstream-logo-light-mode.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { Wallet, User, Settings, LogOut } from "lucide-react";
import { subNavItems } from "@/types/types";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const logo = theme === "light" ? vividstreamLogoLight : vividstreamLogoDark;

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card/50 backdrop-blur-sm hidden lg:block">
      <div className="p-6">
        <div className="flex items-center">
          <img src={logo} alt="Vividstream Pro" className="h-20 w-auto" />
        </div>

        <nav className="space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium"
          >
            <Wallet className="w-5 h-5" />
            Dashboard
          </Link>

          {/* Sublinks */}
          <div className="ml-4 pl-4 border-l border-border space-y-1">
            {subNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
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
  );
};

export default Sidebar;
