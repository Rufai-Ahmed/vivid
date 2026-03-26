import { useTranslation } from "react-i18next";
import { Ticket } from "lucide-react";
import { CartItem, CATEGORIES } from "../types";

export function CartStep({
  cart,
  onQtyChange,
  onRemove,
  onBack,
  onNext,
}: {
  cart: CartItem[];
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { t } = useTranslation();
  const subtotal = cart.reduce((s, i) => s + i.listing.price * i.qty, 0);
  const fees = Math.round(subtotal * 0.12);
  const total = subtotal + fees;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-5xl text-primary">
          <Ticket className="w-16 h-16" />
        </div>
        <p className="text-gray-400 text-sm">{t("stadium.noTickets")}</p>
        <button
          onClick={onBack}
          className="text-yellow-400 text-sm font-semibold hover:underline"
        >
          ← {t("stadium.subtitle")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        {cart.map(({ listing, qty }) => {
          const cat = CATEGORIES.find((c) => c.id === listing.category)!;
          return (
            <div
              key={listing._id}
              className="bg-white/[0.05] border border-[#1f2937] rounded-2xl p-4"
              style={{ borderLeftColor: cat.color, borderLeftWidth: 3 }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">{listing.section}</span>
                    <span className="text-xs text-gray-500">
                      · {listing.row}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-xs" style={{ color: cat.color }}>
                        {t(cat.labelKey)}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        · {listing.view}
                      </span>
                    </div>
                    {listing.address && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-xs text-gray-500">
                          📍 {listing.address}
                        </span>
                      </div>
                    )}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {t("stadium.checkout.cart.qtyLabel")}:
                    </span>
                    <div className="flex items-center bg-white/[0.06] border border-[#374151] rounded-full overflow-hidden">
                      <button
                        onClick={() =>
                          qty > 1
                            ? onQtyChange(listing._id, qty - 1)
                            : onRemove(listing._id)
                        }
                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/10 text-sm font-bold transition-colors"
                      >
                        −
                      </button>
                      <span className="px-3 text-sm font-bold">{qty}</span>
                      <button
                        onClick={() =>
                          onQtyChange(
                            listing._id,
                            Math.min(listing.ticketsAvailable, qty + 1),
                          )
                        }
                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/10 text-sm font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-xl">
                    ${(listing.price * qty).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    ${listing.price}/
                    {t("stadium.checkout.confirmation.ticketCount_one", {
                      count: 1,
                    })}
                  </p>
                  <button
                    onClick={() => onRemove(listing._id)}
                    className="text-[11px] text-red-400/60 hover:text-red-400 mt-2 transition-colors block"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-white/[0.03] border border-[#1f2937] rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-400">
          <span>{t("stadium.summary.listings")}</span>
          <span className="text-white">${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-400">
          <span>{t("stadium.checkout.cart.serviceFee", { percent: 12 })}</span>
          <span className="text-white">${fees.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-black text-base border-t border-[#1f2937] pt-2 mt-1">
          <span className="text-white">{t("common.confirm", "Total")}</span>
          <span className="text-yellow-400">${total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 border border-[#374151] rounded-xl py-3 text-sm text-gray-400 hover:bg-white/5 transition-all"
        >
          ← {t("common.back")}
        </button>
        <button
          onClick={onNext}
          className="flex-[2] rounded-xl py-3 text-sm font-black tracking-widest text-black hover:scale-[1.02] active:scale-95 transition-all"
          style={{ background: "linear-gradient(135deg, #FFD700, #FF6B35)" }}
        >
          {t("common.continue").toUpperCase()} →
        </button>
      </div>
    </div>
  );
}
