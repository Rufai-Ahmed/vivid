import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslation } from "react-i18next";
import vividstreamLogoDark from "@/assets/vividstream-logo-dark-mode.png";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { endpoints, apiFetch } from "@/config/api";

const SetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const logo = vividstreamLogoDark;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid link", {
        description: "Password reset token is missing from the URL.",
        duration: 4000,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("🔒 Password mismatch", {
        description: "Please make sure both passwords match",
        duration: 4000,
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.error("🔐 Password too short", {
        description: "Password must be at least 6 characters long",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiFetch(endpoints.auth.setPassword, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: formData.password }),
      });

      if (res.ok) {
        toast.success("🎉 Password set successfully!", {
          description: "You can now log in to your account.",
          duration: 3000,
        });
        navigate("/login");
      } else {
        const errorData = await res.json();
        toast.error("⚠️ Failed to set password", {
          description: errorData.message || "An error occurred.",
          duration: 4000,
        });
      }
    } catch (error) {
      toast.error("🚨 Unexpected error", {
        description: "Something went wrong. Please try again later",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
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
            Secure Your Account
          </h2>
          <p className="text-primary">
            Set up a secure password to access your dashboard and manage your
            tickets.
          </p>
        </div>
      </div>

      <div className="flex-1 lg:ml-[50%] h-screen overflow-y-auto flex flex-col justify-center px-8 py-12 lg:px-16 relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-lg mt-16">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Set Your Password</h1>
            <p className="text-muted-foreground">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Setting password..." : "Set Password"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Back to Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
