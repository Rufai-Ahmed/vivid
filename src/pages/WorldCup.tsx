import { useState, useEffect } from "react";
import { Navbar } from "@/components/bloc/Header/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { endpoints } from "@/config/api";

// Define interface for Match from backend
interface Match {
  _id: string;
  teamA: string;
  teamB: string;
  date: string;
  venue: string;
  odds: {
    teamAWin: number;
    draw: number;
    teamBWin: number;
  };
  status: string;
}

const WorldCup = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictionModal, setPredictionModal] = useState<{
    open: boolean;
    matchId: string;
    team: string; // "teamA" | "teamB" | "draw"
    teamName: string; // For display
    odds: number;
  }>({
    open: false,
    matchId: "",
    team: "",
    teamName: "",
    odds: 0,
  });
  const [wagerAmount, setWagerAmount] = useState("");
  const [placingBet, setPlacingBet] = useState(false);

  // Country code mapping for flags
  const countryFlags: Record<string, string> = {
    USA: "us",
    Brazil: "br",
    Germany: "de",
    France: "fr",
    Argentina: "ar",
    Spain: "es",
    England: "gb-eng",
    Portugal: "pt",
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await fetch(endpoints.worldcup.matches);
      if (!response.ok) throw new Error("Failed to fetch matches");
      const data = await response.json();
      setMatches(data.docs || data); // Handle pagination response
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const handlePredictionClick = (
    match: Match,
    team: string,
    teamName: string,
    odds: number
  ) => {
    if (!user) {
      toast.error("Please login to place a prediction");
      return;
    }
    setPredictionModal({
      open: true,
      matchId: match._id,
      team,
      teamName,
      odds,
    });
    setWagerAmount("");
  };

  const submitPrediction = async () => {
    if (
      !wagerAmount ||
      isNaN(Number(wagerAmount)) ||
      Number(wagerAmount) <= 0
    ) {
      toast.error("Please enter a valid wager amount");
      return;
    }

    setPlacingBet(true);
    try {
      const response = await fetch(endpoints.worldcup.predict, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          matchId: predictionModal.matchId,
          predictedWinner: predictionModal.team,
          wagerAmount: Number(wagerAmount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place prediction");
      }

      toast.success("Prediction placed successfully!");
      setPredictionModal((prev) => ({ ...prev, open: false }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setPlacingBet(false);
    }
  };

  const leaderboard = [
    { rank: 1, name: "Alex Champion", points: 12500, wins: 45 },
    { rank: 2, name: "Sarah Winner", points: 11200, wins: 42 },
    { rank: 3, name: "Mike Predictor", points: 10800, wins: 40 },
    { rank: 4, name: "Emily Goals", points: 9500, wins: 35 },
    { rank: 5, name: "David Score", points: 8900, wins: 33 },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50 dark:opacity-100" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">
                World Cup 2026
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Predict & Win with
              <span className="text-gradient-accent"> Vividstream</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Place your predictions on World Cup matches, earn Vividstream
              rewards, and compete for the top of the leaderboard.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <Button variant="gradient-accent" size="xl">
                  Start Predicting
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="glass" size="xl">
                View Rules
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Upcoming Matches</h2>
              <p className="text-muted-foreground">
                Place your predictions before kickoff
              </p>
            </div>
            <Button variant="outline">View All</Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No upcoming matches found.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {matches.map((match) => (
                <div
                  key={match._id}
                  className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(match.date)}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{formatTime(match.date)}</span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center flex-1">
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-secondary/50 border border-border flex items-center justify-center mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={`https://flagcdn.com/w160/${
                            countryFlags[match.teamA] || "unknown"
                          }.png`}
                          alt={`${match.teamA} flag`}
                          className="w-14 h-10 object-cover rounded shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/60x40?text=?";
                          }}
                        />
                      </div>
                      <p className="font-semibold text-lg">{match.teamA}</p>
                    </div>

                    <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-lg font-bold">
                      VS
                    </div>

                    <div className="text-center flex-1">
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-secondary/50 border border-border flex items-center justify-center mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={`https://flagcdn.com/w160/${
                            countryFlags[match.teamB] || "unknown"
                          }.png`}
                          alt={`${match.teamB} flag`}
                          className="w-14 h-10 object-cover rounded shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/60x40?text=?";
                          }}
                        />
                      </div>
                      <p className="font-semibold text-lg">{match.teamB}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{match.venue}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-3 hover:bg-primary/10 hover:border-primary/50"
                      onClick={() =>
                        handlePredictionClick(
                          match,
                          "teamA",
                          match.teamA,
                          match.odds.teamAWin
                        )
                      }
                    >
                      <span className="text-xs text-muted-foreground">
                        {match.teamA}
                      </span>
                      <span className="font-bold text-primary">
                        {match.odds.teamAWin}x
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-3 hover:bg-primary/10 hover:border-primary/50"
                      onClick={() =>
                        handlePredictionClick(
                          match,
                          "draw",
                          "Draw",
                          match.odds.draw
                        )
                      }
                    >
                      <span className="text-xs text-muted-foreground">
                        Draw
                      </span>
                      <span className="font-bold text-primary">
                        {match.odds.draw}x
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-col h-auto py-3 hover:bg-primary/10 hover:border-primary/50"
                      onClick={() =>
                        handlePredictionClick(
                          match,
                          "teamB",
                          match.teamB,
                          match.odds.teamBWin
                        )
                      }
                    >
                      <span className="text-xs text-muted-foreground">
                        {match.teamB}
                      </span>
                      <span className="font-bold text-primary">
                        {match.odds.teamBWin}x
                      </span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
            <p className="text-muted-foreground">Top predictors this season</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/50">
                <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
                  <span>Rank</span>
                  <span>Player</span>
                  <span className="text-center">Wins</span>
                  <span className="text-right">Points</span>
                </div>
              </div>
              {leaderboard.map((player) => (
                <div
                  key={player.rank}
                  className={`p-4 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors ${
                    player.rank <= 3 ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="grid grid-cols-4 items-center">
                    <div className="flex items-center gap-2">
                      {player.rank <= 3 ? (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            player.rank === 1
                              ? "bg-warning/20 text-warning"
                              : player.rank === 2
                              ? "bg-muted-foreground/20 text-muted-foreground"
                              : "bg-warning/10 text-warning/70"
                          }`}
                        >
                          <Trophy className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="w-8 h-8 flex items-center justify-center text-muted-foreground">
                          #{player.rank}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">{player.name}</span>
                    <span className="text-center text-muted-foreground">
                      {player.wins}
                    </span>
                    <span className="text-right font-bold text-primary">
                      {player.points.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">How It Works</h2>
            <p className="text-muted-foreground">
              Simple steps to start winning
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">1. Create Account</h3>
              <p className="text-sm text-muted-foreground">
                Sign up for free and get 100 Vividstream tokens to start
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="font-semibold mb-2">2. Make Predictions</h3>
              <p className="text-sm text-muted-foreground">
                Predict match outcomes and stake your tokens
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">3. Win Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Earn multiplied rewards and redeem for prizes
              </p>
            </div>
          </div>
        </div>
      </section>

      <ChatWidget />

      {/* Prediction Modal */}
      <Dialog
        open={predictionModal.open}
        onOpenChange={(open) =>
          setPredictionModal((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Prediction</DialogTitle>
            <DialogDescription>
              You are betting on <strong>{predictionModal.teamName}</strong>{" "}
              with odds of <strong>{predictionModal.odds}x</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stake">Stake Amount (Doker)</Label>
              <Input
                id="stake"
                type="number"
                placeholder="Enter amount"
                value={wagerAmount}
                onChange={(e) => setWagerAmount(e.target.value)}
              />
            </div>
            {wagerAmount && !isNaN(Number(wagerAmount)) && (
              <div className="p-3 bg-secondary rounded-lg text-sm flex justify-between">
                <span>Potential Win:</span>
                <span className="font-bold text-primary">
                  {(Number(wagerAmount) * predictionModal.odds).toFixed(2)}{" "}
                  Doker
                </span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setPredictionModal((prev) => ({ ...prev, open: false }))
              }
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={submitPrediction}
              disabled={placingBet}
            >
              {placingBet ? "Placing..." : "Confirm Prediction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorldCup;
