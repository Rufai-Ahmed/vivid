import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CartItem, BuyerDetails, CATEGORIES } from "../types";

export function ConfirmationStep({
  cart,
  total,
  buyer,
  onDone,
  isNewUser,
  isLoggedIn,
}: {
  cart: CartItem[];
  total: number;
  buyer: BuyerDetails;
  onDone: () => void;
  isNewUser: boolean;
  isLoggedIn?: boolean;
}) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError("");
    const res = await login(buyer.email, password);
    setIsLoggingIn(false);
    if (res.success) {
      navigate("/dashboard/hotels");
    } else {
      setLoginError(res.error || "Login failed");
    }
  };

  const [ref] = useState(
    "WC26-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  );
  const [boom, setBoom] = useState(false);
  useEffect(() => {
    setBoom(true);
  }, []);

  return (
    <div className="flex flex-col items-center text-center gap-4 relative overflow-hidden pb-4">
      {/* Confetti */}
      {boom &&
        [...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-sm pointer-events-none"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${-5 + Math.random() * 5}%`,
              backgroundColor: [
                "#FFD700",
                "#FF6B35",
                "#4FC3F7",
                "#4ade80",
                "#fff",
                "#f472b6",
              ][i % 6],
              animation: `cfFall ${1.2 + Math.random() * 1.2}s ease-in forwards`,
              animationDelay: `${Math.random() * 0.6}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}

      {/* Icon */}
      <div className="relative mt-2">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,107,53,0.12))",
            border: "2px solid #FFD700",
          }}
        >
          🎉
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-black text-white">
          ✓
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black tracking-widest text-yellow-400">
          YOU'RE IN!
        </h2>
        <p className="text-gray-400 text-sm mt-1 mb-2">
          Booking confirmed for {buyer.email}
        </p>

        {isNewUser ? (
          <div className="bg-yellow-400/10 border border-yellow-400 text-yellow-400 text-sm p-3 rounded-lg mb-4">
            <strong>Check your email!</strong> We've sent you a link to set your
            password so you can access your dashboard and other platform
            features.
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500 text-green-400 text-sm p-3 rounded-lg mb-4">
            <strong>Tickets confirmed!</strong> We've emailed your tickets to{" "}
            {buyer.email}. You can also view them in your dashboard.
          </div>
        )}
      </div>

      {/* Ref */}
      <div className="w-full bg-white/[0.05] border border-yellow-400/30 rounded-2xl px-5 py-4">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
          Booking Reference
        </p>
        <p className="font-mono text-2xl font-black text-yellow-400 tracking-widest">
          {ref}
        </p>
      </div>

      {/* Tickets */}
      <div className="w-full space-y-2">
        {cart.map(({ listing, qty }) => {
          const cat = CATEGORIES.find((c) => c.id === listing.category)!;
          return (
            <div
              key={listing._id}
              className="flex items-center justify-between bg-white/[0.04] border border-[#1f2937] rounded-xl px-4 py-3 text-left"
              style={{ borderLeftColor: cat.color, borderLeftWidth: 3 }}
            >
              <div>
                <p className="text-sm font-bold">
                  {listing.section} · {listing.row}
                </p>
                <p className="text-xs text-gray-500">
                  {qty} ticket{qty > 1 ? "s" : ""} · {listing.view}
                </p>
              </div>
              <p className="font-black text-white">
                ₦{(listing.price * qty).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="w-full flex justify-between items-center border-t border-[#1f2937] pt-3 mb-4">
        <span className="text-sm text-gray-400">Total Paid</span>
        <span className="font-black text-yellow-400 text-lg">
          ₦{total.toLocaleString()}
        </span>
      </div>

      {!isNewUser && !isLoggedIn ? (
        <div className="w-full flex flex-col gap-3 mt-2">
          <div className="text-left space-y-1">
            <label className="text-xs text-gray-400">
              Enter password to log in & proceed
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full bg-white/[0.05] border border-[#374151] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400 transition-colors"
            />
            {loginError && <p className="text-xs text-red-400">{loginError}</p>}
          </div>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn || !password}
            className="w-full rounded-xl py-4 text-sm font-black tracking-widest text-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: "linear-gradient(135deg, #FFD700, #FF6B35)" }}
          >
            {isLoggingIn ? "LOGGING IN..." : "LOGIN TO CONTINUE"}
          </button>
        </div>
      ) : (
        <div className="space-y-3 w-full">
          <button
            onClick={() => navigate("/visa-application")}
            className="w-full rounded-xl py-4 text-sm font-black tracking-widest text-white hover:scale-[1.02] active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #00A987, #00D4AA)" }}
          >
            APPLY FOR VISA
          </button>
          <button
            onClick={onDone}
            className="w-full rounded-xl py-4 text-sm font-black tracking-widest text-black hover:scale-[1.02] active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #FFD700, #FF6B35)" }}
          >
            GO TO DASHBOARD
          </button>
        </div>
      )}
    </div>
  );
}
