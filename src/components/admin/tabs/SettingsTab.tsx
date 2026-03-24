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
  cryptoEnabled: boolean;
  cryptoWalletAddress: string;
  cryptoType: string;
}

export const SettingsTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm<SettingsData>();

  const cryptoEnabled = watch("cryptoEnabled");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const response = await apiFetch(`${API_BASE_URL}/admin/settings`);
      if (response.ok) {
        const data = await response.json();
        // Ensure cryptoEnabled is a boolean
        if (typeof data.cryptoEnabled === "string") {
          data.cryptoEnabled = data.cryptoEnabled === "true";
        }
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
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Bitcoin className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl">Payment Configuration</CardTitle>
          </div>
          <CardDescription>
            Manage your platform's payment settings. Currently, exclusively cryptocurrency payments are supported.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border">
              <div className="space-y-0.5">
                <Label htmlFor="cryptoEnabled" className="text-base">Enable Crypto Payments</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to make purchases using cryptocurrency
                </p>
              </div>
              <Switch
                id="cryptoEnabled"
                checked={cryptoEnabled}
                onCheckedChange={(checked) => setValue("cryptoEnabled", checked)}
              />
            </div>

            <div className={`space-y-4 transition-all duration-300 ${cryptoEnabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
              <div className="space-y-2">
                <Label htmlFor="cryptoType">Cryptocurrency Type</Label>
                <Select
                  value={watch("cryptoType") || "BTC"}
                  onValueChange={(value) => setValue("cryptoType", value)}
                >
                  <SelectTrigger id="cryptoType" className="h-12">
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
                  className="h-12 font-mono"
                  {...register("cryptoWalletAddress", { required: cryptoEnabled })}
                />
                <p className="text-xs text-muted-foreground">
                  Users will send payments to this address. Ensure it is correct to avoid loss of funds.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Payment Configuration
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 flex gap-3 text-sm">
        <Save className="w-5 h-5 shrink-0" />
        <p>
          <strong>Note:</strong> Bank transfer and card payment options have been disabled. 
          The platform now operates exclusively with the cryptocurrency configuration provided above.
        </p>
      </div>
    </div>
  );
};
