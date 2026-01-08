/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { HotelModal } from "@/components/admin/modals/HotelModal";
import { DeleteModal } from "@/components/admin/DeleteModal";
import { endpoints } from "@/config/api";
import { toast } from "sonner";
import { Edit, Trash2, Plus, MapPin, DollarSign } from "lucide-react";

export const HotelsTab = () => {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [hotelModal, setHotelModal] = useState<{
    open: boolean;
    hotel: any | null;
  }>({
    open: false,
    hotel: null,
  });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    id: string | null;
    name: string;
  }>({
    open: false,
    id: null,
    name: "",
  });

  const fetchHotels = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${endpoints.hotels.getAll}?page=${page}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setHotels(data.docs || []);
        setPagination({
          page: data.page,
          limit: data.limit,
          totalPages: data.totalPages,
        });
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast.error("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSaveHotel = async (formData: FormData) => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      let response;
      if (hotelModal.hotel) {
        // Update
        response = await fetch(
          endpoints.hotels.updateHotel(hotelModal.hotel._id),
          {
            method: "PUT",
            headers, // Do not set Content-Type for FormData, browser sets it with boundary
            body: formData,
          }
        );
      } else {
        // Create
        response = await fetch(endpoints.hotels.createHotel, {
          method: "POST",
          headers,
          body: formData,
        });
      }

      if (response.ok) {
        toast.success(
          `Hotel ${hotelModal.hotel ? "updated" : "created"} successfully`
        );
        fetchHotels(pagination.page);
      } else {
        const err = await response.json();
        throw new Error(err.message || "Operation failed");
      }
    } catch (error: any) {
      console.error("Error saving hotel:", error);
      toast.error(error.message);
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(endpoints.hotels.deleteHotel(String(id)), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Hotel deleted successfully");
        fetchHotels(pagination.page);
        setDeleteModal((prev) => ({ ...prev, open: false }));
      } else {
        const err = await response.json();
        throw new Error(err.message || "Failed to delete hotel");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">Hotel Management</h3>
        <Button
          size="sm"
          variant="gradient"
          onClick={() => setHotelModal({ open: true, hotel: null })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Hotel
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Image
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Name
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Location
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Price
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Featured
              </th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center">
                  Loading...
                </td>
              </tr>
            ) : hotels.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground"
                >
                  No hotels found.
                </td>
              </tr>
            ) : (
              hotels.map((hotel) => (
                <tr
                  key={hotel._id}
                  className="border-t border-border hover:bg-secondary/30 transition-colors"
                >
                  <td className="p-4">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-4 font-medium">{hotel.name}</td>
                  <td className="p-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {hotel.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 font-medium text-primary">
                      <DollarSign className="w-3 h-3" />
                      {hotel.price}
                    </div>
                  </td>
                  <td className="p-4">
                    {hotel.featured ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        Featured
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                        Standard
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() =>
                          setHotelModal({ open: true, hotel: hotel })
                        }
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() =>
                          setDeleteModal({
                            open: true,
                            id: hotel._id,
                            name: hotel.name,
                          })
                        }
                      >
                        <Trash2 className="w-4 h-4" />
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
        onPageChange={(page) => fetchHotels(page)}
        isLoading={loading}
      />

      <HotelModal
        open={hotelModal.open}
        onOpenChange={(open) => setHotelModal((prev) => ({ ...prev, open }))}
        hotel={hotelModal.hotel}
        onSave={handleSaveHotel}
      />

      <DeleteModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal((prev) => ({ ...prev, open }))}
        title={`Delete ${deleteModal.name}?`}
        itemId={deleteModal.id || ""}
        onConfirm={handleDelete}
      />
    </div>
  );
};
