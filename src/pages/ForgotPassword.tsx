import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";
import { useTranslation } from "react-i18next";
import vividstreamLogoDark from "@/assets/vividstream-logo-dark-mode.png";
import vividstreamLogoLight from "@/assets/vividstream-logo-light-mode.png";
import { Mail, ArrowRight, ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const logo = theme === "light" ? vividstreamLogoLight : vividstreamLogoDark;
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulated password reset - replace with actual backend later
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      toast.success(t('forgotPassword.toast.success'));
    } catch (error) {
      toast.error(t('forgotPassword.toast.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16">
        <div className="absolute top-6 left-6 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Vividstream Pro" className="h-10 w-auto" />
          </Link>
        </div>
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-md">
          {!isSubmitted ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Forgot password?</h1>
                <p className="text-muted-foreground">
                  No worries! Enter your email and we'll send you a reset link.
                </p>
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
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                  {isLoading ? "Sending..." : "Send Reset Link"}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Check your email</h1>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          )}

          <Link
            to="/login"
            className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        
        <div className="relative z-10 text-center max-w-md">
          <div className="w-24 h-24 mx-auto rounded-3xl gradient-primary flex items-center justify-center mb-8 animate-float">
            <KeyRound className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Reset Your Password
          </h2>
          <p className="text-muted-foreground">
            Don't worry, it happens to the best of us. We'll help you get back into your account in no time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
