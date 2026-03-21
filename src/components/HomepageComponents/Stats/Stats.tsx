import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

type CounterProps = {
  value: string;
  start: boolean;
  duration?: number;
};

const Counter = ({ value, start, duration = 2000 }: CounterProps) => {
  const number = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = Number((progress * number).toFixed(1));

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [start, number, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

/* ------------------ STATS SECTION ------------------ */
const Stats = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [startCount, setStartCount] = useState(false);

  const stats = [
    { value: "50K+", label: t("stats.ticketsRedeemed") },
    { value: "120+", label: t("stats.countriesServed") },
    { value: "99.9%", label: t("stats.uptime") },
    { value: "2/47", label: t("stats.support") },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="px-4 ">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="shadow-sm hover:shadow-xl py-4 rounded-md text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2 ">
                <Counter value={stat.value} start={startCount} />
              </div>

              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
