export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const endpoints = {
  auth: {
    login: `${API_BASE_URL}/users/login-user`,
    register: `${API_BASE_URL}/users/register-user`,
    getAll: `${API_BASE_URL}/users/get-all-users`,
    profile: (id: string) => `${API_BASE_URL}/users/${id}`,
    update: (id: string) => `${API_BASE_URL}/users/${id}`,
    delete: (id: string) => `${API_BASE_URL}/users/${id}`,
    logout: `${API_BASE_URL}/users/logout`,
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
    delete: (id: string) => `${API_BASE_URL}/tickets/${id}`,
  },
  worldcup: {
    matches: `${API_BASE_URL}/worldcup/matches`,
    predict: `${API_BASE_URL}/worldcup/predictions`,
    myPredictions: (userId: string) =>
      `${API_BASE_URL}/worldcup/predictions/${userId}`,
    getAllPredictions: `${API_BASE_URL}/worldcup/predictions/all`,
  },
  hotels: {
    create: `${API_BASE_URL}/hotels/book`,
    myBookings: (userId: string) => `${API_BASE_URL}/hotels/user/${userId}`,
    pay: `${API_BASE_URL}/hotels/pay`,
    verifyPayment: `${API_BASE_URL}/hotels/transactions/verify`,
    getAllTransactions: `${API_BASE_URL}/hotels/transactions/all`,
    getAll: `${API_BASE_URL}/hotels`,
    createHotel: `${API_BASE_URL}/hotels`,
    updateHotel: (id: string) => `${API_BASE_URL}/hotels/${id}`,
    deleteHotel: (id: string) => `${API_BASE_URL}/hotels/${id}`,
  },
  admin: {
    stats: `${API_BASE_URL}/admin/stats`,
  },
};
