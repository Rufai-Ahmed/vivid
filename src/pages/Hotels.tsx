import { useState } from "react";
import { Navbar } from "@/components/bloc/Header/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Hotel,
  MapPin,
  Star,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Search,
  Filter,
  CreditCard,
  Bitcoin,
} from "lucide-react";

const Hotels = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const hotels = [
    {
      id: 1,
      name: "Grand Plaza Hotel",
      location: "New Jersey, USA",
      rating: 4.8,
      reviews: 1250,
      price: 299,
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      amenities: ["wifi", "parking", "breakfast", "gym"],
      featured: true,
    },
    {
      id: 2,
      name: "Skyline Suites",
      location: "Los Angeles, USA",
      rating: 4.6,
      reviews: 890,
      price: 349,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      amenities: ["wifi", "parking", "breakfast"],
      featured: false,
    },
    {
      id: 3,
      name: "Ocean View Resort",
      location: "Miami, USA",
      rating: 4.9,
      reviews: 2100,
      price: 449,
      image:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      amenities: ["wifi", "parking", "breakfast", "gym"],
      featured: true,
    },
    {
      id: 4,
      name: "Downtown Inn",
      location: "Texas, USA",
      rating: 4.4,
      reviews: 650,
      price: 199,
      image:
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
      amenities: ["wifi", "breakfast"],
      featured: false,
    },
  ];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "parking":
        return <Car className="w-4 h-4" />;
      case "breakfast":
        return <Coffee className="w-4 h-4" />;
      case "gym":
        return <Dumbbell className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50 dark:opacity-100" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Hotel className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Premium Hotels
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Perfect
              <span className="text-gradient"> Stay</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8">
              Book premium accommodations near World Cup venues with exclusive
              partner rates.
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by city, hotel name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
              <Button variant="gradient" size="lg" className="px-6">
                <Filter className="w-5 h-5 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-8 px-4 border-y border-border bg-secondary/30">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="font-medium">Payment Methods:</span>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span>Credit/Debit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <Bitcoin className="w-4 h-4" />
              <span>Crypto (BTC, ETH, USDT)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Available Hotels</h2>
              <p className="text-muted-foreground">
                {hotels.length} properties found
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {hotel.featured && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-warning text-warning" />
                      <span className="font-medium">{hotel.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.location}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {hotel.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground"
                        title={amenity}
                      >
                        {getAmenityIcon(amenity)}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ${hotel.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /night
                      </span>
                    </div>
                    <Button variant="gradient" size="sm">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="rounded-3xl gradient-primary p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Complete Your Visa First
            </h2>
            <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
              Hotel booking is unlocked after your visa application is approved.
              Start your application today!
            </p>
            <Button
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Apply for Visa
            </Button>
          </div>
        </div>
      </section>

      <ChatWidget />
    </div>
  );
};

export default Hotels;
