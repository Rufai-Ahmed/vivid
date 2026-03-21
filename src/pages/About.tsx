import { Navbar } from "@/components/bloc/Header/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Trophy,
  Globe,
  Shield,
  Users,
  Star,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  Ticket,
  Plane,
  Building2,
  CreditCard,
} from "lucide-react";

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50 dark:opacity-100" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow " />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Trophy className="w-4 h-4 text-[gold]" />
              <span className="text-sm font-medium text-primary">
                About Vividstream Pro
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Gateway to
              <span className="text-gradient"> World Cup 2026</span>
            </h1>

            <p className="text-lg text-secondary-foreground mb-8 max-w-2xl mx-auto">
              We are the premier platform for FIFA World Cup 2026 ticket
              management, visa applications, and travel accommodations.
              Experience the world's biggest sporting event seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">500K+</div>
              <div className="text-muted-foreground">
                {t("about.stats.ticketsProcessed")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">150+</div>
              <div className="text-muted-foreground">
                {t("about.stats.countriesServed")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">50K+</div>
              <div className="text-muted-foreground">
                {t("about.stats.hotelsBooked")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2">99.9%</div>
              <div className="text-muted-foreground">
                {t("about.stats.uptime")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground text-lg">
                To provide football fans worldwide with seamless access to FIFA
                World Cup 2026 experiences through innovative technology, secure
                transactions, and exceptional customer service.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                <Globe className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-3xl font-bold">Our Vision</h2>
              <p className="text-muted-foreground text-lg">
                To become the global leader in sports event management
                platforms, connecting fans with their dream World Cup
                experiences while setting new standards for reliability and
                convenience in the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What We Do</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide comprehensive solutions for World Cup enthusiasts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Ticket Management */}
            <div className="bg-background p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <Ticket className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Ticket Management</h3>
              <p className="text-muted-foreground">
                Secure ticket purchase, redemption, and management through our
                streamlined digital platform. Verified tickets guaranteed.
              </p>
            </div>

            {/* Visa Application */}
            <div className="bg-background p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <Plane className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visa Application</h3>
              <p className="text-muted-foreground">
                Simplified visa application process with expert guidance. We
                help navigate the documentation requirements for a hassle-free
                experience.
              </p>
            </div>

            {/* Hotel Booking */}
            <div className="bg-background p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Hotel Booking</h3>
              <p className="text-muted-foreground">
                Access to exclusive hotel deals near stadiums and fan zones.
                From luxury suites to budget-friendly options.
              </p>
            </div>

            {/* Secure Payments */}
            <div className="bg-background p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Payments</h3>
              <p className="text-muted-foreground">
                Multiple payment options including credit cards and
                cryptocurrency. Your transactions are protected with bank-level
                security.
              </p>
            </div>

            {/* Customer Support */}
            <div className="bg-background p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-muted-foreground">
                Round-the-clock customer support in multiple languages. Our team
                is here to assist you at every step of your journey.
              </p>
            </div>

            {/* Verified Experience */}
            <div className="bg-background p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Verified Experience
              </h3>
              <p className="text-muted-foreground">
                Every ticket and booking is verified through official channels.
                Guaranteed authentic experiences for all customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose Vividstream Pro?
              </h2>
              <div className="space-y-4">
                {[
                  "Official FIFA World Cup 2026 partner",
                  "Secure and verified ticket transactions",
                  "Competitive pricing with price match guarantee",
                  "Easy redemption process",
                  "Dedicated customer success team",
                  "Multiple payment options",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/signup">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 gradient-hero opacity-30 rounded-3xl" />
              <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">4.9/5 Customer Rating</h4>
                      <p className="text-sm text-muted-foreground">
                        Based on 10,000+ reviews
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">SSL Secured</h4>
                      <p className="text-sm text-muted-foreground">
                        256-bit encryption for all transactions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">500K+ Happy Customers</h4>
                      <p className="text-sm text-muted-foreground">
                        Worldwide fan base
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Get In Touch
            </h2>
            <p className="text-muted-foreground text-lg mb-12">
              Have questions? We'd love to hear from you.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-2xl border border-border/50">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-muted-foreground text-sm">
                  119 W 33rd St
                  <br />
                  New York, NY 10001
                  <br />
                  USA
                </p>
              </div>
              {/* <div className="bg-background p-6 rounded-2xl border border-border/50">
                <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground text-sm">
                  support@vividstreampro.com
                  <br />
                  sales@vividstreampro.com
                </p>
              </div> */}
              <div className="bg-background p-6 rounded-2xl border border-border/50">
                <Phone className="w-8 h-8 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground text-sm">
                  +1 (929) 459-5216
                  <br />
                  Mon-Fri, 9am-6pm EST
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 text-center">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iJyNmZmZmZmYyMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
                Ready for World Cup 2026?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of fans who have already secured their spots for
                the biggest sporting event in the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button variant="secondary" size="lg" className="gap-2">
                    Get Started <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/redeem-ticket">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2"
                  >
                    Redeem Ticket
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
};

export default About;
