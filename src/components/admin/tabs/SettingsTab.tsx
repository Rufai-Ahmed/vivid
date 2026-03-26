import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { endpoints, apiFetch } from "@/config/api";
import { Loader2, Save, Wallet, ArrowRight } from "lucide-react";

interface SettingsData {
  cryptoEnabled: boolean;
}

export const SettingsTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<SettingsData>();
  const [walletsCount, setWalletsCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const [settingsRes, walletsRes] = await Promise.all([
        apiFetch(`${API_BASE_URL}/admin/settings`),
        apiFetch(endpoints.cryptoWallets.getAll),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        const enabled = typeof data.cryptoEnabled === "string" ? data.cryptoEnabled === "true" : data.cryptoEnabled ?? true;
        setValue("cryptoEnabled", enabled);
      }

      if (walletsRes.ok) {
        const wallets = await walletsRes.json();
        setWalletsCount(wallets.length);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SettingsData) => {
    setSaving(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      await apiFetch(`${API_BASE_URL}/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cryptoEnabled: data.cryptoEnabled }),
      });
      toast.success("Settings updated");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-6 h-6" />
            <CardTitle>Payment Settings</CardTitle>
          </div>
          <CardDescription>Configure payment options for your platform</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Payments</Label>
                <p className="text-sm text-muted-foreground">Allow users to make purchases</p>
              </div>
              <input type="checkbox" {...register("cryptoEnabled")} className="toggle" />
            </div>
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Manage Crypto Wallets
          </CardTitle>
          <CardDescription>Configure cryptocurrency wallet addresses for receiving payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{walletsCount} wallet{walletsCount !== 1 ? "s" : ""} configured</p>
            </div>
            <Button variant="outline" onClick={() => { (window as any).adminPendingTab = "wallets"; window.location.reload(); }}>
              Go to Crypto Wallets <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 rounded-xl bg-muted text-sm text-muted-foreground">
        <p>Payment configuration has moved to the <strong>Crypto Wallets</strong> tab where you can manage multiple wallets for different cryptocurrencies and networks.</p>
      </div>
    </div>
  );
};
