/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { ViewModal } from "@/components/admin/ViewModal";
import { DeleteModal } from "@/components/admin/DeleteModal";
import { MatchModal } from "@/components/admin/modals/MatchModal";
import { endpoints } from "@/config/api";
import { toast } from "sonner";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const BettingTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("matches");

  // --- Matches State ---
  const [matches, setMatches] = useState<any[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [matchesPagination, setMatchesPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [matchModal, setMatchModal] = useState<{
    open: boolean;
    match: any | null;
  }>({ open: false, match: null });
  const [matchDeleteModal, setMatchDeleteModal] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  // --- Predictions State ---
  const [predictions, setPredictions] = useState<any[]>([]);
  const [predictionsLoading, setPredictionsLoading] = useState(true);
  const [predictionsPagination, setPredictionsPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [viewPredictionModal, setViewPredictionModal] = useState<{
    open: boolean;
    title: string;
    data: any;
  }>({ open: false, title: "", data: null });
  const [deletePredictionModal, setDeletePredictionModal] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });

  // --- Fetch Matches ---
  const fetchMatches = async (page = 1) => {
    try {
      setMatchesLoading(true);
      const res = await fetch(
        `${endpoints.worldcup.matches}?page=${page}&limit=10`,
      );
      if (res.ok) {
        const data = await res.json();
        setMatches(data.docs || []);
        setMatchesPagination({
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      toast.error("Failed to load matches");
    } finally {
      setMatchesLoading(false);
    }
  };

  // --- Fetch Predictions ---
  const fetchPredictions = async (page = 1) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      setPredictionsLoading(true);
      const res = await fetch(
        `${endpoints.worldcup.getAllPredictions}?page=${page}&limit=10`,
        { headers },
      );
      if (res.ok) {
        const data = await res.json();
        setPredictions(data.docs || []);
        setPredictionsPagination({
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      toast.error("Failed to load predictions");
    } finally {
      setPredictionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === "matches") fetchMatches();
    if (activeSubTab === "predictions") fetchPredictions();
  }, [activeSubTab]);

  // --- Match Actions ---
  const handleSaveMatch = async (data: any) => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("teamA", data.teamA);
      formData.append("teamB", data.teamB);
      formData.append("date", data.date);
      formData.append("venue", data.venue);
      formData.append("status", data.status);

      if (data.winner) {
        formData.append("winner", data.winner);
      }

      // Append odds as stringified JSON
      if (data.odds) {
        formData.append("odds", JSON.stringify(data.odds));
      }

      // Append images if present
      if (data.teamAImage && data.teamAImage.length > 0) {
        formData.append("teamAImage", data.teamAImage[0]);
      }
      if (data.teamBImage && data.teamBImage.length > 0) {
        formData.append("teamBImage", data.teamBImage[0]);
      }

      let res;
      if (matchModal.match) {
        res = await fetch(
          endpoints.worldcup.updateMatch(matchModal.match._id),
          {
            method: "PUT",
            headers,
            body: formData,
          },
        );
      } else {
        res = await fetch(endpoints.worldcup.matches, {
          method: "POST",
          headers,
          body: formData,
        });
      }

      if (res.ok) {
        toast.success(
          `Match ${matchModal.match ? "updated" : "created"} successfully`,
        );
        fetchMatches(matchesPagination.page);
      } else {
        throw new Error("Operation failed");
      }
    } catch (error) {
      toast.error("Failed to save match");
    }
  };

  const handleDeleteMatch = async (id: string | number) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await fetch(endpoints.worldcup.deleteMatch(String(id)), {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        toast.success("Match deleted successfully");
        fetchMatches(matchesPagination.page);
        setMatchDeleteModal({ open: false, id: null });
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast.error("Failed to delete match");
    }
  };

  // --- Prediction Actions ---
  const handleDeletePrediction = async (id: string | number) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await fetch(endpoints.worldcup.deletePrediction(String(id)), {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        toast.success("Prediction deleted successfully");
        fetchPredictions(predictionsPagination.page);
        setDeletePredictionModal({ open: false, id: null });
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast.error("Failed to delete prediction");
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      scheduled: "bg-info/20 text-info",
      live: "bg-warning/20 text-warning",
      completed: "bg-success/20 text-success",
      cancelled: "bg-destructive/20 text-destructive",
      won: "bg-success/20 text-success",
      lost: "bg-destructive/20 text-destructive",
      open: "bg-info/20 text-info",
    };
    return (
      styles[status?.toLowerCase()] || "bg-secondary text-secondary-foreground"
    );
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="mt-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Matches Management</h3>
              <Button
                size="sm"
                variant="gradient"
                onClick={() => setMatchModal({ open: true, match: null })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Match
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Teams
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Odds (A/D/B)
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {matchesLoading ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    matches.map((match) => (
                      <tr
                        key={match._id}
                        className="border-t border-border hover:bg-secondary/30"
                      >
                        <td className="p-4 font-medium">
                          {match.teamA} vs {match.teamB}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(match.date).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              match.status,
                            )}`}
                          >
                            {match.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm">
                          {match.odds?.teamAWin} / {match.odds?.draw} /{" "}
                          {match.odds?.teamBWin}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() =>
                                setMatchModal({ open: true, match: match })
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive"
                              onClick={() =>
                                setMatchDeleteModal({
                                  open: true,
                                  id: match._id,
                                })
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls
              currentPage={matchesPagination.page}
              totalPages={matchesPagination.totalPages}
              onPageChange={(page) => fetchMatches(page)}
              isLoading={matchesLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="mt-4">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">User Predictions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      User
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Match
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Prediction
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Stake
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {predictionsLoading ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    predictions.map((pred) => (
                      <tr
                        key={pred._id}
                        className="border-t border-border hover:bg-secondary/30"
                      >
                        <td className="p-4">
                          {pred.user?.fullName || pred.user?.email || "N/A"}
                        </td>
                        <td className="p-4 text-sm">
                          {pred.match
                            ? `${pred.match.teamA} vs ${pred.match.teamB}`
                            : "Match Deleted"}
                        </td>
                        <td className="p-4">{pred.predictedWinner}</td>
                        <td className="p-4 font-medium">₦{pred.wagerAmount}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              pred.status,
                            )}`}
                          >
                            {pred.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() =>
                                setViewPredictionModal({
                                  open: true,
                                  title: "Prediction Details",
                                  data: pred,
                                })
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive"
                              onClick={() =>
                                setDeletePredictionModal({
                                  open: true,
                                  id: pred._id,
                                })
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <PaginationControls
              currentPage={predictionsPagination.page}
              totalPages={predictionsPagination.totalPages}
              onPageChange={(page) => fetchPredictions(page)}
              isLoading={predictionsLoading}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <MatchModal
        open={matchModal.open}
        onOpenChange={(open) => setMatchModal((p) => ({ ...p, open }))}
        match={matchModal.match}
        onSave={handleSaveMatch}
      />

      <DeleteModal
        open={matchDeleteModal.open}
        onOpenChange={(open) => setMatchDeleteModal((p) => ({ ...p, open }))}
        title="Delete Match"
        itemId={matchDeleteModal.id}
        onConfirm={handleDeleteMatch}
      />

      <ViewModal
        open={viewPredictionModal.open}
        onOpenChange={(open) => setViewPredictionModal((p) => ({ ...p, open }))}
        title={viewPredictionModal.title}
        data={viewPredictionModal.data}
      />

      <DeleteModal
        open={deletePredictionModal.open}
        onOpenChange={(open) =>
          setDeletePredictionModal((p) => ({ ...p, open }))
        }
        title="Delete Prediction"
        itemId={deletePredictionModal.id}
        onConfirm={handleDeletePrediction}
      />
    </div>
  );
};
