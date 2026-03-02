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
import { Loader2, Save, Building } from "lucide-react";

interface SettingsData {
  bankName: string;
  accountName: string;
  accountNumber: string;
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
    </div>
  );
};
