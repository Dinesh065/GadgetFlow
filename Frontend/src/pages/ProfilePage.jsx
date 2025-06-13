import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff, XCircle, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "../config";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    role: "Seller",
    password: "********",
    newPassword: "",
    confirmPassword: "",
    profileImage: "",
    contactNumber: "",
    alternateContact: "",
    address: "",
    pickupLocation: "",
    aadhaarDoc: null,
    bio: "",
  });

  const [isVerified, setIsVerified] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [aadhaarFileUrl, setAadhaarFileUrl] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/users/profile/fetchProfileData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data.user;

        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || "",
          email: user.email || "",
          password: "********", // Always show hidden password unless change is triggered
          role: user.role || "Seller",
          profileImage: user.profileImage || "",
          contactNumber: user.contactNumber || "",
          alternateContact: user.alternateContact || "",
          address: user.address || "",
          pickupLocation: user.pickupLocation || "",
          aadhaarDoc: null,
          // aadhaarDoc: user.aadhaarDoc || null,
          bio: user.bio || "",
        }));

        if (user.aadhaarDoc) {
          setAadhaarFileUrl(user.aadhaarDoc);
        }

        setIsVerified(user.isVerified || false);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const file = files ? files[0] : null;

    setFormData((prev) => ({
      ...prev,
      [name]: file || value,
    }));

    if (name === "aadhaarDoc" && file instanceof File) {
      setAadhaarFileUrl(URL.createObjectURL(file));
    }

    setIsChanged(true);
  };

  const handleRemoveAadhaar = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/users/profile/remove-aadhaar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData((prev) => ({ ...prev, aadhaarDoc: null }));
      setAadhaarFileUrl(null);
      toast.success("Aadhaar removed.");
    } catch {
      toast.error("Error removing document.");
    }
  };

  const handleSave = async () => {
    const { contactNumber, address, aadhaarDoc, profileImage, newPassword, confirmPassword } = formData;
    const newErrors = {};

    if (!contactNumber) newErrors.contactNumber = "Contact number is required.";
    if (!address) newErrors.address = "Address is required.";
    if (!aadhaarDoc) newErrors.aadhaarDoc = "Aadhaar document is required.";
    if (!profileImage) newErrors.profileImage = "Profile image is required.";

    if (changePasswordMode && newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.values(newErrors).forEach((msg) => toast.error(msg));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      Object.entries(formData).forEach(([key, val]) => {
        if (key === "password") return;
        if ((key === "aadhaarDoc" || key === "profileImage") && val instanceof File) {
          data.append(key, val);
        } else if (typeof val === "string" || typeof val === "number") {
          data.append(key, val);
        }
      });

      await axios.post(`${API_BASE_URL}/users/profile/update`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated successfully.");
      setIsChanged(false);
      setChangePasswordMode(false);
      setErrors({});
    } catch (err) {
      toast.error("Error saving profile.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      {/* Upper Section */}
      <div className="flex gap-6 border-b pb-6">
        <div className="w-60">
          <label className="cursor-pointer block w-full h-60 overflow-hidden border border-gray-300 rounded-md">
            <img
              src={
                formData.profileImage
                  ? formData.profileImage instanceof File
                    ? URL.createObjectURL(formData.profileImage)
                    : formData.profileImage // if it's already a URL string
                  : "/default-profile.png"
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-md"
            />

            <input
              type="file"
              name="profileImage"
              accept="image/*"
              className={`hudden border-b p-2 outline-none ${errors.contactNumber ? 'border-red-500' : ''}`}

              // className="hidden"
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="border-b p-2 outline-none"
            placeholder="Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="border-b p-2 outline-none"
            placeholder="Email"
            required
          />
          {!changePasswordMode ? (
            <div className="relative col-span-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                disabled
                className="border-b p-2 w-full pr-10 outline-none"
              />
              {/* Eye Icon aligned slightly higher */}
              <div
                className="absolute right-2 top-[30%] transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>

              {/* Change Password button */}
              <button
                className="text-blue-500 text-sm absolute right-0 -bottom-1"
                onClick={() => setChangePasswordMode(true)}
                type="button"
              >
                Change Password
              </button>
            </div>
          ) : (
            <>
              <div className="col-span-1 relative">
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="border-b p-2 w-full outline-none"
                  placeholder="New Password"
                  required
                />
              </div>
              <div className="col-span-1 relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="border-b p-2 w-full outline-none"
                  placeholder="Confirm Password"
                  required
                />
              </div>
            </>
          )}
          <input
            type="text"
            name="role"
            value={formData.role}
            disabled
            className="border-b p-2 bg-gray-100 outline-none"
          />
        </div>
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-2 gap-4 pt-6">
        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          className={`border-b p-2 outline-none ${errors.contactNumber ? 'border-red-500' : ''}`}
          placeholder="Contact Number"
          required
        />
        <input
          type="tel"
          name="alternateContact"
          value={formData.alternateContact}
          onChange={handleInputChange}
          className="border-b p-2 outline-none"
          placeholder="Alternate Contact (Optional)"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className={`border-b p-2 outline-none ${errors.contactNumber ? 'border-red-500' : ''}`}
          placeholder="Address"
          required
        />
        <input
          type="text"
          name="pickupLocation"
          value={formData.pickupLocation}
          onChange={handleInputChange}
          className="border-b p-2 outline-none"
          placeholder="Pickup Location (Optional)"
        />

        {/* Aadhaar Upload */}
        <div className="col-span-2">
          <input
            type="file"
            name="aadhaarDoc"
            accept="application/pdf,image/*"
            onChange={handleInputChange}
            className={`border-b p-2 w-full outline-none ${errors.contactNumber ? 'border-red-500' : ''}`}

          // className="border-b p-2 w-full outline-none"
          />
          {aadhaarFileUrl && (
            <div className="mt-2 flex items-center justify-between border p-2 rounded-md">
              <a href={aadhaarFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                View Uploaded Document
              </a>
              <div className="flex items-center gap-2">
                {isVerified && <span className="text-green-600 text-sm">Verified</span>}
                <XCircle
                  className="text-red-500 cursor-pointer"
                  size={20}
                  onClick={handleRemoveAadhaar}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bio */}
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          className="border-b p-2 outline-none col-span-2"
          placeholder="Short Bio (Optional)"
          rows={3}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleSave}
          disabled={!isChanged}
          className={`px-6 py-2 rounded text-white font-semibold ${isChanged ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;


  // const handleRemoveAadhaar = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.delete(`${API_BASE_URL}/users/profile/remove-aadhaar`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setFormData((prev) => ({ ...prev, aadhaarDoc: null }));
  //     setAadhaarFileUrl(null);
  //     alert("Aadhaar removed.");
  //   } catch {
  //     alert("Error removing document.");
  //   }
  // };

  // const handleSave = async () => {
  //   const { contactNumber, address, aadhaarDoc, newPassword, confirmPassword } = formData;
  //   const newErrors = {};

  //   if (!contactNumber) newErrors.contactNumber = "Contact number is required.";
  //   if (!address) newErrors.address = "Address is required.";
  //   if (!aadhaarDoc) newErrors.aadhaarDoc = "Aadhaar document is required.";

  //   if (changePasswordMode && newPassword !== confirmPassword) {
  //     newErrors.confirmPassword = "Passwords do not match.";
  //   }

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return; // don't proceed
  //   }

  //   try {
  //     const token = localStorage.getItem("token");
  //     const data = new FormData();

  //     Object.entries(formData).forEach(([key, val]) => {
  //       if (key === "password") return;
  //       if ((key === "aadhaarDoc" || key === "profileImage") && val instanceof File) {
  //         data.append(key, val);
  //       } else if (typeof val === "string" || typeof val === "number") {
  //         data.append(key, val);
  //       }
  //     });

  //     await axios.post(`${API_BASE_URL}/users/profile/update`, data, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     alert("Profile updated successfully.");
  //     setIsChanged(false);
  //     setChangePasswordMode(false);
  //     setErrors({}); // clear errors on success
  //   } catch (err) {
  //     alert("Error saving profile.");
  //   }
  // };