import { useEffect, useState } from "react";
import { PaymentDetails } from "../types";
import { apiFetch } from "@/config/api";
import { Loader2, Copy, Building } from "lucide-react";
import { toast } from "sonner";

export function PaymentStep({
  onChange,
  total,
  onBack,
  onNext,
  processing,
}: {
  onChange: (p: PaymentDetails) => void;
  total: number;
  onBack: () => void;
  onNext: () => void;
  processing: boolean;
}) {
  const [settings, setSettings] = useState<{
    bankName: string;
    accountName: string;
    accountNumber: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We update payment to a dummy object just to pass validation if any, though card validation upstream should be removed.
    // Wait, the parent component might rely on payment state to be filled to enable the buy button?
    // In our refactored backend it doesn't need card number length 16 anymore.
    onChange({
      cardNumber: "manual",
      expiry: "12/99",
      cvv: "000",
      nameOnCard: "MANUAL",
    });

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSettings = async () => {
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const res = await apiFetch(`${API_BASE_URL}/admin/settings`);
      if (res.ok) {
        setSettings(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const valid = true; // Always valid for manual payment

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
        <Building className="w-8 h-8 text-blue-400" />
        <h3 className="font-semibold text-blue-100">Manual Bank Transfer</h3>
        <p className="text-sm text-blue-200/70">
          Please transfer the exact total amount to the account below to secure
          your tickets.
        </p>
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : settings ? (
        <div className="bg-white/[0.03] border border-[#1f2937] rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center group">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                Bank Name
              </p>
              <p className="font-semibold text-gray-200">
                {settings.bankName || "Not configured"}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center group">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                Account Name
              </p>
              <p className="font-semibold text-gray-200">
                {settings.accountName || "Not configured"}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center group">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                Account Number
              </p>
              <p className="font-mono text-lg text-yellow-500">
                {settings.accountNumber || "Not configured"}
              </p>
            </div>
            {settings.accountNumber && (
              <button
                onClick={() => handleCopy(settings.accountNumber)}
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center text-sm text-red-400 py-4">
          Failed to load bank details.
        </div>
      )}

      <div className="bg-white/[0.03] border border-[#1f2937] rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-400">Total to charge</span>
        <span className="font-black text-yellow-400 text-lg">
          ₦{total.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={processing}
          className="flex-1 border border-[#374151] rounded-xl py-3 text-sm text-gray-400 hover:bg-white/5 transition-all"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!valid || processing}
          className="flex-[2] rounded-xl py-3 text-sm font-black tracking-widest transition-all flex items-center justify-center gap-2"
          style={{
            background:
              valid && !processing
                ? "linear-gradient(135deg, #FFD700, #FF6B35)"
                : "#1f2937",
            color: valid && !processing ? "#000" : "#4b5563",
            cursor: valid && !processing ? "pointer" : "not-allowed",
          }}
        >
          {processing ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              PROCESSING…
            </>
          ) : (
            `I'VE SENT ₦${total.toLocaleString()} →`
          )}
        </button>
      </div>
    </div>
  );
}
