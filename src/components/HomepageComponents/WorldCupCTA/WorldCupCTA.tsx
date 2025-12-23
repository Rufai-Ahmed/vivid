import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const WorldCupCTA = () => {
  return (
    <section className="py-0 lg:py-14 px-4">
      <div className="container mx-auto">
        <div className="relative rounded-3xl overflow-hidden gradient-accent p-8 md:p-16">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 text-[150px] opacity-10">
            🏆
          </div>
          <div className="absolute top-10 right-20 text-6xl opacity-20">⚽</div>
          <div className="relative z-10 max-w-2xl">
            <div className="flex gap-2 mb-4">
              <span className="text-3xl text-[gold]">🇺🇸</span>
              <span className="text-3xl text-[red]">🇲🇽</span>
              <span className="text-3xl text-[orange]">🇨🇦</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
              World Cup 2026 Predictions
            </h2>
            <p className="text-accent-foreground/80 mb-8">
              The biggest FIFA World Cup ever with 48 teams! Predict match
              outcomes, earn Vividstream rewards, and redeem them for exclusive
              prizes. Join thousands of fans competing for glory.
            </p>
            <Link to="/signup">
              <Button
                size="xl"
                className="bg-accent-foreground text-accent hover:bg-accent-foreground/90"
              >
                Start Predicting
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorldCupCTA;
