import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaUpload, FaTimes } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const measurementOptions = Array.from({ length: 17 }, (_, i) => (12 + i * 0.5).toString());

const MeasurementField = ({ label, field, formData, setFormData }) => (
  <div>
    <Label>{label}</Label>
    <Select value={formData[field]} onValueChange={(value) => setFormData({ ...formData, [field]: value })}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        {measurementOptions.map((value) => (
          <SelectItem key={value} value={value}>{value} inches</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default function ServiceBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: { no: "", street: "", city: "", state: "", pincode: "" },
    blouselength: "", shoulder: "", bust: "", upperbust: "", waist: "",
    upperwaist: "", sleevelength: "", sleevearound: "", armhole: "",
    frontNeckDeep: "", backNeckDeep: "", apex: "",
  });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages((prev) => [...prev, { file, preview: reader.result }]);
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => setImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "address") data.append(key, JSON.stringify(value));
        else data.append(key, value);
      });
      images.forEach((img) => data.append("images", img.file));
      await api.post("/bookings", data, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate("/auth?redirect=/service-booking");
    return null;
  }

  return (
    <main className="container bg-[#fffdfe] mx-auto py-10 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Stitching Service Booking</CardTitle>
          <CardDescription className="text-center">Book a tailoring service at your convenience</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            {/* Personal Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="flatno">Door No / Flat No</Label>
                  <Input id="flatno" value={formData.address.no} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, no: e.target.value } })} required />
                </div>
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" value={formData.address.street} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })} required />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={formData.address.city} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} required />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={formData.address.state} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })} required />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" value={formData.address.pincode} onChange={(e) => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })} required />
                </div>
              </div>
            </div>

            {/* Measurements */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Measurements (in inches)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <MeasurementField label="Blouse Length" field="blouselength" formData={formData} setFormData={setFormData} />
                <MeasurementField label="Shoulder" field="shoulder" formData={formData} setFormData={setFormData} />
                <MeasurementField label="Bust" field="bust" formData={formData} setFormData={setFormData} />
                <MeasurementField label="Upper Bust" field="upperbust" formData={formData} setFormData={setFormData} />
                <MeasurementField label="Waist" field="waist" formData={formData} setFormData={setFormData} />
                <MeasurementField label="Upper Waist" field="upperwaist" formData={formData} setFormData={setFormData} />
                <MeasurementField label="Sleeve Length" field="sleevelength" formData={formData} setFormData={setFormData} />
                <MeasurementField label="Sleeve Around" field="sleevearound" formData={formData} setFormData={setFormData} />
                <MeasurementField label="Armhole" field="armhole" formData={formData} setFormData={setFormData} />
                <MeasurementField label="Front Neck Deep" field="frontNeckDeep" formData={formData} setFormData={setFormData} />
                <MeasurementField label="Back Neck Deep" field="backNeckDeep" formData={formData} setFormData={setFormData} />
                <MeasurementField label="Apex" field="apex" formData={formData} setFormData={setFormData} />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Upload Sample Images (Optional)</h2>
              <div className="flex flex-wrap gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img.preview} alt={`Sample ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
                    <button type="button" onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      <FaTimes className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <Label htmlFor="image-upload" className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition">
                  {uploading ? <span className="text-sm text-gray-500">Uploading...</span> : <FaUpload className="text-gray-400 h-6 w-6" />}
                  <Input id="image-upload" type="file" onChange={handleImageChange} className="hidden" accept="image/*" multiple disabled={uploading} />
                </Label>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center gap-4">
            <Button type="submit" disabled={loading} className="w-full max-w-md bg-gradient-to-r from-pink-600 to-purple-600">
              {loading ? "Submitting..." : "Submit Booking"}
            </Button>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
