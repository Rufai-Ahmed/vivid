import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { endpoints, apiFetch } from "@/config/api";
import { Loader2, Save, Building, Bitcoin } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingsData {
  bankName: string;
  accountName: string;
  accountNumber: string;
  cryptoEnabled: string;
  cryptoWalletAddress: string;
  cryptoType: string;
}

export const SettingsTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm<SettingsData>();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // NOTE: We had to explicitly define the settings endpoint URL here since we just added it to the backend
      // But we will use the base url
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const response = await apiFetch(`${API_BASE_URL}/admin/settings`);
      if (response.ok) {
        const data = await response.json();
        reset(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SettingsData) => {
    setSaving(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const response = await apiFetch(`${API_BASE_URL}/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Settings updated successfully");
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-5 h-5 text-primary" />
            <CardTitle>Manual Payment Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure the bank details displayed to users during manual checkout
            (Stadium Tickets, Hotels, etc.).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                placeholder="e.g. Zenith Bank"
                {...register("bankName", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountName">Account Name</Label>
              <Input
                id="accountName"
                placeholder="e.g. VividStream Pro"
                {...register("accountName", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="e.g. 1012345678"
                {...register("accountNumber", { required: true })}
              />
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto mt-4"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Bitcoin className="w-5 h-5 text-primary" />
            <CardTitle>Cryptocurrency Payment Configuration</CardTitle>
          </div>
          <CardDescription>
            Enable cryptocurrency payments for users. Configure the wallet address where payments will be received.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="cryptoEnabled">Enable Crypto Payments</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to pay with cryptocurrency
                </p>
              </div>
              <Switch
                id="cryptoEnabled"
                {...register("cryptoEnabled")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cryptoType">Cryptocurrency Type</Label>
              <Select
                {...register("cryptoType")}
                onValueChange={(value) => {
                  const event = { target: { name: "cryptoType", value } };
                  // @ts-expect-error - React Hook Form register typing
                  onChange(event);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="USDT">Tether (USDT)</SelectItem>
                  <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cryptoWalletAddress">Wallet Address</Label>
              <Input
                id="cryptoWalletAddress"
                placeholder="Enter cryptocurrency wallet address"
                {...register("cryptoWalletAddress")}
              />
              <p className="text-xs text-muted-foreground">
                Users will send payments to this address
              </p>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto mt-4"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Crypto Configuration
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
