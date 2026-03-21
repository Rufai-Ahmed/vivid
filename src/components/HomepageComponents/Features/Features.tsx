import { useTranslation } from "react-i18next";
import { Ticket, Plane, Hotel, Trophy } from "lucide-react";

const features = [
  {
    icon: Ticket,
    titleKey: "features.ticketRedemption.title",
    descKey: "features.ticketRedemption.description",
  },
  {
    icon: Plane,
    titleKey: "features.visaServices.title",
    descKey: "features.visaServices.description",
  },
  {
    icon: Hotel,
    titleKey: "features.hotelBooking.title",
    descKey: "features.hotelBooking.description",
  },
  {
    icon: Trophy,
    titleKey: "features.worldCupBetting.title",
    descKey: "features.worldCupBetting.description",
  },
];

const Features = () => {
  const { t } = useTranslation();
  
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t("features.title")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t(feature.titleKey)}</h3>
              <p className="text-sm text-muted-foreground">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
