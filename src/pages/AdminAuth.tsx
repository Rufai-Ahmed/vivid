import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Eye, EyeOff, Shield, Lock, Mail, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoLight from "@/assets/vividstream-logo-light-mode.png";
import logoDark from "@/assets/vividstream-logo-dark-mode.png";

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { toast } = useToast();

  const logo = theme === "dark" ? logoDark : logoLight;

  // Redirect if already authenticated as admin
  if (isAuthenticated && user?.isAdmin) {
    navigate("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin code validation (in production, this should be server-side)
    const validAdminCode = "ADMIN2024";

    if (adminCode !== validAdminCode) {
      toast({
        title: "Invalid Admin Code",
        description: "Please enter a valid administrator access code.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      let success: boolean;

      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await signup(name, email, password, "admin");
      }

      if (success) {
        toast({
          title: isLogin ? "Welcome back, Admin!" : "Admin account created!",
          description: "Redirecting to admin dashboard...",
        });
        navigate("/admin");
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-destructive/20 via-primary/10 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--destructive)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--primary)/0.1),transparent_50%)]" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="mb-8">
            <img src={logo} alt="Vividstream Pro" className="h-16 w-auto" />
          </div>

          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Admin Portal
            </h2>
            <p className="text-muted-foreground text-lg">
              Secure access to platform management, analytics, and
              administrative controls.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 text-center">
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-2xl font-bold text-foreground">Full</div>
              <div className="text-sm text-muted-foreground">
                Platform Control
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="text-2xl font-bold text-foreground">
                Real-time
              </div>
              <div className="text-sm text-muted-foreground">Analytics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="flex justify-between items-center p-6">
          <img
            src={logo}
            alt="Vividstream Pro"
            className="h-10 w-auto lg:hidden"
          />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4 lg:hidden">
                <Shield className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                {isLogin ? "Admin Sign In" : "Admin Registration"}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isLogin
                  ? "Access the administrative dashboard"
                  : "Create your administrator account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 bg-input border-border"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@vividstream.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-input border-border"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-input border-border"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminCode" className="text-foreground">
                  Admin Access Code
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="adminCode"
                    type="password"
                    placeholder="Enter admin access code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="pl-10 h-12 bg-input border-border"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Contact system administrator for access code
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </div>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    {isLogin ? "Sign In as Admin" : "Create Admin Account"}
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {isLogin
                  ? "Need an admin account? Register here"
                  : "Already have an account? Sign in"}
              </button>

              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => navigate("/login")}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  ← Back to User Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
