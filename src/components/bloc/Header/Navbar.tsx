import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu, X, LogOut, User } from "lucide-react";
import vividstreamLogoDark from "@/assets/vividstream-logo-dark-mode.png";
import vividstreamLogoLight from "@/assets/vividstream-logo-light-mode.png";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "react-i18next";

export function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme } = useTheme();

  const logo = theme === "light" ? vividstreamLogoLight : vividstreamLogoDark;

  // Public links (visible only when NOT authenticated)
  const publicLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/redeem-ticket", label: t("nav.redeemTicket") },
    { href: "/visa-application", label: t("nav.visaServices") },
    { href: "/hotels", label: t("nav.hotels") },
    { href: "/worldcup", label: t("nav.worldCup") },
  ];

  // Protected links (only visible when authenticated - no Home)
  const protectedLinks = [
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/about", label: t("nav.about") },
    { href: "/dashboard/redeem", label: t("nav.redeemTicket") },
    { href: "/dashboard/visa", label: t("nav.visaServices") },
    { href: "/dashboard/hotels", label: t("nav.hotels") },
    { href: "/dashboard/world-cup", label: t("nav.worldCup") },
  ];

  const navLinks = isAuthenticated ? protectedLinks : publicLinks;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/");
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center"
          >
            <img
              src={logo}
              alt="Vividstream Pro"
              className="h-20 w-32 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {user?.name || "Dashboard"}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t("nav.logout")}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t("nav.signIn")}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="gradient" size="sm">
                    {t("nav.getStarted")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-4 border-t border-border/50">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="ghost" className="w-full gap-2">
                        <User className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="flex-1 gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="ghost" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link
                      to="/signup"
                      className="flex-1"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="gradient" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
