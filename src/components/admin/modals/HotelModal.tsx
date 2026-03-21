import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Upload, Check } from "lucide-react";

// Predefined amenities options
const AMENITIES_OPTIONS = [
  "Wifi",
  "Pool",
  "Gym",
  "Spa",
  "Restaurant",
  "Bar",
  "Room Service",
  "Parking",
  "Airport Shuttle",
  "Business Center",
  "Laundry",
  "Concierge",
  "Pet Friendly",
  "Beach Access",
  "Kids Club",
  "Tennis Court",
  "Golf Course",
  "Casino",
  "Nightclub",
];

interface HotelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotel?: any | null;
  onSave: (formData: FormData) => Promise<void>;
}

export const HotelModal = ({
  open,
  onOpenChange,
  hotel,
  onSave,
}: HotelModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    amenities: [] as string[],
    featured: false,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || "",
        location: hotel.location || "",
        price: hotel.price || "",
        description: hotel.description || "",
        amenities: hotel.amenities || [],
        featured: hotel.featured || false,
      });
      setImagePreviews(hotel.images || []);
    } else {
      resetForm();
    }
  }, [hotel, open]);

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      price: "",
      description: "",
      amenities: [],
      featured: false,
    });
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => {
      const currentAmenities = prev.amenities;
      if (currentAmenities.includes(amenity)) {
        return {
          ...prev,
          amenities: currentAmenities.filter((a) => a !== amenity),
        };
      } else {
        return { ...prev, amenities: [...currentAmenities, amenity] };
      }
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, featured: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles].slice(0, 5));

      // Generate previews
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) =>
            [...prev, reader.result as string].slice(0, 5),
          );
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("location", formData.location);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("amenities", JSON.stringify(formData.amenities));
    data.append("featured", String(formData.featured));
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        data.append("images", file);
      });
    }

    try {
      await onSave(data);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{hotel ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="images">Hotel Images (max 5)</Label>
            <div className="flex flex-col gap-4">
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreviews((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                          setImageFiles((prev) =>
                            prev.filter((_, i) => i !== index),
                          );
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="cursor-pointer"
                  disabled={imagePreviews.length >= 5}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {imagePreviews.length}/5 images selected
                </p>
              </div>
            </div>
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Hotel Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="price">Price (per night)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label>Amenities</Label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_OPTIONS.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                    formData.amenities.includes(amenity)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary text-muted-foreground border-border hover:bg-secondary/80"
                  }`}
                >
                  {formData.amenities.includes(amenity) && (
                    <Check className="w-3 h-3 inline-block mr-1" />
                  )}
                  {amenity}
                </button>
              ))}
            </div>
            {formData.amenities.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                {formData.amenities.length} amenity selected
              </p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="featured">Featured Hotel</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="gradient" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {hotel ? "Update Hotel" : "Create Hotel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
