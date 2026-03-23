import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PaymentDetails } from "../types";
import { apiFetch } from "@/config/api";
import { Loader2, Copy, Building, Bitcoin } from "lucide-react";
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

  const valid = (paymentMethod === "bank" || paymentMethod === "crypto") ? !!payment.slip : true;

  return (
    <div className="flex flex-col gap-4">
      {/* Payment Method Selection */}
      {settings?.cryptoEnabled === "true" && (
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setPaymentMethod("bank")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              paymentMethod === "bank"
                ? "bg-blue-500/20 border border-blue-500 text-blue-400"
                : "bg-white/[0.03] border border-[#1f2937] text-gray-400 hover:bg-white/[0.06]"
            }`}
          >
            <Building className="w-4 h-4 inline-block mr-2" />
            {t("stadium.checkout.payment.bankTransfer")}
          </button>
          <button
            onClick={() => setPaymentMethod("crypto")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              paymentMethod === "crypto"
                ? "bg-purple-500/20 border border-purple-500 text-purple-400"
                : "bg-white/[0.03] border border-[#1f2937] text-gray-400 hover:bg-white/[0.06]"
            }`}
          >
            <Bitcoin className="w-4 h-4 inline-block mr-2" />
            {t("stadium.checkout.payment.crypto")}
          </button>
        </div>
      )}

      {/* Bank Transfer Section */}
      {(paymentMethod === "bank" || !settings?.cryptoEnabled) && (
        <>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
            <Building className="w-8 h-8 text-blue-400" />
            <h3 className="font-semibold text-blue-100">
              {t("stadium.checkout.payment.manualTransfer")}
            </h3>
            <p className="text-sm text-blue-200/70">
              {t("stadium.checkout.payment.transferInstruction")}
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
                    {t("stadium.checkout.payment.bankName")}
                  </p>
                  <p className="font-semibold text-gray-200">
                    {settings.bankName ||
                      t("stadium.checkout.payment.notConfigured")}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center group">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    {t("stadium.checkout.payment.accountName")}
                  </p>
                  <p className="font-semibold text-gray-200">
                    {settings.accountName ||
                      t("stadium.checkout.payment.notConfigured")}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center group">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    {t("stadium.checkout.payment.accountNumber")}
                  </p>
                  <p className="font-mono text-lg text-yellow-500">
                    {settings.accountNumber ||
                      t("stadium.checkout.payment.notConfigured")}
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
              {t("stadium.checkout.payment.loadError")}
            </div>
          )}
        </>
      )}

      {/* Crypto Payment Section */}
      {paymentMethod === "crypto" && settings?.cryptoEnabled === "true" && (
        <>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex flex-col items-center text-center space-y-2">
            <Bitcoin className="w-8 h-8 text-purple-400" />
            <h3 className="font-semibold text-purple-100">
              {t("stadium.checkout.payment.cryptoPayment")}
            </h3>
            <p className="text-sm text-purple-200/70">
              {t("stadium.checkout.payment.cryptoInstruction", { type: settings.cryptoType || "Crypto" })}
            </p>
          </div>

          <div className="bg-white/[0.03] border border-[#1f2937] rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center group">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  {t("stadium.checkout.payment.cryptoType")}
                </p>
                <p className="font-semibold text-gray-200">
                  {settings.cryptoType || "Not configured"}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center group">
              <div className="w-full">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                  {t("stadium.checkout.payment.walletAddress")}
                </p>
                <p className="font-mono text-sm text-yellow-500 break-all">
                  {settings.cryptoWalletAddress || t("stadium.checkout.payment.notConfigured")}
                </p>
              </div>
              {settings.cryptoWalletAddress && (
                <button
                  onClick={() => handleCopy(settings.cryptoWalletAddress)}
                  className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Payment Slip Upload */}
      {(paymentMethod === "bank" || paymentMethod === "crypto") && (
        <div className="bg-white/[0.03] border border-[#1f2937] rounded-xl p-4 flex flex-col space-y-2">
          <label className="text-xs text-gray-400 font-semibold mb-1">Upload Payment Slip / Proof</label>
          <input 
            type="file" 
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400/10 file:text-yellow-400 hover:file:bg-yellow-400/20"
          />
          {payment.slip && <span className="text-xs text-green-400 mt-1">✔ {payment.slip.name}</span>}
        </div>
      )}

      <div className="bg-white/[0.03] border border-[#1f2937] rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-400">
          {t("stadium.checkout.payment.totalToCharge")}
        </span>
        <span className="font-black text-yellow-400 text-lg">
          ${total.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={processing}
          className="flex-1 border border-[#374151] rounded-xl py-3 text-sm text-gray-400 hover:bg-white/5 transition-all"
        >
          ← {t("common.back")}
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
              {t("common.loading").toUpperCase()}…
            </>
          ) : (
            t("stadium.checkout.payment.sentConfirmation", {
              amount: total.toLocaleString(),
            })
          )}
        </button>
      </div>
    </div>
  );
}
