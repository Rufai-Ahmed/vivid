import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/bloc/Header/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import {
  Ticket,
  ArrowLeft,
  CheckCircle,
  Gift,
  Sparkles,
  AlertCircle,
  Mail,
  LogIn,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import { endpoints, apiFetch } from "@/config/api";

const RedeemTicket = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticketCode, setTicketCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [error, setError] = useState("");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleRedeem = async () => {
    if (!ticketCode.trim()) {
      setError(t("redeem.errors.enterCode"));
      return;
    }

    // For bulk tickets (VS- codes), we need email
    const isBulkTicket = ticketCode.toUpperCase().startsWith("VS-");

    if (isBulkTicket && !email.trim()) {
      setError(t("redeem.errors.enterEmail"));
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      let response;
      let data;

      if (isBulkTicket) {
        // Use bulk ticket redemption endpoint (works for both new and existing users)
        response = await fetch(endpoints.bulkTickets.redeem, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticketCode: ticketCode.toUpperCase(),
            email: email.toLowerCase().trim(),
          }),
        });
        data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t("redeem.errors.failed"));
        }

        // Auto-login with the returned token
        if (data.token && data.user) {
          localStorage.setItem("token", data.token);
          localStorage.setItem(
            "vividstream_user",
            JSON.stringify({
              id: data.user.id,
              name: data.user.fullName,
              email: data.user.email,
              role: data.user.role,
              hasTicket: data.user.hasTicket,
            }),
          );

          setIsRedeemed(true);
          toast.success("Congratulations! Your ticket has been redeemed!");
          return;
        }

        setIsRedeemed(true);
        toast.success(t("redeem.toast.success"));
      } else {
        // Regular ticket redemption (requires login)
        if (!user) {
          setAuthModalOpen(true);
          setIsLoading(false);
          return;
        }

        response = await apiFetch(endpoints.tickets.redeem, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: ticketCode,
            userId: user.id,
          }),
        });

        data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || t("redeem.errors.failed"));
        }

        setIsRedeemed(true);
        toast.success(t("redeem.toast.success"));
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-card/80 backdrop-blur-sm z-40 flex items-center justify-between px-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t("common.backToDashboard")}</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-lg">
          {!isRedeemed ? (
            <div className="animate-fade-in">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto rounded-3xl gradient-primary flex items-center justify-center mb-6 animate-float">
                  <Ticket className="w-10 h-10 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-2">{t("redeem.title")}</h1>
                <p className="text-muted-foreground">
                  {t("redeem.instructions")}
                </p>
              </div>

              {/* Redemption Form */}
              <div className="rounded-2xl border border-border bg-card p-8">
                <div className="space-y-6">
                  {/* Email field - shown for bulk ticket users not logged in */}
                  {(!user || ticketCode.toUpperCase().startsWith("VS-")) && (
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        {t("redeem.emailLabel")}
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t("redeem.emailPlaceholder")}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("redeem.emailHint")}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="code" className="text-sm font-medium">
                      {t("redeem.ticketCodeLabel")}
                    </label>
                    <Input
                      id="code"
                      value={ticketCode}
                      onChange={(e) =>
                        setTicketCode(e.target.value.toUpperCase())
                      }
                      placeholder={t("redeem.ticketCodePlaceholder")}
                      className="text-center text-lg font-mono tracking-wider h-14"
                    />
                    {error && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}
                  </div>

                  <Button
                    variant="gradient"
                    size="xl"
                    className="w-full"
                    onClick={handleRedeem}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        {t("redeem.validating")}
                      </>
                    ) : (
                      <>
                        {t("redeem.redeemButton")}
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="font-medium mb-4">{t("redeem.howToFind")}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {(t("redeem.steps", { returnObjects: true }) as string[]).map((step: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs flex-shrink-0">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="text-center animate-scale-in">
              <div className="w-24 h-24 mx-auto rounded-full gradient-primary flex items-center justify-center mb-8 animate-glow">
                <CheckCircle className="w-12 h-12 text-primary-foreground" />
              </div>

              <h1 className="text-3xl font-bold mb-4 text-gradient">
                {t("redeem.success.title")}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {t("redeem.success.message")}
              </p>

              <div className="rounded-2xl gradient-accent p-8 mb-8">
                <Gift className="w-12 h-12 text-accent-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-accent-foreground mb-2">
                  {t("redeem.success.package")}
                </h2>
                <p className="text-accent-foreground/80">
                  {t("redeem.success.packageDesc")}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t("redeem.success.nextSteps")}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/dashboard/visa" className="flex-1">
                    <Button variant="gradient" className="w-full">
                      {t("redeem.success.applyVisa")}
                    </Button>
                  </Link>
                  <Link to="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      {t("redeem.success.goToDashboard")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ChatWidget />

      {/* Auth Modal for non-logged in users */}
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              {t("redeem.authModal.title")}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t("redeem.authModal.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={() => {
                setAuthModalOpen(false);
                navigate("/login", { state: { from: "/redeem-ticket" } });
              }}
            >
              <LogIn className="w-5 h-5 mr-2" />
              {t("redeem.authModal.signIn")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => {
                setAuthModalOpen(false);
                navigate("/signup", { state: { from: "/redeem-ticket" } });
              }}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              {t("redeem.authModal.signUp")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RedeemTicket;
