/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket?: any;
  onSave: (data: any) => Promise<void>;
}

export const TicketModal = ({
  open,
  onOpenChange,
  ticket,
  onSave,
}: TicketModalProps) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (ticket) {
      reset({
        code: ticket.code,
        type: ticket.type,
        status: ticket.status,
      });
    } else {
      reset({
        type: "standard",
        status: "active",
      });
    }
  }, [ticket, reset]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await onSave(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{ticket ? "Edit Ticket" : "Create Ticket"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Ticket Code</Label>
            <Input
              id="code"
              {...register("code", { required: true })}
              disabled={!!ticket} // Usually code is unique and shouldn't change
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={(val) => setValue("type", val)}
              defaultValue={ticket?.type || "standard"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ticket Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {ticket && (
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(val) => setValue("status", val)}
                defaultValue={ticket?.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="redeemed">Redeemed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
