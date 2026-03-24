import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PaymentDetails } from "../types";
import { apiFetch } from "@/config/api";
import { Loader2, Copy, Building, Bitcoin, CheckCircle, Upload } from "lucide-react";
import { toast } from "sonner";

export function PaymentStep({
  payment,
  onChange,
  total,
  onBack,
  onNext,
  processing,
}: {
  payment: PaymentDetails;
  onChange: (p: PaymentDetails) => void;
  total: number;
  onBack: () => void;
  onNext: () => void;
  processing: boolean;
}) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<{
    bankName: string;
    accountName: string;
    accountNumber: string;
    cryptoEnabled: string;
    cryptoWalletAddress: string;
    cryptoType: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "crypto">("bank");

  useEffect(() => {
    onChange({
      cardNumber: "manual",
      expiry: "12/99",
      cvv: "000",
      nameOnCard: "MANUAL",
    });

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange({ ...payment, slip: e.target.files[0] });
    }
  };

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
    toast.success(t("stadium.checkout.payment.copied"));
  };

  const valid = !!payment.slip && !!settings?.cryptoWalletAddress;

  if (!loading && settings && (!settings.cryptoWalletAddress || (settings as any).cryptoEnabled === false || (settings as any).cryptoEnabled === "false")) {
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <Bitcoin className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-red-100">
              Payment Not Configured
            </h3>
            <p className="text-sm text-red-200/60 max-w-xs mx-auto">
              Cryptocurrency payments are currently unavailable. Please contact administration to complete your purchase.
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="w-full border border-[#374151] rounded-xl py-3 text-sm text-gray-400 hover:bg-white/5 transition-all"
        >
          ← {t("common.back")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Crypto Payment Section */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
          <p className="text-sm text-gray-500 uppercase tracking-widest animate-pulse">
            Fetching Secure Payment Details...
          </p>
        </div>
      ) : settings ? (
        <>
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center space-y-3 relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
            <Bitcoin className="w-10 h-10 text-purple-400 relative z-10 animate-bounce-slow" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-1">
                {t("stadium.checkout.payment.cryptoPayment")}
              </h3>
              <p className="text-sm text-gray-400">
                {t("stadium.checkout.payment.cryptoInstruction", { type: settings.cryptoType || "Crypto" })}
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex justify-between items-center group hover:bg-white/[0.05] transition-colors">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">
                  {t("stadium.checkout.payment.cryptoType")}
                </p>
                <p className="font-bold text-gray-100 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  {settings.cryptoType || "BTC"}
                </p>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex justify-between items-center group hover:bg-white/[0.05] transition-colors relative">
              <div className="w-full pr-10">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                  {t("stadium.checkout.payment.walletAddress")}
                </p>
                <p className="font-mono text-sm text-yellow-400 break-all leading-relaxed">
                  {settings.cryptoWalletAddress}
                </p>
              </div>
              <button
                onClick={() => handleCopy(settings.cryptoWalletAddress)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/5 rounded-lg hover:bg-white/10 transition-all active:scale-90 border border-white/5"
              >
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Payment Slip Upload */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-200">Payment Verification</label>
              <span className="text-[10px] bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">Required</span>
            </div>
            <p className="text-xs text-gray-500">Please upload a screenshot of your successful transaction.</p>
            
            <div className="relative group/upload">
              <input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`p-4 rounded-xl border-2 border-dashed transition-all flex items-center justify-center gap-3 ${
                payment.slip 
                  ? "border-green-500/30 bg-green-500/5" 
                  : "border-white/10 bg-white/[0.02] group-hover/upload:border-yellow-400/30 group-hover/upload:bg-yellow-400/5"
              }`}>
                {payment.slip ? (
                  <>
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-sm text-green-400 font-medium truncate max-w-[200px]">{payment.slip.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-500 group-hover/upload:text-yellow-400 transition-colors" />
                    <span className="text-sm text-gray-400 font-medium group-hover/upload:text-gray-200 transition-colors">Select Transfer Receipt</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-sm text-red-500 bg-red-500/5 border border-red-500/10 rounded-xl py-8">
           {t("stadium.checkout.payment.loadError")}
        </div>
      )}

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 flex justify-between items-center group hover:bg-white/[0.05] transition-colors">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">
            {t("stadium.checkout.payment.totalToCharge")}
          </span>
          <span className="text-xs text-gray-400">Processing fees included</span>
        </div>
        <div className="text-right">
          <span className="font-black text-white text-2xl tracking-tighter">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          onClick={onBack}
          disabled={processing}
          className="flex-1 border border-white/10 rounded-xl py-4 text-sm font-bold text-gray-400 hover:bg-white/5 transition-all active:scale-95"
        >
          {t("common.back").toUpperCase()}
        </button>
        <button
          onClick={onNext}
          disabled={!valid || processing}
          className="flex-[2] rounded-xl py-4 text-sm font-black tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/10 active:scale-[0.98]"
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
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            t("stadium.checkout.payment.sentConfirmation", {
              amount: total.toLocaleString(),
            }).toUpperCase()
          )}
        </button>
      </div>
    </div>
  );
}
