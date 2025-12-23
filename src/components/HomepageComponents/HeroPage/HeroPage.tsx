import { colors, worldCupCountries } from "@/types/types";
import { Trophy, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroPage = () => {
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentCountry = worldCupCountries[currentCountryIndex];
    const fullText = `${currentCountry.flag} ${currentCountry.name}`;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < fullText.length) {
            setDisplayText(fullText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 1500);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentCountryIndex(
              (prev) => (prev + 1) % worldCupCountries.length
            );
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentCountryIndex]);

  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-50 dark:opacity-100" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow " />

      {/* Floating Trophy Elements */}
      <div className="absolute top-40 right-20 text-6xl animate-bounce opacity-20">
        🏆
      </div>
      <div className="absolute bottom-32 left-20 text-4xl animate-pulse opacity-20">
        ⚽
      </div>
      <div
        className="absolute top-60 left-1/4 text-3xl animate-bounce opacity-15"
        style={{ animationDelay: "0.5s" }}
      >
        🥇
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
            <Trophy className="w-4 h-4 text-[gold]" />
            <span className="text-[12px] lg:text-[14px] font-medium text-primary">
              FIFA World Cup 2026
            </span>
            <span className="text-sm font-medium text-primary border-l border-primary/30 pl-2 min-w-[140px] text-left">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Your Gateway to
            <span className="text-gradient"> World Cup 2026</span>
          </h1>

          <p
            className="text-lg text-secondary-foreground mb-8 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Redeem winning tickets, apply for visas, and book hotels — all in
            one seamless platform. Experience the biggest sporting event with
            Vividstream Pro.
          </p>

          {/* Animated Flags Marquee with Images */}
          <div
            className="mb-8  overflow-hidden animate-fade-in"
            style={{ animationDelay: "0.25s" }}
          >
            <div className="flex gap-3 animate-scroll-left">
              {[...worldCupCountries, ...worldCupCountries].map(
                (country, index) => {
                  const colorClass = colors[index % colors.length];

                  return (
                    <div
                      key={index}
                      className={`flex-shrink-0 flex items-center gap-3 px-5 py-2 rounded-xl border backdrop-blur-sm shadow-lg hover:scale-105 transition-transform duration-300 ${colorClass}`}
                    >
                      <img
                        src={country.flagImg}
                        alt={country.name}
                        className="w-8 h-6 object-cover rounded shadow-md"
                      />
                      <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                        {country.name}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/signup">
              <Button variant="hero" size="xl">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="glass" size="xl">
                Explore World Cup
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
