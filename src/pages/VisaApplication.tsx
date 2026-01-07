import { useState } from "react";
import { Navbar } from "@/components/bloc/Header/Navbar";
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plane,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Clock,
  User,
  FileText,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

import { endpoints } from "@/config/api";

const VisaApplication = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    // Passport Details
    passportNumber: "",
    passportExpiry: "",
    placeOfIssue: "",
    // Travel Info
    destination: "",
    travelPurpose: "",
    arrivalDate: "",
    departureDate: "",
    accommodationAddress: "",
    additionalNotes: "",
  });

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Passport Details", icon: FileText },
    { number: 3, title: "Travel Info", icon: MapPin },
    { number: 4, title: "Review", icon: CheckCircle },
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const validateForm = () => {
    const requiredFields = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone,
      formData.dateOfBirth,
      formData.nationality,
      formData.passportNumber,
      formData.passportExpiry,
      formData.placeOfIssue,
      formData.destination,
      formData.travelPurpose,
      formData.arrivalDate,
      formData.departureDate,
      formData.accommodationAddress,
    ];

    if (requiredFields.some((field) => !field.trim())) {
      toast.error("Please fill in all required fields.");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        passportNumber: formData.passportNumber,
        passportExpiryDate: formData.passportExpiry,
        passportPlaceOfIssue: formData.placeOfIssue,
        destinationCountry: formData.destination,
        travelPurpose: formData.travelPurpose,
        arrivalDate: formData.arrivalDate,
        departureDate: formData.departureDate,
        accommodationAddress: formData.accommodationAddress,
        additionalNotes: formData.additionalNotes,
      };

      const response = await fetch(endpoints.visa.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      const data = await response.json();
      toast.success(
        "Visa application submitted successfully! Check your email for confirmation."
      );
      setStep(1);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        nationality: "",
        passportNumber: "",
        passportExpiry: "",
        placeOfIssue: "",
        destination: "",
        travelPurpose: "",
        arrivalDate: "",
        departureDate: "",
        accommodationAddress: "",
        additionalNotes: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Plane className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Visa Application
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Apply for Your Visa</h1>
            <p className="text-muted-foreground">
              Complete the form below to start your visa application process.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        step >= s.number
                          ? "gradient-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <s.icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs mt-2 ${
                        step >= s.number
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-full h-1 mx-2 rounded ${
                        step > s.number ? "bg-primary" : "bg-secondary"
                      }`}
                      style={{ minWidth: "40px" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="rounded-2xl border border-border bg-card p-8">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">
                  Personal Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(v) =>
                        setFormData({ ...formData, nationality: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="ng">Nigeria</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Passport Details */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">Passport Details</h2>
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input
                    id="passportNumber"
                    value={formData.passportNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        passportNumber: e.target.value,
                      })
                    }
                    placeholder="Enter passport number"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passportExpiry">Expiry Date</Label>
                    <Input
                      id="passportExpiry"
                      type="date"
                      value={formData.passportExpiry}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          passportExpiry: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placeOfIssue">Place of Issue</Label>
                    <Input
                      id="placeOfIssue"
                      value={formData.placeOfIssue}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          placeOfIssue: e.target.value,
                        })
                      }
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Travel Info */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">
                  Travel Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination Country</Label>
                    <Select
                      value={formData.destination}
                      onValueChange={(v) =>
                        setFormData({ ...formData, destination: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="mx">Mexico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purpose">Travel Purpose</Label>
                    <Select
                      value={formData.travelPurpose}
                      onValueChange={(v) =>
                        setFormData({ ...formData, travelPurpose: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tourism">Tourism</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="sports">Sports Event</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="arrival">Arrival Date</Label>
                    <Input
                      id="arrival"
                      type="date"
                      value={formData.arrivalDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          arrivalDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departure">Departure Date</Label>
                    <Input
                      id="departure"
                      type="date"
                      value={formData.departureDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          departureDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accommodation">Accommodation Address</Label>
                  <Textarea
                    id="accommodation"
                    value={formData.accommodationAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accommodationAddress: e.target.value,
                      })
                    }
                    placeholder="Enter hotel or accommodation address"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.additionalNotes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        additionalNotes: e.target.value,
                      })
                    }
                    placeholder="Any additional information..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-semibold mb-6">
                  Review Your Application
                </h2>

                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Personal Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">Name:</span>{" "}
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {formData.email}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {formData.phone}
                      </p>
                      <p>
                        <span className="text-muted-foreground">DOB:</span>{" "}
                        {formData.dateOfBirth}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Nationality:
                        </span>{" "}
                        {formData.nationality}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Passport Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">
                          Passport No:
                        </span>{" "}
                        {formData.passportNumber}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Expiry:</span>{" "}
                        {formData.passportExpiry}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Place of Issue:
                        </span>{" "}
                        {formData.placeOfIssue}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Travel Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <p>
                        <span className="text-muted-foreground">
                          Destination:
                        </span>{" "}
                        {formData.destination}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Purpose:</span>{" "}
                        {formData.travelPurpose}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Arrival:</span>{" "}
                        {formData.arrivalDate}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Departure:
                        </span>{" "}
                        {formData.departureDate}
                      </p>
                      <p className="col-span-2">
                        <span className="text-muted-foreground">
                          Accommodation:
                        </span>{" "}
                        {formData.accommodationAddress}
                      </p>
                      {formData.additionalNotes && (
                        <p className="col-span-2">
                          <span className="text-muted-foreground">
                            Additional Notes:
                          </span>{" "}
                          {formData.additionalNotes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-primary">Processing Time</p>
                    <p className="text-muted-foreground">
                      Your application will be reviewed within 3-5 business
                      days. You'll receive an email confirmation shortly after
                      submission.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <Button variant="gradient" onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="gradient"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
};

export default VisaApplication;
