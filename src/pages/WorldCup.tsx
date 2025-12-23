import { Navbar } from "@/components/bloc/Header/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Users,
  Star,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const WorldCup = () => {
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

  const matches = [
    {
      id: 1,
      teamA: "USA",
      teamB: "Brazil",
      date: "June 15, 2026",
      time: "20:00",
      venue: "MetLife Stadium, New Jersey",
      odds: { teamA: 2.5, draw: 3.2, teamB: 2.1 },
    },
    {
      id: 2,
      teamA: "Germany",
      teamB: "France",
      date: "June 16, 2026",
      time: "17:00",
      venue: "AT&T Stadium, Texas",
      odds: { teamA: 2.3, draw: 3.0, teamB: 2.4 },
    },
    {
      id: 3,
      teamA: "Argentina",
      teamB: "Spain",
      date: "June 17, 2026",
      time: "14:00",
      venue: "SoFi Stadium, Los Angeles",
      odds: { teamA: 2.0, draw: 3.5, teamB: 2.8 },
    },
    {
      id: 4,
      teamA: "England",
      teamB: "Portugal",
      date: "June 18, 2026",
      time: "20:00",
      venue: "Hard Rock Stadium, Miami",
      odds: { teamA: 2.4, draw: 3.1, teamB: 2.3 },
    },
  ];

  const leaderboard = [
    { rank: 1, name: "Alex Champion", points: 12500, wins: 45 },
    { rank: 2, name: "Sarah Winner", points: 11200, wins: 42 },
    { rank: 3, name: "Mike Predictor", points: 10800, wins: 40 },
    { rank: 4, name: "Emily Goals", points: 9500, wins: 35 },
    { rank: 5, name: "David Score", points: 8900, wins: 33 },
  ];

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

          <div className="grid md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{match.date}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{match.time}</span>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-center flex-1">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-secondary/50 border border-border flex items-center justify-center mb-3 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={`https://flagcdn.com/w160/${
                          countryFlags[match.teamA]
                        }.png`}
                        alt={`${match.teamA} flag`}
                        className="w-14 h-10 object-cover rounded shadow-md"
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
                          countryFlags[match.teamB]
                        }.png`}
                        alt={`${match.teamB} flag`}
                        className="w-14 h-10 object-cover rounded shadow-md"
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
                  >
                    <span className="text-xs text-muted-foreground">
                      {match.teamA}
                    </span>
                    <span className="font-bold text-primary">
                      {match.odds.teamA}x
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-3 hover:bg-primary/10 hover:border-primary/50"
                  >
                    <span className="text-xs text-muted-foreground">Draw</span>
                    <span className="font-bold text-primary">
                      {match.odds.draw}x
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-3 hover:bg-primary/10 hover:border-primary/50"
                  >
                    <span className="text-xs text-muted-foreground">
                      {match.teamB}
                    </span>
                    <span className="font-bold text-primary">
                      {match.odds.teamB}x
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default WorldCup;
