/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/bloc/Header/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
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
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { endpoints } from "@/config/api";

const Hotels = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingLoading, setBookingLoading] = useState<string | null>(null); // Stores ID of hotel being booked

  // Payment Modal State
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    bookingId: string | null;
    amount: number;
    hotelName: string;
  }>({
    open: false,
    bookingId: null,
    amount: 0,
    hotelName: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHotels(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchHotels = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(pagination.limit),
          search: searchQuery,
        });

        const response = await fetch(
          `${endpoints.hotels.getAll}?${queryParams}`
        );
        if (response.ok) {
          const data = await response.json();
          setHotels(data.docs || []);
          setPagination((prev) => ({
            ...prev,
            page: data.page,
            totalPages: data.totalPages,
          }));
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
        toast.error("Failed to load hotels");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, pagination.limit]
  );

  const handleBook = async (hotel: any) => {
    if (!user) {
      toast.error("Please login to book a hotel");
      return;
    }

    setBookingLoading(String(hotel.id));

    // Mock booking data (normally would come from a modal/form)
    const bookingData = {
      userId: user.id,
      hotelName: hotel.name,
      location: hotel.location,
      checkInDate: new Date().toISOString(), // Default: today
      checkOutDate: new Date(Date.now() + 86400000).toISOString(), // Default: tomorrow
      guests: 1,
      rooms: 1,
      totalPrice: hotel.price,
    };

    try {
      const response = await fetch(endpoints.hotels.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Booking failed");

      toast.success(`Booking request sent for ${hotel.name}!`);

      // Open payment modal
      setPaymentModal({
        open: true,
        bookingId: data.booking._id,
        amount: hotel.price,
        hotelName: hotel.name,
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setBookingLoading(null);
    }
  };

  const handlePayment = async () => {
    if (!user || !paymentModal.bookingId) return;

    setIsProcessingPayment(true);
    try {
      const response = await fetch(endpoints.hotels.pay, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          amount: paymentModal.amount,
          currency: "USD", // Or dynamic
          paymentMethod,
          type: "hotel_booking",
          relatedEntityId: paymentModal.bookingId,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Payment initialization failed");

      if (paymentMethod === "card" && data.authorization_url) {
        // Redirect to Paystack
        window.location.href = data.authorization_url;
      } else if (paymentMethod === "crypto" && data.invoiceUrl) {
        // Redirect to BitPay
        window.location.href = data.invoiceUrl;
      } else {
        toast.success("Payment initiated!");
        setPaymentModal((prev) => ({ ...prev, open: false }));
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

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
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => handleBook(hotel)}
                      disabled={bookingLoading === String(hotel.id)}
                    >
                      {bookingLoading === String(hotel.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Book Now"
                      )}
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

      {/* Payment Modal */}
      <Dialog
        open={paymentModal.open}
        onOpenChange={(open) => setPaymentModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
            <DialogDescription>
              Pay for your stay at <strong>{paymentModal.hotelName}</strong>.
              Amount: <strong>${paymentModal.amount}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(val: any) => setPaymentMethod(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">
                    Credit/Debit Card (Paystack)
                  </SelectItem>
                  <SelectItem value="crypto">Crypto (BitPay)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setPaymentModal((prev) => ({ ...prev, open: false }))
              }
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChatWidget />
    </div>
  );
};

export default Hotels;
