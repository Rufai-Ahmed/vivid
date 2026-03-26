/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { shuffle } from "lodash";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { Navbar } from "@/components/bloc/Header/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
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
  Waves,
  Sprout,
  Beer,
  Palmtree,
  UtensilsCrossed,
  Bus,
  WashingMachine,
  PawPrint,
  Dices,
  Flag,
  Trophy,
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

import { endpoints, apiFetch } from "@/config/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingFormModal } from "@/components/hotels/BookingFormModal";
import { MyBookingsTab } from "@/components/hotels/MyBookingsTab";

// Hotel Image Carousel Component with auto-sliding
const HotelImageCarousel = ({ hotel }: { hotel: any }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!hotel.images || hotel.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % hotel.images.length);
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, [hotel.images]);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(
      (prev) => (prev - 1 + hotel.images.length) % hotel.images.length,
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % hotel.images.length);
  };

  if (!hotel.images || hotel.images.length === 0) {
    return (
      <div className="relative h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  return (
    <div className="relative h-48 overflow-hidden group">
      <img
        src={hotel.images[currentIndex]}
        alt={hotel.name}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Navigation Arrows */}
      {hotel.images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {hotel.images.map((_: any, idx: number) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {hotel.featured && (
        <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
          Featured
        </div>
      )}
    </div>
  );
};

const Hotels = () => {
  const { t } = useTranslation();
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
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "crypto" | "manual"
  >("manual");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [globalSettings, setGlobalSettings] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);

  // Booking Form State
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

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

        const [hotelsRes, settingsRes] = await Promise.all([
          apiFetch(`${endpoints.hotels.getAll}?${queryParams}`),
          apiFetch(endpoints.cryptoWallets.getActive),
        ]);

        if (hotelsRes.ok) {
          const data = await hotelsRes.json();
          const shuffled = shuffle(data.docs || []);
          setHotels(shuffled);
          setPagination((prev) => ({
            ...prev,
            page: data.page,
            totalPages: data.totalPages,
          }));
        }

        if (settingsRes.ok) {
          setGlobalSettings(await settingsRes.json());
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
        toast.error("Failed to load hotels");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, pagination.limit],
  );

  const initiateBooking = (hotel: any) => {
    if (!user) {
      toast.error("Please login to book a hotel");
      return;
    }
    setSelectedHotel(hotel);
    setBookingFormOpen(true);
  };

  const handleBookingConfirm = async (bookingData: any) => {
    setBookingLoading("processing");
    try {
      const response = await apiFetch(endpoints.hotels.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Booking failed");

      toast.success(`Booking request sent! Check your email for details.`);
      setBookingFormOpen(false);

      // Open payment modal
      setPaymentModal({
        open: true,
        bookingId: data.booking._id,
        amount: data.booking.totalPrice,
        hotelName: selectedHotel.name,
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
      const response = await apiFetch(endpoints.hotels.pay, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          amount: paymentModal.amount,
          currency: "NGN", // Or dynamic
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
        toast.success(
          "Payment initiated! Please complete the transfer to verify your booking.",
        );
        setPaymentModal((prev) => ({ ...prev, open: false }));
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    switch (a) {
      case "wifi":
        return <Wifi className="w-4 h-4" />;
      case "parking":
        return <Car className="w-4 h-4" />;
      case "breakfast":
      case "restaurant":
        return <Coffee className="w-4 h-4" />;
      case "gym":
        return <Dumbbell className="w-4 h-4" />;
      case "pool":
        return <Waves className="w-4 h-4" />;
      case "spa":
        return <Sprout className="w-4 h-4" />;
      case "bar":
      case "nightclub":
        return <Beer className="w-4 h-4" />;
      case "beach access":
        return <Palmtree className="w-4 h-4" />;
      case "room service":
        return <UtensilsCrossed className="w-4 h-4" />;
      case "airport shuttle":
        return <Bus className="w-4 h-4" />;
      case "laundry":
        return <WashingMachine className="w-4 h-4" />;
      case "pet friendly":
        return <PawPrint className="w-4 h-4" />;
      case "casino":
        return <Dices className="w-4 h-4" />;
      case "golf course":
        return <Flag className="w-4 h-4" />;
      case "tennis court":
        return <Trophy className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4 opacity-50" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <Tabs defaultValue="browse" className="w-full">
        <div className="container mx-auto px-4 pt-24 pb-4 flex justify-center sticky top-0 z-40 bg-background/80 backdrop-blur-md">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="browse">Browse Hotels</TabsTrigger>
            <TabsTrigger value="my-bookings">My Bookings</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="browse">
          {/* Hero Section */}
          <section className="pt-8 pb-16 px-4 relative overflow-hidden">
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
                  Book premium accommodations near World Cup venues with
                  exclusive partner rates.
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
                  <p className="text-muted-foreground">1200 properties found</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Image Carousel */}
                    <HotelImageCarousel hotel={hotel} />

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

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {hotel.amenities?.slice(0, 4).map((amenity: string) => (
                          <div
                            key={amenity}
                            className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground"
                            title={amenity}
                          >
                            {getAmenityIcon(amenity)}
                          </div>
                        ))}
                        {hotel.amenities?.length > 4 && (
                          <span className="text-xs text-muted-foreground">
                            +{hotel.amenities.length - 4}
                          </span>
                        )}
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
                          onClick={() => initiateBooking(hotel)}
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchHotels(pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-4">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchHotels(pagination.page + 1)}
                    disabled={
                      pagination.page === pagination.totalPages || loading
                    }
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
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
                  Hotel booking is unlocked after your visa application is
                  approved. Start your application today!
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
        </TabsContent>

        <TabsContent value="my-bookings">
          <div className="container mx-auto px-4 py-8 pt-8">
            <h2 className="text-2xl font-bold mb-6">My Hotel Reservations</h2>
            <MyBookingsTab
              onPay={(booking) =>
                setPaymentModal({
                  open: true,
                  bookingId: booking._id,
                  amount: booking.totalPrice,
                  hotelName: booking.hotelName,
                })
              }
            />
          </div>
        </TabsContent>
      </Tabs>

      <BookingFormModal
        open={bookingFormOpen}
        onOpenChange={setBookingFormOpen}
        hotel={selectedHotel}
        onConfirm={handleBookingConfirm}
        loading={bookingLoading === "processing"}
      />

      {/* Payment Modal */}
      <Dialog
        open={paymentModal.open}
        onOpenChange={(open) => setPaymentModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="max-w-md bg-[#0a0a0b] border-white/5">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              Complete Your Booking
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Pay for your stay at{" "}
              <span className="text-white font-semibold">
                {paymentModal.hotelName}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="flex justify-between items-end p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
              <span className="text-xs text-gray-500 uppercase tracking-widest">
                Total Amount
              </span>
              <span className="text-3xl font-black text-white tracking-tighter">
                ${paymentModal.amount.toLocaleString()}
              </span>
            </div>

            {wallets.length > 0 ? (
              <div className="space-y-4">
                {/* Wallet Selection */}
                <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/20 rounded-2xl p-6 flex flex-col items-center text-center space-y-2">
                  <Bitcoin className="w-10 h-10 text-primary animate-bounce-slow" />
                  <h3 className="font-bold text-white uppercase tracking-wider">
                    Crypto Payment
                  </h3>
                </div>

                {/* Wallet Selector */}
                <select
                  value={selectedWallet?._id || ""}
                  onChange={(e) => {
                    const wallet = wallets.find((w) => w._id === e.target.value);
                    setSelectedWallet(wallet || null);
                  }}
                  className="w-full bg-[#1a1a2e] border border-[#374151] rounded-xl px-4 py-3 text-white"
                >
                  {wallets.map((wallet) => (
                    <option key={wallet._id} value={wallet._id}>
                      {wallet.cryptocurrency} ({wallet.network})
                    </option>
                  ))}
                </select>

                {selectedWallet && (
                  <div className="space-y-3">
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center group relative">
                      <div className="w-full pr-10">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                          Wallet Address
                        </p>
                        <p className="font-mono text-sm text-yellow-400 break-all leading-tight">
                          {selectedWallet.address}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-white/10"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedWallet.address);
                          toast.success("Address copied!");
                        }}
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>

                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                          Network
                        </p>
                        <p className="font-bold text-white uppercase">
                          {selectedWallet.network}
                        </p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                  </div>
                )}

                <div className="p-4 bg-yellow-400/5 border border-yellow-400/10 rounded-xl">
                  <p className="text-[10px] text-yellow-400 uppercase tracking-widest mb-1 font-bold">
                    Important
                  </p>
                  <p className="text-[11px] text-yellow-400/70 leading-relaxed">
                    Once sent, our team will verify the transaction on the blockchain. Your booking will be confirmed within 1-2 hours.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center space-y-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Bitcoin className="w-6 h-6 text-red-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-red-100 uppercase tracking-wider">
                    Payment Not Configured
                  </p>
                  <p className="text-xs text-red-400/60 max-w-[200px] mx-auto">
                    Please contact support to complete your hotel booking.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button
              className="w-full h-12 text-sm font-black tracking-widest uppercase transition-all active:scale-[0.98]"
              variant="gradient"
              onClick={handlePayment}
              disabled={
                isProcessingPayment || wallets.length === 0
              }
            >
              {isProcessingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "I'VE SENT PAYMENT"
              )}
            </Button>
            <Button
              variant="ghost"
              className="w-full h-10 text-xs text-gray-500 hover:text-white"
              onClick={() =>
                setPaymentModal((prev) => ({ ...prev, open: false }))
              }
            >
              CANCEL TRANSACTION
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChatWidget />
    </div>
  );
};

export default Hotels;
