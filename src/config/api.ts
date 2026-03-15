export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ---------------------------------------------------------------------------
// Centralised fetch wrapper with automatic 401 → logout handling
// ---------------------------------------------------------------------------

/** Registered by AuthContext so apiFetch can trigger logout without circular deps. */
let _logoutHandler: (() => void) | null = null;

export function setLogoutHandler(handler: () => void) {
  _logoutHandler = handler;
}

/**
 * Drop-in replacement for `fetch` that:
 *  - Automatically attaches the stored Bearer token (if present)
 *  - Calls the registered logout handler when the server returns 401
 */
export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem("token");

  const headers = new Headers(init.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, { ...init, headers });

  if (response.status === 401) {
    if (_logoutHandler) {
      _logoutHandler();
    } else {
      // Fallback: clear storage directly if handler not yet registered
      localStorage.removeItem("vividstream_user");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }

  return response;
}

export const endpoints = {
  auth: {
    login: `${API_BASE_URL}/users/login-user`,
    register: `${API_BASE_URL}/users/register-user`,
    getAll: `${API_BASE_URL}/users/get-all-users`,
    profile: (id: string) => `${API_BASE_URL}/users/${id}`,
    update: (id: string) => `${API_BASE_URL}/users/${id}`,
    delete: (id: string) => `${API_BASE_URL}/users/${id}`,
    logout: `${API_BASE_URL}/users/logout`,
    setPassword: `${API_BASE_URL}/users/set-password`,
  },
  visa: {
    create: `${API_BASE_URL}/visa-applications/apply-visa`,
    getAll: `${API_BASE_URL}/visa-applications/get-visa-applications`,
    getOne: (id: string) =>
      `${API_BASE_URL}/visa-applications/get-visa-application/${id}`,
    update: (id: string) => `${API_BASE_URL}/visa-applications/${id}`,
    delete: (id: string) => `${API_BASE_URL}/visa-applications/${id}`,
  },
  tickets: {
    redeem: `${API_BASE_URL}/tickets/redeem`,
    myTickets: (userId: string) => `${API_BASE_URL}/tickets/user/${userId}`,
    getAll: `${API_BASE_URL}/tickets/all`,
    create: `${API_BASE_URL}/tickets/create`,
    update: (id: string) => `${API_BASE_URL}/tickets/${id}`,
    delete: (id: string) => `${API_BASE_URL}/tickets/${id}`,
    stadium: {
      all: `${API_BASE_URL}/tickets/stadium/all`,
      create: `${API_BASE_URL}/tickets/stadium/create`,
      update: (id: string) => `${API_BASE_URL}/tickets/stadium/${id}`,
      delete: (id: string) => `${API_BASE_URL}/tickets/stadium/${id}`,
      purchase: `${API_BASE_URL}/tickets/stadium/purchase`,
    },
  },
  worldcup: {
    matches: `${API_BASE_URL}/worldcup/matches`,
    updateMatch: (id: string) => `${API_BASE_URL}/worldcup/matches/${id}`,
    deleteMatch: (id: string) => `${API_BASE_URL}/worldcup/matches/${id}`,
    predict: `${API_BASE_URL}/worldcup/predictions`,
    myPredictions: (userId: string) =>
      `${API_BASE_URL}/worldcup/predictions/${userId}`,
    getAllPredictions: `${API_BASE_URL}/worldcup/predictions/all`,
    deletePrediction: (id: string) =>
      `${API_BASE_URL}/worldcup/predictions/${id}`,
  },
  hotels: {
    create: `${API_BASE_URL}/hotels/book`,
    myBookings: (userId: string) =>
      `${API_BASE_URL}/hotels/bookings/user/${userId}`,
    pay: `${API_BASE_URL}/hotels/pay`,
    verifyPayment: `${API_BASE_URL}/hotels/transactions/verify`,
    getAllTransactions: `${API_BASE_URL}/hotels/transactions/all`,
    deleteTransaction: (id: string) =>
      `${API_BASE_URL}/hotels/transactions/${id}`,
    getAll: `${API_BASE_URL}/hotels`,
    createHotel: `${API_BASE_URL}/hotels`,
    updateHotel: (id: string) => `${API_BASE_URL}/hotels/${id}`,
    deleteHotel: (id: string) => `${API_BASE_URL}/hotels/${id}`,
    getAllBookings: `${API_BASE_URL}/hotels/bookings/all`,
    updateTransactionStatus: (id: string) =>
      `${API_BASE_URL}/hotels/transactions/${id}/status`,
    updateBookingStatus: (id: string) =>
      `${API_BASE_URL}/hotels/bookings/${id}/status`,
  },
  admin: {
    stats: `${API_BASE_URL}/admin/stats`,
    getAdmins: `${API_BASE_URL}/admin/admins`,
  },
  bulkTickets: {
    getAll: `${API_BASE_URL}/bulk-tickets/all`,
    getOne: (id: string) => `${API_BASE_URL}/bulk-tickets/${id}`,
    create: `${API_BASE_URL}/bulk-tickets/create`,
    parse: `${API_BASE_URL}/bulk-tickets/parse`,
    retry: (id: string) => `${API_BASE_URL}/bulk-tickets/${id}/retry`,
    redeem: `${API_BASE_URL}/bulk-tickets/redeem`,
    template: `${API_BASE_URL}/bulk-tickets/template`,
  },
};
