import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { toast } from "@/hooks/use-toast";

interface EditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSave: (updatedData: Record<string, any>) => void;
  statusOptions?: string[];
  roleOptions?: string[];
}

export const EditModal = ({
  open,
  onOpenChange,
  title,
  data,
  onSave,
  statusOptions = ["Active", "Pending", "Suspended", "Completed", "Expired"],
  roleOptions = [],
}: EditModalProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  if (!data) return null;

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    toast({
      title: "Updated Successfully",
      description: `${title} has been updated.`,
    });
    onOpenChange(false);
  };

  const editableFields = Object.entries(formData).filter(
    ([key]) =>
      !["_id", "id", "createdAt", "updatedAt", "__v", "password"].includes(key),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit {title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {editableFields.map(([key, value]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="capitalize">
                {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
              </Label>
              {key.toLowerCase() === "status" && statusOptions.length > 0 ? (
                <Select
                  value={formData[key]}
                  onValueChange={(val) => handleChange(key, val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : key.toLowerCase() === "role" && roleOptions.length > 0 ? (
                <Select
                  value={formData[key]}
                  onValueChange={(val) => handleChange(key, val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={key}
                  value={formData[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
