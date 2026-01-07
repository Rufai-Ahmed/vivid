import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/bloc/Header/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { endpoints } from "@/config/api";

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );
  const reference = searchParams.get("reference") || searchParams.get("trxref"); // Paystack sends reference or trxref

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      return;
    }

    verifyPayment(reference);
  }, [reference]);

  const verifyPayment = async (ref: string) => {
    try {
      const response = await fetch(endpoints.hotels.verifyPayment, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: ref }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setStatus("success");
      toast.success("Payment verified successfully!");
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("failed");
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-md text-center">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            {status === "loading" && (
              <div className="flex flex-col items-center animate-fade-in">
                <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
                <p className="text-muted-foreground">
                  Please wait while we confirm your transaction...
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center animate-scale-in">
                <CheckCircle className="w-16 h-16 text-success mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-success">
                  Payment Successful!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your booking has been confirmed. You will receive a
                  confirmation email shortly.
                </p>
                <div className="flex gap-3 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="gradient"
                    className="flex-1"
                    onClick={() => navigate("/dashboard/hotels")}
                  >
                    Book Another
                  </Button>
                </div>
              </div>
            )}

            {status === "failed" && (
              <div className="flex flex-col items-center animate-scale-in">
                <XCircle className="w-16 h-16 text-destructive mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-destructive">
                  Verification Failed
                </h2>
                <p className="text-muted-foreground mb-6">
                  We couldn't verify your payment. If you have been charged,
                  please contact support with reference:{" "}
                  <span className="font-mono bg-secondary px-1 rounded">
                    {reference}
                  </span>
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard/hotels")}
                >
                  Return to Hotels
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentVerification;
