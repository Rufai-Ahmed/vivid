import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import vividstreamLogoDark from "@/assets/vividstream-logo-dark-mode.png";
import { Lock, Eye, EyeOff, ArrowRight, User, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated } = useAuth();
  const logo = vividstreamLogoDark;
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(
        formData.name,
        formData.email,
        formData.password
      );
      if (success) {
        toast.success("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Signup failed. Please try again.");
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
            Start Your Journey Today
          </h2>
          <p className="text-primary">
            Join thousands of users who trust Vividstream Pro for their event
            ticketing and travel needs.
          </p>
        </div>
      </div>

      {/* Right Side - Scrollable Form */}
      <div className="flex-1 lg:ml-[50%] h-screen overflow-y-auto flex flex-col justify-center px-8 py-12 lg:px-16 relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-lg ">
          <div className="mb-8 mt-40 lg:mt-16">
            <h1 className="text-3xl font-bold mb-2">Create an account</h1>
            <p className="text-muted-foreground">
              Get started with Vividstream Pro and unlock exclusive features.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="rounded border-border mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
              <ArrowRight className="w-5 h-5" />
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
