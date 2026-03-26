import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PaymentDetails } from "../types";
import { apiFetch, endpoints } from "@/config/api";
import { Loader2, Copy, Bitcoin, CheckCircle, Upload } from "lucide-react";
import { toast } from "sonner";

interface Wallet {
  _id: string;
  cryptocurrency: string;
  network: string;
  address: string;
  isActive: boolean;
  isDefault: boolean;
}

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
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onChange({
      cardNumber: "manual",
      expiry: "12/99",
      cvv: "000",
      nameOnCard: "MANUAL",
    });
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const res = await apiFetch(endpoints.cryptoWallets.getActive);
      if (res.ok) {
        const data = await res.json();
        setWallets(data);
        // Auto-select default wallet
        const defaultWallet = data.find((w: Wallet) => w.isDefault);
        if (defaultWallet) setSelectedWallet(defaultWallet);
        else if (data.length > 0) setSelectedWallet(data[0]);
      }
    } catch (err) {
      setError("Failed to load payment options");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t("stadium.checkout.payment.copied"));
  };

  const valid = !!payment.slip && !!selectedWallet;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="text-gray-400">Loading payment options...</p>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 flex flex-col items-center text-center space-y-4">
          <Bitcoin className="w-8 h-8 text-red-500" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-red-100">
              Payment Not Available
            </h3>
            <p className="text-sm text-red-200/60">
              No cryptocurrency wallets configured. Please contact support.
            </p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="w-full border border-[#374151] rounded-xl py-3 text-sm text-gray-400"
        >
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Wallet Selection */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
        <label className="text-sm font-bold text-gray-200 mb-3 block">
          Select Cryptocurrency
        </label>
        <select
          value={selectedWallet?._id || ""}
          onChange={(e) => {
            const wallet = wallets.find((w) => w._id === e.target.value);
            setSelectedWallet(wallet || null);
          }}
          className="w-full bg-[#1a1a2e] border border-[#374151] rounded-xl px-4 py-3 text-white"
        >
          {wallets.map((wallet) => (
            <option key={wallet._id} value={wallet._id}>
              {wallet.cryptocurrency} ({wallet.network})
            </option>
          ))}
        </select>
      </div>

      {/* Payment Details */}
      {selectedWallet && (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-1">
            {selectedWallet.cryptocurrency} Payment
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Send exactly {total} USD worth of {selectedWallet.cryptocurrency}{" "}
            to:
          </p>

          <div className="bg-[#0d0d1a] rounded-xl p-4 space-y-3">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                Network
              </p>
              <p className="text-white font-medium">{selectedWallet.network}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                Wallet Address
              </p>
              <div className="flex items-center gap-2">
                <code className="text-gray-300 text-sm flex-1 break-all">
                  {selectedWallet.address}
                </code>
                <button
                  onClick={() => handleCopy(selectedWallet.address)}
                  className="text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Slip Upload */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-gray-200">
            Payment Proof
          </label>
          <span className="text-[10px] bg-yellow-400/10 text-yellow-400 px-2 py-0.5 rounded-full">
            Required
          </span>
        </div>

        <div
          className={`p-4 rounded-xl border-2 border-dashed flex items-center justify-center gap-3 ${
            payment.slip
              ? "border-green-500/30 bg-green-500/5"
              : "border-[#374151]"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0])
                onChange({ ...payment, slip: e.target.files[0] });
            }}
            className="hidden"
            id="slip-upload"
          />
          <label
            htmlFor="slip-upload"
            className="cursor-pointer flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <Upload className="w-5 h-5" />
            <span>
              {payment.slip ? payment.slip.name : "Upload payment screenshot"}
            </span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-[#374151] rounded-xl py-3 text-sm text-gray-400 hover:bg-white/5"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!valid || processing}
          className={`flex-1 rounded-xl py-3 text-sm font-medium ${valid && !processing ? "bg-primary text-white" : "bg-gray-600 text-gray-400 cursor-not-allowed"}`}
        >
          {processing ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  );
}
