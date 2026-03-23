export type CategoryId = 1 | 2 | 3 | 4;
export type CheckoutStep =
  | "stadium"
  | "cart"
  | "details"
  | "payment"
  | "confirmation";

export interface Category {
  id: CategoryId;
  labelKey: string;
  color: string;
  minPrice: number;
}

export interface StadiumTicketListing {
  _id: string;
  section: string;
  row: string;
  category: CategoryId;
  price: number;
  ticketsAvailable: number;
  rating: number;
  tag: "Best Price" | "Best Deal" | "Best View" | null;
  view: string;
}

export interface CartItem {
  listing: StadiumTicketListing;
  qty: number;
}

export interface BuyerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
  slip?: File | null;
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    labelKey: "stadium.categories.labels.cat1",
    color: "#FFD700",
    minPrice: 1480,
  },
  {
    id: 2,
    labelKey: "stadium.categories.labels.cat2",
    color: "#FF6B35",
    minPrice: 620,
  },
  {
    id: 3,
    labelKey: "stadium.categories.labels.cat3",
    color: "#4FC3F7",
    minPrice: 303,
  },
  {
    id: 4,
    labelKey: "stadium.categories.labels.cat4",
    color: "#9E9E9E",
    minPrice: 363,
  },
];
