import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { apiFetch, endpoints } from "@/config/api";
import { X, Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  CategoryId,
  CheckoutStep,
  StadiumTicketListing,
  CartItem,
  BuyerDetails,
  PaymentDetails,
  CATEGORIES,
} from "./types";
import { StepIndicator } from "./components/StepIndicator";
import { CartStep } from "./components/CartStep";
import { DetailsStep } from "./components/DetailsStep";
import { PaymentStep } from "./components/PaymentStep";
import { ConfirmationStep } from "./components/ConfirmationStep";

const RING_PATHS: { cat: CategoryId; d: string }[] = [
  {
    cat: 4,
    d: "M162,100 Q340,55 400,55 Q460,55 638,100 Q705,168 705,265 Q705,362 638,430 Q460,475 400,475 Q340,475 162,430 Q95,362 95,265 Q95,168 162,100 Z M195,128 Q340,88 400,88 Q460,88 605,128 Q665,188 665,265 Q665,342 605,402 Q460,442 400,442 Q340,442 195,402 Q135,342 135,265 Q135,188 195,128 Z",
  },
  {
    cat: 3,
    d: "M195,128 Q340,88 400,88 Q460,88 605,128 Q665,188 665,265 Q665,342 605,402 Q460,442 400,442 Q340,442 195,402 Q135,342 135,265 Q135,188 195,128 Z M225,155 Q340,118 400,118 Q460,118 575,155 Q625,205 625,265 Q625,325 575,375 Q460,412 400,412 Q340,412 225,375 Q175,325 175,265 Q175,205 225,155 Z",
  },
  {
    cat: 2,
    d: "M225,155 Q340,118 400,118 Q460,118 575,155 Q625,205 625,265 Q625,325 575,375 Q460,412 400,412 Q340,412 225,375 Q175,325 175,265 Q175,205 225,155 Z M255,175 Q340,145 400,145 Q460,145 545,175 Q585,215 585,265 Q585,315 545,355 Q460,385 400,385 Q340,385 255,355 Q215,315 215,265 Q215,215 255,175 Z",
  },
  {
    cat: 1,
    d: "M255,175 Q340,145 400,145 Q460,145 545,175 Q585,215 585,265 Q585,315 545,355 Q460,385 400,385 Q340,385 255,355 Q215,315 215,265 Q215,215 255,175 Z M282,192 Q340,167 400,167 Q460,167 518,192 Q548,222 548,265 Q548,308 518,338 Q460,363 400,363 Q340,363 282,338 Q252,308 252,265 Q252,222 282,192 Z",
  },
];

const FIELD_PATH =
  "M282,192 Q340,167 400,167 Q460,167 518,192 Q548,222 548,265 Q548,308 518,338 Q460,363 400,363 Q340,363 282,338 Q252,308 252,265 Q252,222 282,192 Z";

const PRICE_LABELS = [
  { cat: 1 as CategoryId, x: 400, y: 143, price: "₦1,480+" },
  { cat: 2 as CategoryId, x: 400, y: 110, price: "₦620+" },
  { cat: 3 as CategoryId, x: 400, y: 77, price: "₦303+" },
  { cat: 4 as CategoryId, x: 400, y: 44, price: "₦363+" },
];

const TAG_STYLES: Record<string, { color: string; bg: string; emoji: string; labelKey: string }> =
  {
    "Best Price": {
      color: "#4FC3F7",
      bg: "rgba(79,195,247,0.12)",
      emoji: "💰",
      labelKey: "stadium.bestPrice",
    },
    "Best Deal": { color: "#4ade80", bg: "rgba(74,222,128,0.12)", emoji: "🏷️", labelKey: "stadium.bestDeal" },
    "Best View": { color: "#FFD700", bg: "rgba(255,215,0,0.12)", emoji: "👁️", labelKey: "stadium.bestView" },
  };

