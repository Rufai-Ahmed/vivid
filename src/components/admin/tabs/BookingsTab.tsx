/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { ViewModal } from "@/components/admin/ViewModal";
import { endpoints } from "@/config/api";
import { toast } from "sonner";
import { Eye, CheckCircle, XCircle } from "lucide-react";

export const BookingsTab = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [statusFilter, setStatusFilter] = useState("");

  const [viewModal, setViewModal] = useState<{
    open: boolean;
    title: string;
    data: any;
  }>({ open: false, title: "", data: null });

  const fetchBookings = async (page = 1) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      setLoading(true);
      let url = `${endpoints.hotels.getAllBookings}?page=${page}&limit=10`;
      if (statusFilter) {
        url += `&status=${statusFilter}`;
      }
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.docs || []);
        setPagination({
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: "bg-success/20 text-success",
      pending: "bg-warning/20 text-warning",
      cancelled: "bg-destructive/20 text-destructive",
    };
    return (
      styles[status?.toLowerCase()] || "bg-secondary text-secondary-foreground"
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: "bg-success/20 text-success",
      pending: "bg-warning/20 text-warning",
      failed: "bg-destructive/20 text-destructive",
    };
    return (
      styles[status?.toLowerCase()] || "bg-secondary text-secondary-foreground"
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Hotel Bookings</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={statusFilter === "" ? "default" : "outline"}
            onClick={() => setStatusFilter("")}
          >
            All
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "confirmed" ? "default" : "outline"}
            onClick={() => setStatusFilter("confirmed")}
            className="text-success"
          >
            Confirmed
          </Button>
          <Button
            size="sm"
            variant={statusFilter === "pending" ? "default" : "outline"}
            onClick={() => setStatusFilter("pending")}
            className="text-warning"
          >
            Pending
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                ID
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Guest
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Hotel
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Dates
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Total
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Payment
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Booking Status
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-4 text-center text-muted-foreground"
                >
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-t border-border hover:bg-secondary/30"
                >
                  <td className="p-4 font-mono text-sm">
                    {booking._id.substring(0, 8)}...
                  </td>
                  <td className="p-4">
                    {booking.user?.fullName || booking.user?.email || "Guest"}
                  </td>
                  <td className="p-4 font-medium">{booking.hotelName}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium">₦{booking.totalPrice}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadge(
                        booking.paymentStatus,
                      )}`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        booking.bookingStatus,
                      )}`}
                    >
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() =>
                          setViewModal({
                            open: true,
                            title: "Booking Details",
                            data: booking,
                          })
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <PaginationControls
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(page) => fetchBookings(page)}
        isLoading={loading}
      />
      <ViewModal
        open={viewModal.open}
        onOpenChange={(o) => setViewModal((p) => ({ ...p, open: o }))}
        title={viewModal.title}
        data={viewModal.data}
      />
    </div>
  );
};
