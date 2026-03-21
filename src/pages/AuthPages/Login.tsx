import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "react-i18next";
import vividstreamLogoDark from "@/assets/vividstream-logo-dark-mode.png";
import vividstreamLogoLight from "@/assets/vividstream-logo-light-mode.png";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  // Get the redirect path from state, default to dashboard
  const from = (location.state as { from?: string })?.from || "/dashboard";
  const { theme } = useTheme();
  const logo = theme === "light" ? vividstreamLogoLight : vividstreamLogoDark;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Clear errors when user starts typing
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Client-side validation
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) newErrors.email = t("login.errors.emailRequired");
    if (!formData.password)
      newErrors.password = t("login.errors.passwordRequired");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      toast.error("⚠️ " + t("common.fillRequired"), {
        description: t("common.checkFields"),
        duration: 3000,
      });
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success("🎉 " + t("login.toast.welcomeBack"), {
          description: t("login.toast.loginSuccess"),
          duration: 2000,
        });
        navigate(from, { replace: true });
      } else {
        // Enhanced error messages with icons and better descriptions
        const errorMessage = result.error || "Login failed";

        if (errorMessage.includes("Invalid credentials")) {
          setErrors({ password: t("login.errors.incorrectPassword") });
          toast.error("❌ " + t("login.toast.invalidCredentials"), {
            description: t("login.toast.invalidCredentialsDesc"),
            duration: 4000,
          });
        } else if (errorMessage.includes("don't have an account")) {
          setErrors({ email: t("login.errors.noAccountFound") });
          toast.error("👤 " + t("login.toast.accountNotFound"), {
            description: t("login.toast.noAccountExists"),
            duration: 4000,
            action: {
              label: t("login.signUp"),
              onClick: () => navigate("/signup"),
            },
          });
        } else if (errorMessage.includes("stadium ticket first")) {
          toast.error("🎟️ " + t("login.toast.ticketRequired"), {
            description: t("login.toast.ticketRequiredDesc"),
            duration: 4000,
            action: {
              label: t("login.toast.getTicket"),
              onClick: () => navigate("/"),
            },
          });
          setTimeout(() => navigate("/"), 2000);
        } else if (errorMessage.includes("Network")) {
          toast.error("🌐 " + t("login.toast.connectionError"), {
            description: t("login.toast.checkConnection"),
            duration: 4000,
          });
        } else {
          toast.error("⚠️ " + t("login.toast.loginFailed"), {
            description: errorMessage,
            duration: 4000,
          });
        }
      }
    } catch (error) {
      toast.error("🚨 " + t("login.toast.unexpectedError"), {
        description: t("login.toast.somethingWrong"),
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-9 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {" "}
              <h1 className="text-3xl font-bold ">{t("login.title")}</h1>
              <div className="absolute top-8 right-10 lg:right-0">
                <ThemeToggle />
              </div>
              <Link
                to="/"
                className="hidden lg:block bg-[#00A987] py-1 px-2 rounded-md items-center gap-2"
              >
                <h2 className="text-sm text-secondary font-bold ">
                  {t("login.backToHome")}
                </h2>
              </Link>
            </div>
            <p className="text-muted-foreground">{t("login.subtitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`pl-10 ${
                    errors.email ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠️</span> {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className={`pl-10 pr-10 ${
                    errors.password ? "border-red-500 focus:border-red-500" : ""
                  }`}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span>⚠️</span> {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm text-muted-foreground">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative z-10 text-center max-w-md">
          <Link to="/" className="flex items-center justify-center">
            <div className="w-48 h-24 rounded-3xl flex items-center justify-center animate-pulse-slow">
              <img src={logo} alt="Vividstream Pro" className="h-36 w-40" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-foreground ">
            Your Ticket to the World
          </h2>
          <p className="text-muted-foreground">
            Access exclusive events, manage your visa applications, and book
            premium accommodations all in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
