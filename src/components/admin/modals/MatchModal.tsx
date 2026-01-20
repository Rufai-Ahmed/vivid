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

interface MatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match?: any;
  onSave: (data: any) => Promise<void>;
}

export const MatchModal = ({
  open,
  onOpenChange,
  match,
  onSave,
}: MatchModalProps) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [teamAImagePreview, setTeamAImagePreview] = useState<string>("");
  const [teamBImagePreview, setTeamBImagePreview] = useState<string>("");

  useEffect(() => {
    if (match) {
      reset({
        teamA: match.teamA,
        teamB: match.teamB,
        date: match.date ? new Date(match.date).toISOString().slice(0, 16) : "",
        venue: match.venue,
        status: match.status,
        winner: match.winner || "pending",
        "odds.teamAWin": match.odds?.teamAWin,
        "odds.teamBWin": match.odds?.teamBWin,
        "odds.draw": match.odds?.draw,
      });
      setTeamAImagePreview(match.teamAImage || "");
      setTeamBImagePreview(match.teamBImage || "");
    } else {
      reset({
        status: "scheduled",
        winner: "pending",
        venue: "",
        "odds.teamAWin": 1.0,
        "odds.teamBWin": 1.0,
        "odds.draw": 1.0,
      });
      setTeamAImagePreview("");
      setTeamBImagePreview("");
    }
  }, [match, reset]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      // Format data structure for nested odds
      const formattedData = {
        ...data,
        odds: {
          teamAWin: parseFloat(data["odds.teamAWin"]),
          teamBWin: parseFloat(data["odds.teamBWin"]),
          draw: parseFloat(data["odds.draw"]),
        },
      };

      // Remove winner if it is "pending" (backend enum validation)
      if (formattedData.winner === "pending") {
        delete formattedData.winner;
      }

      // Remove flat keys
      delete formattedData["odds.teamAWin"];
      delete formattedData["odds.teamBWin"];
      delete formattedData["odds.draw"];

      await onSave(formattedData);
      onOpenChange(false);
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
          <DialogTitle>{match ? "Edit Match" : "Add Match"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamA">Team A</Label>
              <Input id="teamA" {...register("teamA", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamB">Team B</Label>
              <Input id="teamB" {...register("teamB", { required: true })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamAImage">Team A Image</Label>
              {teamAImagePreview && (
                <img
                  src={teamAImagePreview}
                  alt="Team A Preview"
                  className="w-full h-32 object-cover rounded-md border"
                />
              )}
              <Input
                id="teamAImage"
                type="file"
                accept="image/*"
                {...register("teamAImage", {
                  onChange: (e) => handleImageChange(e, setTeamAImagePreview),
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamBImage">Team B Image</Label>
              {teamBImagePreview && (
                <img
                  src={teamBImagePreview}
                  alt="Team B Preview"
                  className="w-full h-32 object-cover rounded-md border"
                />
              )}
              <Input
                id="teamBImage"
                type="file"
                accept="image/*"
                {...register("teamBImage", {
                  onChange: (e) => handleImageChange(e, setTeamBImagePreview),
                })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input
              id="date"
              type="datetime-local"
              {...register("date", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" {...register("venue", { required: true })} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="oddsA">Odds A</Label>
              <Input
                id="oddsA"
                type="number"
                step="0.01"
                {...register("odds.teamAWin", { required: true, min: 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oddsDraw">Odds Draw</Label>
              <Input
                id="oddsDraw"
                type="number"
                step="0.01"
                {...register("odds.draw", { required: true, min: 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="oddsB">Odds B</Label>
              <Input
                id="oddsB"
                type="number"
                step="0.01"
                {...register("odds.teamBWin", { required: true, min: 1 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(val) => setValue("status", val)}
                defaultValue={match?.status || "scheduled"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="winner">Winner</Label>
              <Select
                onValueChange={(val) => setValue("winner", val)}
                defaultValue={match?.winner || "pending"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Winner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="teamA">Team A</SelectItem>
                  <SelectItem value="teamB">Team B</SelectItem>
                  <SelectItem value="draw">Draw</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Match"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
