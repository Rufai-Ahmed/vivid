import { Navbar } from "@/components/bloc/Header/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import HeroPage from "@/components/HomepageComponents/HeroPage/HeroPage";
import WorldCupShowcase from "@/components/HomepageComponents/WorldCupshowcase/WorldCupShowcase";
import Stats from "@/components/HomepageComponents/Stats/Stats";
import Features from "@/components/HomepageComponents/Features/Features";
import WorldCupCTA from "@/components/HomepageComponents/WorldCupCTA/WorldCupCTA";
import TrustSection from "@/components/HomepageComponents/TrustSection/TrustSection";
import Footer from "@/components/Footer/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <HeroPage />

      {/* World Cup Countries Showcase - Modern Slider */}
      <WorldCupShowcase />

      {/* Stats Section */}
      <Stats />

      {/* Features Section */}
      <Features />

      {/* World Cup CTA Section */}
      <WorldCupCTA />

      {/* Trust Section */}
      <TrustSection />

      {/* Footer */}
      <Footer />

      <ChatWidget />
    </div>
  );
};

export default Index;
