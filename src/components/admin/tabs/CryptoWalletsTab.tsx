/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Wallet,
  Plus,
  Copy,
  CheckCircle,
  XCircle,
  Edit2,
  RefreshCw,
  Bitcoin,
  Coins,
} from "lucide-react";
import { endpoints, apiFetch } from "@/config/api";

interface CryptoWallet {
  _id: string;
  cryptocurrency: string;
  network: string;
  address: string;
  isActive: boolean;
  isDefault: boolean;
  label?: string;
  createdAt: string;
  updatedAt: string;
}

const supportedCryptos = {
  BTC: ["mainnet", "testnet"],
  ETH: ["mainnet", "polygon", "arbitrum", "optimism", "base", "sepolia"],
  USDT: ["ERC20", "TRC20", "BEP20"],
  USDC: ["ERC20", "TRC20", "BEP20"],
  BNB: ["mainnet", "BEP20", "testnet"],
};

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

export const CryptoWalletsTab = () => {
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<CryptoWallet | null>(null);
  const [formData, setFormData] = useState({
    cryptocurrency: "",
    network: "",
    address: "",
    label: "",
    isDefault: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const res = await apiFetch(endpoints.cryptoWallets.getAll);
      if (res.ok) {
        const data = await res.json();
        setWallets(data);
      }
    } catch (error) {
      toast.error("Failed to load wallets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const resetForm = () => {
    setFormData({
      cryptocurrency: "",
      network: "",
      address: "",
      label: "",
      isDefault: false,
    });
    setEditingWallet(null);
  };

  const handleOpenDialog = (wallet?: CryptoWallet) => {
    if (wallet) {
      setEditingWallet(wallet);
      setFormData({
        cryptocurrency: wallet.cryptocurrency,
        network: wallet.network,
        address: wallet.address,
        label: wallet.label || "",
        isDefault: wallet.isDefault,
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.cryptocurrency || !formData.network || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const url = editingWallet
        ? endpoints.cryptoWallets.update(editingWallet._id)
        : endpoints.cryptoWallets.create;
      const method = editingWallet ? "PUT" : "POST";

      const res = await apiFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          editingWallet
            ? "Wallet updated successfully"
            : "Wallet added successfully",
        );
        setDialogOpen(false);
        resetForm();
        fetchWallets();
      } else {
        const data = await res.json();
        throw new Error(data.message || "Failed to save wallet");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to save wallet");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (wallet: CryptoWallet) => {
    try {
      const endpoint = wallet.isActive
        ? endpoints.cryptoWallets.deactivate(wallet._id)
        : endpoints.cryptoWallets.reactivate(wallet._id);

      const res = await apiFetch(endpoint, { method: "PATCH" });
      if (res.ok) {
        toast.success(
          wallet.isActive ? "Wallet deactivated" : "Wallet activated",
        );
        fetchWallets();
      } else {
        throw new Error("Failed to update wallet");
      }
    } catch (error) {
      toast.error("Failed to update wallet status");
    }
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const getNetworksForCrypto = (crypto: string) => {
    return supportedCryptos[crypto as keyof typeof supportedCryptos] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            Cryptocurrency Wallets
          </h2>
          <p className="text-muted-foreground">
            Manage cryptocurrency payment addresses
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" />
          Add Wallet
        </Button>
      </div>

      {/* Wallet Cards */}
      {loading ? (
        <div className="text-center py-8">Loading wallets...</div>
      ) : wallets.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No wallets configured yet</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => handleOpenDialog()}
          >
            Add your first wallet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => {
            const Icon = cryptoIcons[wallet.cryptocurrency] || Wallet;
            const colorClass = cryptoColors[wallet.cryptocurrency] || "";

            return (
              <div
                key={wallet._id}
                className={`border rounded-lg p-4 ${
                  wallet.isActive ? "bg-card" : "bg-muted/50 opacity-70"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-6 h-6 ${colorClass}`} />
                    <div>
                      <span className="font-semibold">
                        {wallet.cryptocurrency}
                      </span>
                      <span className="text-muted-foreground text-sm ml-2">
                        {wallet.network}
                      </span>
                    </div>
                  </div>
                  {wallet.isDefault && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded shrink-0">
                      Default
                    </span>
                  )}
                </div>

                {wallet.label && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {wallet.label}
                  </p>
                )}

                <div className="flex items-center gap-2 bg-muted rounded p-2 mb-3">
                  <code className="text-xs flex-1 truncate">
                    {wallet.address}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => handleCopyAddress(wallet.address)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {wallet.isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {wallet.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(wallet)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleActive(wallet)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingWallet ? "Edit Wallet" : "Add New Wallet"}
            </DialogTitle>
            <DialogDescription>
              Configure a cryptocurrency wallet address for receiving payments
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cryptocurrency *</Label>
              <Select
                value={formData.cryptocurrency}
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    cryptocurrency: value,
                    network: "",
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(supportedCryptos).map((crypto) => (
                    <SelectItem key={crypto} value={crypto}>
                      {crypto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.cryptocurrency && (
              <div className="space-y-2">
                <Label>Network *</Label>
                <Select
                  value={formData.network}
                  onValueChange={(value) =>
                    setFormData({ ...formData, network: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {getNetworksForCrypto(formData.cryptocurrency).map(
                      (network) => (
                        <SelectItem key={network} value={network}>
                          {network.toUpperCase()}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Wallet Address *</Label>
              <Input
                placeholder="Enter wallet address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Label (Optional)</Label>
              <Input
                placeholder="e.g., Main BTC Wallet"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="rounded"
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default for{" "}
                {formData.cryptocurrency || "selected crypto"}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting
                ? "Saving..."
                : editingWallet
                  ? "Update"
                  : "Add Wallet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
