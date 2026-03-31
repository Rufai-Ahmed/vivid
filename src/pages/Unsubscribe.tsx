import { useState } from "react";
import { Navbar } from "@/components/bloc/Header/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/config/api";

const Unsubscribe = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE_URL}/users/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("You have been successfully unsubscribed from all emails.");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-lg">
          <div className="relative">
            <div className="absolute inset-0 gradient-hero opacity-30 rounded-3xl" />
            <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Unsubscribe</h1>
                <p className="text-muted-foreground">
                  Enter your email address to unsubscribe from all VividStream
                  Pro communications.
                </p>
              </div>

              {status === "success" ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <p className="text-foreground">{message}</p>
                  <a
                    href="/"
                    className="text-primary underline hover:text-primary/90"
                  >
                    Return to Home
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{message}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Unsubscribing...
                      </>
                    ) : (
                      "Unsubscribe"
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Unsubscribe;
