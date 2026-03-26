/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Wallet, Bitcoin, Coins, CheckCircle } from "lucide-react";
import { endpoints, apiFetch } from "@/config/api";

interface WalletStatus {
  _id: string;
  cryptocurrency: string;
  network: string;
  isActive: boolean;
  isDefault: boolean;
}

const cryptoIcons: Record<string, any> = {
  BTC: Bitcoin,
  ETH: Coins,
  USDT: Coins,
  USDC: Coins,
  BNB: Coins,
};

const cryptoColors: Record<string, string> = {
  BTC: "text-orange-500",
  ETH: "text-blue-500",
  USDT: "text-green-500",
  USDC: "text-blue-400",
  BNB: "text-yellow-500",
};

export const CryptoWalletStatusWidget = () => {
  const [wallets, setWallets] = useState<WalletStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const res = await apiFetch(endpoints.cryptoWallets.getActive);
        if (res.ok) {
          const data = await res.json();
          setWallets(data);
        }
      } catch (error) {
        console.error("Failed to fetch wallet status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();

    // Refresh every 30 seconds to ensure changes reflect immediately
    const interval = setInterval(fetchWallets, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-5 h-5" />
          <span className="font-medium">Crypto Wallets</span>
        </div>
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Wallet className="w-5 h-5" />
          <span className="font-medium">Crypto Wallets</span>
        </div>
        <div className="text-sm text-muted-foreground">
          No wallets configured
        </div>
      </div>
    );
  }

  // Group wallets by cryptocurrency
  const groupedWallets = wallets.reduce(
    (acc, wallet) => {
      if (!acc[wallet.cryptocurrency]) {
        acc[wallet.cryptocurrency] = [];
      }
      acc[wallet.cryptocurrency].push(wallet);
      return acc;
    },
    {} as Record<string, WalletStatus[]>,
  );

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2 mb-3">
        <Wallet className="w-5 h-5" />
        <span className="font-medium">Crypto Wallets</span>
      </div>
      <div className="space-y-2">
        {Object.entries(groupedWallets).map(([crypto, cryptoWallets]) => {
          const Icon = cryptoIcons[crypto] || Wallet;
          const colorClass = cryptoColors[crypto] || "";

          return (
            <div key={crypto} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${colorClass}`} />
                <span className="text-sm font-medium">{crypto}</span>
                <span className="text-xs text-muted-foreground">
                  ({cryptoWallets.length})
                </span>
              </div>
              <div className="flex items-center gap-1">
                {cryptoWallets.some((w) => w.isDefault) && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
                {cryptoWallets.every((w) => w.isActive) ? (
                  <span className="text-xs text-green-500">Active</span>
                ) : (
                  <span className="text-xs text-yellow-500">Partial</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
