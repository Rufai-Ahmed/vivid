import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslation } from "react-i18next";
import vividstreamLogoDark from "@/assets/vividstream-logo-dark-mode.png";
import { Lock, Eye, EyeOff, ArrowRight, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isAuthenticated } = useAuth();

  // Get the redirect path from state, default to dashboard
  const from = (location.state as { from?: string })?.from || "/dashboard";
  const logo = vividstreamLogoDark;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("🔒 " + t("signup.toast.passwordMismatch"), {
        description: t("signup.errors.passwordMismatch"),
        duration: 4000,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.error("🔐 " + t("signup.errors.passwordMin"), {
        description: t("signup.errors.passwordMin"),
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(
        formData.name,
        formData.email,
        formData.password,
      );
      if (result.success) {
        toast.success("🎉 Account created successfully!", {
          description:
            "Welcome to Vividstream Pro! Redirecting to dashboard...",
          duration: 3000,
        });
        navigate(from, { replace: true });
      } else {
        // Enhanced error messages with icons and better descriptions
        const errorMessage = result.error || "Signup failed";
        // let description = "Please check your information and try again";

        if (errorMessage.includes("already exists")) {
          toast.error("👤 Email already registered", {
            description: "An account with this email already exists",
            duration: 4000,
            action: {
              label: "Login instead",
              onClick: () => navigate("/login"),
            },
          });
        } else if (errorMessage.includes("required")) {
          toast.error("📝 Missing information", {
            description: "Please fill in all required fields",
            duration: 4000,
          });
        } else if (errorMessage.includes("Network")) {
          toast.error("🌐 " + t("login.toast.connectionError"), {
            description: t("login.toast.checkConnection"),
            duration: 4000,
          });
        } else {
          toast.error("⚠️ " + t("signup.toast.registrationFailed"), {
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
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Fixed Visual */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-1/2 gradient-hero items-center justify-center p-16 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative z-10 text-center max-w-md">
          <Link to="/" className="flex items-center justify-center">
            <div className="w-48 h-24 rounded-3xl flex items-center justify-center animate-pulse-slow">
              <img src={logo} alt="Vividstream Pro" className="h-36 w-40" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-primary-foreground mb-2">
            {t("signup.startJourney")}
          </h2>
          <p className="text-primary">{t("signup.joinUsers")}</p>
        </div>
      </div>

      {/* Right Side - Scrollable Form */}
      <div className="flex-1 lg:ml-[50%] h-screen overflow-y-auto flex flex-col justify-center px-8 py-12 lg:px-16 relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-lg ">
          <div className="mb-8 mt-40 lg:mt-16">
            <h1 className="text-3xl font-bold mb-2">{t("signup.getTicket")}</h1>
            <p className="text-muted-foreground">
              {t("signup.ticketRequired")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">{t("signup.name")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder={t("signup.namePlaceholder")}
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("signup.email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={t("signup.emailPlaceholder")}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("signup.password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("signup.passwordPlaceholder")}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("signup.confirmPassword")}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("signup.confirmPasswordPlaceholder")}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="pl-10"
                  required
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {t("signup.creating")}
                </>
              ) : (
                <>
                  {t("signup.submit")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