function CheckoutDrawer({
  open,
  step,
  cart,
  total,
  buyer,
  payment,
  processing,
  isNewUser,
  isLoggedIn,
  onClose,
  onStepChange,
  onQtyChange,
  onRemove,
  onBuyerChange,
  onPaymentChange,
  onPay,
  onDone,
}: {
  open: boolean;
  step: CheckoutStep;
  cart: CartItem[];
  total: number;
  buyer: BuyerDetails;
  payment: PaymentDetails;
  processing: boolean;
  isNewUser: boolean;
  isLoggedIn?: boolean;
  onClose: () => void;
  onStepChange: (s: CheckoutStep) => void;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onBuyerChange: (d: BuyerDetails) => void;
  onPaymentChange: (p: PaymentDetails) => void;
  onPay: () => void;
  onDone: () => void;
}) {
  const { t } = useTranslation();
  const titles: Partial<Record<CheckoutStep, string>> = {
    cart: t("stadium.checkout.titles.cart"),
    details: t("stadium.checkout.titles.details"),
    payment: t("stadium.checkout.titles.payment"),
    confirmation: t("stadium.checkout.titles.confirmation"),
  };

  return (
    <>
      <div
        className="absolute inset-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: open ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)",
          pointerEvents: open ? "auto" : "none",
          backdropFilter: open ? "blur(3px)" : "none",
        }}
        onClick={onClose}
      />
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-[420px] max-w-[100vw] border-l border-[#1f2937] flex flex-col transition-transform duration-300 ease-out overflow-x-hidden"
        style={{
          transform: open ? "translateX(0)" : "translateX(100%)",
          background: "#0f172a",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2937] shrink-0 bg-gradient-to-r from-[#0d1117] to-[#111827]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.06] hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            >
              ✕
            </button>
            <h2 className="font-black text-sm tracking-widest uppercase text-white">
              {titles[step]}
            </h2>
          </div>
          {step !== "confirmation" && (
            <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-3 py-1 text-xs text-yellow-400 font-bold">
              ⚽ {t("stadium.badge")}
            </div>
          )}
        </div>

        {step !== "confirmation" && (
          <div className="px-5 pt-5 shrink-0">
            <StepIndicator current={step} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-2">
          {step === "cart" && (
            <CartStep
              cart={cart}
              onQtyChange={onQtyChange}
              onRemove={onRemove}
              onBack={onClose}
              onNext={() => onStepChange("details")}
            />
          )}
          {step === "details" && (
            <DetailsStep
              details={buyer}
              onChange={onBuyerChange}
              onBack={() => onStepChange("cart")}
              onNext={() => onStepChange("payment")}
            />
          )}
          {step === "payment" && (
            <PaymentStep
              payment={payment}
              onChange={onPaymentChange}
              total={total}
              onBack={() => onStepChange("details")}
              onNext={onPay}
              processing={processing}
            />
          )}
          {step === "confirmation" && (
            <ConfirmationStep
              cart={cart}
              total={total}
              buyer={buyer}
              onDone={onDone}
              isNewUser={isNewUser}
              isLoggedIn={isLoggedIn}
            />
          )}
        </div>
      </div>
    </>
  );
}

interface StadiumProps {
  auth: { user: unknown | null };
  loginPath?: string;
}

const Stadium = ({ auth: { user }, loginPath = "/login" }: StadiumProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // We no longer require login to purchase a stadium ticket. The purchase *is* the guest signup.

  const [listings, setListings] = useState<StadiumTicketListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const [selected, setSelected] = useState<CategoryId | null>(null);
  const [hovered, setHovered] = useState<CategoryId | null>(null);
  const [ticketCount, setTicketCount] = useState(2);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [processing, setProcessing] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (isMaximized) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMaximized]);

  const [buyer, setBuyer] = useState<BuyerDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [payment, setPayment] = useState<PaymentDetails>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  useEffect(() => {
    // Fill the buyer email if user is logged in
    if (
      user &&
      typeof user === "object" &&
      "email" in user &&
      "fullName" in user
    ) {
      const u = user as any;
      const parts = u.fullName?.split(" ") || ["", ""];
      setBuyer({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
        email: u.email || "",
        phone: "",
      });
    }

    const fetchListings = async () => {
      try {
        setLoadingListings(true);
        const res = await apiFetch(endpoints.tickets.stadium.all);
        if (res.ok) {
          const data = await res.json();
          setListings(data.docs || []);
        }
      } catch (err) {
        console.error("Failed to fetch stadium tickets", err);
      } finally {
        setLoadingListings(false);
      }
    };
    fetchListings();
  }, [user]);

  const activeCat = selected ?? hovered;
  const activeCatInfo = activeCat
    ? CATEGORIES.find((c) => c.id === activeCat)
    : null;
  const filtered = selected
    ? listings.filter((l) => l.category === selected)
    : listings;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const subtotal = cart.reduce((s, i) => s + i.listing.price * i.qty, 0);
  const total = subtotal + Math.round(subtotal * 0.12);

  const getColor = (id: CategoryId) =>
    CATEGORIES.find((c) => c.id === id)!.color;
  const fillOpacity = (cat: CategoryId) =>
    !activeCat ? 0.22 : cat === activeCat ? 0.55 : 0.05;
  const strokeOpacity = (cat: CategoryId) =>
    !activeCat ? 0.4 : cat === activeCat ? 0.95 : 0.1;
  const glowFilter = (cat: CategoryId) =>
    cat === activeCat ? `drop-shadow(0 0 10px ${getColor(cat)})` : undefined;
  const toggle = (cat: CategoryId) =>
    setSelected((prev) => (prev === cat ? null : cat));

  const addToCart = (listing: StadiumTicketListing) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.listing._id === listing._id);
      if (exists)
        return prev.map((i) =>
          i.listing._id === listing._id
            ? {
                ...i,
                qty: Math.min(listing.ticketsAvailable, i.qty + ticketCount),
              }
            : i,
        );
      return [
        ...prev,
        { listing, qty: Math.min(listing.ticketsAvailable, ticketCount) },
      ];
    });
  };

  const openCheckout = () => {
    setCheckoutStep("cart");
    setDrawerOpen(true);
  };

  const handlePay = async () => {
    setProcessing(true);
    try {
      // Map frontend cart format to backend format
      const formattedCart = cart.map((item) => ({
        listingId: item.listing._id,
        qty: item.qty,
      }));

      const res = await apiFetch(endpoints.tickets.stadium.purchase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyer,
          cart: formattedCart,
          payment,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsNewUser(data.isNewUser);
        setCheckoutStep("confirmation");
        // Remove from listings locally
        const fetchRes = await apiFetch(endpoints.tickets.stadium.all);
        if (fetchRes.ok) {
          const fetchedData = await fetchRes.json();
          setListings(fetchedData.docs || []);
        }
      } else {
        const err = await res.json();
        toast.error(err.message || t("stadium.checkout.loadError"));
      }
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setProcessing(false);
    }
  };

  const handleDone = () => {
    setDrawerOpen(false);
    setCart([]);
    setCheckoutStep("cart");
    setBuyer({ firstName: "", lastName: "", email: "", phone: "" });
    setPayment({ cardNumber: "", expiry: "", cvv: "", nameOnCard: "" });
    if (isNewUser && !user) {
      navigate(loginPath);
    } else {
      navigate("/dashboard/hotels");
    }
  };

  const renderStadium = (isMax = false) => (
    <div
      className={`text-white overflow-hidden font-sans relative flex-1 bg-[#0a0c10] transition-all duration-500 ease-in-out ${
        isMax
          ? "h-screen w-screen flex flex-col"
          : "relative h-[680px] md:h-[580px] rounded-3xl border border-[#1f2937]"
      }`}
    >
      {/* ── Banner ───────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2937] bg-[#0a0c10]/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-base shadow-lg shadow-yellow-400/20">
            ⚽
          </div>
          <div>
            <p className="font-black text-base tracking-widest text-yellow-400  leading-none">
              {t("stadium.badge")}
            </p>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-0.5">
              {t("stadium.platform")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="font-semibold text-sm text-secondary-foreground">
              {t("stadium.matchInfo")}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {t("stadium.matchDetails")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {cartCount > 0 && (
              <button
                onClick={openCheckout}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl border border-yellow-400/40 bg-yellow-400/10 hover:bg-yellow-400/20 transition-all"
              >
                <span>🛒</span>
                <span className="text-sm font-bold text-yellow-400">
                  {t("stadium.checkout.confirmation.ticketCount", {
                    count: cartCount,
                  })}
                </span>
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">
                  {cartCount}
                </span>
              </button>
            )}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-gray-400 hover:text-white"
              title={isMax ? "Minimize" : "Full Screen"}
            >
              {isMax ? (
                <X className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────── */}
      <div
        className={`flex flex-col md:flex-row transition-all duration-500 group relative ${
          isMax ? "flex-1 min-h-0" : "h-[calc(100%-73px)] cursor-pointer"
        }`}
        onClick={() => !isMax && setIsMaximized(true)}
      >
        {!isMax && (
          <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center pointer-events-none">
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2">
              <Maximize2 className="w-4 h-4" />
              {t("stadium.clickToExpand")}
            </div>
          </div>
        )}
        {/* Left */}
        <div className="flex flex-col flex-[0_0_56%] px-5 py-4 gap-3 border-r border-[#1f2937] overflow-hidden">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => toggle(cat.id)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border text-secondary-foreground"
                style={{
                  borderColor: selected === cat.id ? cat.color : "transparent",
                  backgroundColor:
                    selected === cat.id
                      ? cat.color + "22"
                      : "rgba(255,255,255,0.05)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full text-secondary-foreground"
                  style={{ backgroundColor: cat.color }}
                />
                {t(cat.labelKey)}
                <span className="font-bold" style={{ color: cat.color }}>
                  ₦{cat.minPrice}+
                </span>
              </button>
            ))}
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="px-3 py-1.5 rounded-full text-xs text-gray-400 border border-[#374151] hover:bg-white/10 transition-all"
              >
                {t("stadium.clear")}
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center min-h-0">
            <svg
              viewBox="60 30 680 490"
              className="w-full h-full max-h-full"
              style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.9))" }}
            >
              <defs>
                <radialGradient id="sc-fieldGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="55%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#14532d" />
                </radialGradient>
                <radialGradient id="sc-bgGrad" cx="50%" cy="50%" r="60%">
                  <stop offset="0%" stopColor="#1a1f2e" />
                  <stop offset="100%" stopColor="#0a0c10" />
                </radialGradient>
              </defs>
              <ellipse
                cx="400"
                cy="265"
                rx="375"
                ry="258"
                fill="url(#sc-bgGrad)"
              />
              <ellipse
                cx="400"
                cy="265"
                rx="375"
                ry="258"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="2"
              />
              {RING_PATHS.map(({ cat, d }) => (
                <path
                  key={cat}
                  d={d}
                  fillRule="evenodd"
                  fill={getColor(cat)}
                  fillOpacity={fillOpacity(cat)}
                  stroke={getColor(cat)}
                  strokeWidth={cat === activeCat ? 2 : 0.8}
                  strokeOpacity={strokeOpacity(cat)}
                  className="cursor-pointer"
                  style={{
                    filter: glowFilter(cat),
                    transition:
                      "fill-opacity 0.25s, stroke-opacity 0.25s, filter 0.25s",
                  }}
                  onClick={() => toggle(cat)}
                  onMouseEnter={() => setHovered(cat)}
                  onMouseLeave={() => setHovered(null)}
                />
              ))}
              <path d={FIELD_PATH} fill="url(#sc-fieldGrad)" />
              <ellipse
                cx="400"
                cy="265"
                rx="133"
                ry="88"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
              />
              <line
                x1="400"
                y1="169"
                x2="400"
                y2="361"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
              />
              <circle cx="400" cy="265" r="4" fill="rgba(255,255,255,0.6)" />
              <rect
                x="318"
                y="218"
                width="54"
                height="68"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
              />
              <rect
                x="428"
                y="218"
                width="54"
                height="68"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
              />
              {!activeCat &&
                PRICE_LABELS.map((lbl) => (
                  <g key={lbl.cat}>
                    <rect
                      x={lbl.x - 34}
                      y={lbl.y - 11}
                      width={68}
                      height={22}
                      rx={11}
                      fill="rgba(0,0,0,0.82)"
                      stroke={getColor(lbl.cat)}
                      strokeWidth="1"
                    />
                    <text
                      x={lbl.x}
                      y={lbl.y + 5}
                      textAnchor="middle"
                      fill={getColor(lbl.cat)}
                      fontSize="11"
                      fontWeight="700"
                      fontFamily="sans-serif"
                    >
                      {lbl.price}
                    </text>
                  </g>
                ))}
              {activeCatInfo &&
                (() => {
                  const ls = listings.filter(
                    (l) => l.category === activeCatInfo.id,
                  );
                  const minP =
                    ls.length > 0
                      ? Math.min(...ls.map((l) => l.price))
                      : CATEGORIES.find((c) => c.id === activeCatInfo.id)
                          ?.minPrice || 0;
                  return (
                    <g>
                      <rect
                        x="305"
                        y="238"
                        width="190"
                        height="56"
                        rx="13"
                        fill="rgba(0,0,0,0.92)"
                        stroke={activeCatInfo.color}
                        strokeWidth="1.5"
                      />
                      <text
                        x="400"
                        y="262"
                        textAnchor="middle"
                        fill={activeCatInfo.color}
                        fontSize="14"
                        fontWeight="700"
                        fontFamily="sans-serif"
                        letterSpacing="2"
                      >
                        {t(activeCatInfo.labelKey).toUpperCase()}
                      </text>
                      <text
                        x="400"
                        y="282"
                        textAnchor="middle"
                        fill="#d1d5db"
                        fontSize="11"
                        fontFamily="sans-serif"
                      >
                        {t("stadium.fromPrice", {
                          price: minP.toLocaleString(),
                          count: ls.length,
                        })}
                      </text>
                    </g>
                  );
                })()}
            </svg>
          </div>

          <div className="shrink-0 bg-white/[0.06] border border-[#1f2937] rounded-xl px-3 md:px-4 py-2.5 flex items-center justify-between">
            <div className="flex gap-6">
              {[
                {
                  label: t("stadium.listings"),
                  value: listings.length.toString(),
                },
                { label: t("stadium.venue"), value: "MetLife Stadium" },
                { label: t("stadium.capacity"), value: "82,500" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest">
                    {s.label}
                  </p>
                  <p className="text-xs font-semibold text-gray-200 mt-0.5">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
            <p className="md:text-[11px] text-[9px] text-center text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-lg md:px-3 px-0 py-2 md:py-1.5">
              {t("stadium.guaranteedAuthenticShort")}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1f2937] shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg tracking-widest uppercase text-gray-200">
                {t("stadium.listingsCount", { count: filtered.length })}
              </h3>
              {activeCatInfo && (
                <span
                  className="text-sm font-medium"
                  style={{ color: activeCatInfo.color }}
                >
                  · {t(activeCatInfo.labelKey)}
                </span>
              )}
            </div>
            <div className="flex items-center bg-white/[0.06] border border-[#374151] rounded-full overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTicketCount((n) => Math.max(1, n - 1));
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-300 font-bold hover:bg-white/10"
              >
                −
              </button>
              <span className="px-2 text-xs font-semibold min-w-[78px] text-center text-gray-200">
                {t("stadium.checkout.confirmation.ticketCount", {
                  count: ticketCount,
                })}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTicketCount((n) => Math.min(10, n + 1));
                }}
                className="w-8 h-8 flex items-center justify-center text-gray-300 font-bold hover:bg-white/10"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-2.5 flex flex-col gap-2">
            {loadingListings ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                {t("common.loading")}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">
                {t("stadium.noTickets")}
              </div>
            ) : (
              filtered.map((listing, i) => {
                const cat = CATEGORIES.find((c) => c.id === listing.category)!;
                const tagStyle = listing.tag ? TAG_STYLES[listing.tag] : null;
                const inCart = cart.some((ci) => ci.listing._id === listing._id);
                return (
                  <div
                    key={listing._id}
                    className="bg-white/[0.04] border border-[#1f2937] rounded-xl p-3 hover:bg-white/[0.07] hover:translate-x-1 transition-all duration-200 cursor-pointer"
                    style={{
                      borderLeftColor: cat.color,
                      borderLeftWidth: 3,
                      animationDelay: `${i * 0.06}s`,
                    }}
                    onMouseEnter={() => setHovered(listing.category)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-sm text-gray-200">
                            {listing.section}
                          </span>
                          <span className="text-xs text-gray-500">
                            · {listing.row}
                          </span>
                          {tagStyle && listing.tag && (
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                              style={{
                                color: tagStyle.color,
                                backgroundColor: tagStyle.bg,
                                borderColor: tagStyle.color + "55",
                              }}
                            >
                              {tagStyle.emoji} {t(tagStyle.labelKey)}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-3 text-[11px] text-gray-400 mb-1.5">
                          <span>
                            👥{" "}
                            {t("stadium.available", {
                              count: listing.ticketsAvailable,
                            })}
                          </span>
                          <span>
                            {t("stadium.viewLabel", { view: listing.view })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span
                            className="text-[11px] font-medium"
                            style={{ color: cat.color }}
                          >
                            {t(cat.labelKey)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <div className="text-right">
                          <p className="font-black text-xl leading-none text-gray-200">
                            ₦{(listing.price * ticketCount).toLocaleString()}
                          </p>
                          {ticketCount > 1 && (
                            <p className="text-[10px] text-gray-500">
                              ₦{listing.price}/
                              {t("stadium.checkout.confirmation.ticket_one", {
                                count: 1,
                              })}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-green-700 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                            {listing.rating}
                          </span>
                          <span className="text-[11px] font-semibold text-green-400">
                            {t("stadium.amazing")}
                          </span>
                        </div>
                        {inCart ? (
                          <button
                            onClick={openCheckout}
                            className="text-[11px] font-bold px-3.5 py-1.5 rounded-lg border border-yellow-400/50 text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20 transition-all"
                          >
                            {t("stadium.inCart")}
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(listing);
                            }}
                            className="text-black text-[11px] font-bold px-3.5 py-1.5 rounded-lg hover:scale-105 active:scale-95 transition-all"
                            style={{
                              background: cat.color,
                              boxShadow: `0 4px 12px ${cat.color}44`,
                            }}
                          >
                            {t("stadium.addToCart")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="md:px-3 px-2 py-2 md:py-3 border-t border-[#1f2937] flex items-center gap-2.5 shrink-0">
            <div className="flex-1 bg-white/[0.09] border border-[#1f2937] rounded-xl md:px-3 md:py-2 px-2 py-3 md:text-[11px] text-gray-400 text-[10px]">
              {t("stadium.buyerGuarantee")}
              {cartCount > 0 && (
                <span className="text-yellow-400 ml-1 font-semibold">
                  ·{" "}
                  {t("stadium.checkout.confirmation.ticketCount", {
                    count: cartCount,
                  })}{" "}
                  {t("stadium.inCart").replace(" ✓", "").toLowerCase()}
                </span>
              )}
            </div>

            <button
              onClick={openCheckout}
              disabled={cartCount === 0}
              className="font-black tracking-widest text-sm px-6 py-2.5 rounded-xl text-black transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FF6B35)",
                animation:
                  cartCount > 0 ? "scPulseGold 2s ease-in-out infinite" : "none",
              }}
            >
              {cartCount > 0
                ? t("stadium.checkoutCount", { count: cartCount })
                : t("stadium.checkoutButton")}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scPulseGold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0.5); }
          50%       { box-shadow: 0 0 18px 5px rgba(255,215,0,0.18); }
        }
      `}</style>
    </div>
  );

  return (
    <>
      <div className={isMaximized ? "hidden" : ""}>{renderStadium(false)}</div>

      <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
        <DialogContent className="max-w-none w-screen h-screen p-0 border-none bg-[#0a0c10] z-[9999] overflow-hidden">
          {renderStadium(true)}
        </DialogContent>
      </Dialog>

      <CheckoutDrawer
        open={drawerOpen}
        step={checkoutStep}
        cart={cart}
        total={total}
        buyer={buyer}
        payment={payment}
        processing={processing}
        isNewUser={isNewUser}
        isLoggedIn={!!user}
        onClose={() => setDrawerOpen(false)}
        onStepChange={setCheckoutStep}
        onQtyChange={(id, qty) =>
          setCart((p) =>
            p.map((i) => (i.listing._id === id ? { ...i, qty } : i)),
          )
        }
        onRemove={(id) => setCart((p) => p.filter((i) => i.listing._id !== id))}
        onBuyerChange={setBuyer}
        onPaymentChange={setPayment}
        onPay={handlePay}
        onDone={handleDone}
      />
    </>
  );
};

export default Stadium;
