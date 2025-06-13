// import React, { useState } from "react";
// import { FiUpload } from "react-icons/fi";
// import axios from "axios"

// const SellerAddItemForm = ({ onClose, onSubmit }) => {
//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         price: "",
//         dueDate: "",
//         deliveryOption: "Pickup",
//         deliveryCost: "",
//         images: [],
//         category: "",
//         location: "",
//         availability: "Available",
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleImageUpload = (e) => {
//         const files = Array.from(e.target.files);
//         if (files.length + formData.images.length > 6) {
//             alert("You can upload a maximum of 6 images.");
//             return;
//         }
//         setFormData({ ...formData, images: [...formData.images, ...files] });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (formData.images.length < 3) {
//             alert("Please upload at least 3 images.");
//             return;
//         }

//         const data = new FormData();
//         formData.images.forEach((image) => data.append("images", image));

//         try {
//             for (let pair of data.entries()) {
//                 console.log(pair[0], pair[1]);
//             }

//             const response = await axios.post("http://localhost:8001/api/v1/items/upload", data, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             const result = response.data;

//             if (result.success) {
//                 const submittedData = {
//                     ...formData,
//                     images: result.images,
//                     deliveryCost:
//                         formData.deliveryOption === "Delivery"
//                             ? Number(formData.deliveryCost)
//                             : 0,
//                 };
//                 onSubmit(submittedData);
//                 onClose();
//             } else {
//                 alert("Image upload failed");
//             }
//         } catch (error) {
//             console.error("Upload error:", error);
//             alert("Something went wrong while uploading");
//         }
//     };


//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-lg overflow-auto p-4">
//             <div className="bg-white p-6 rounded-md w-2/3 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
//                 <h2 className="text-2xl font-semibold mb-4 text-center">Add New Item</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="flex flex-col">
//                         <label className="font-medium">Name</label>
//                         <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300" required />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="font-medium">Category</label>
//                         <select
//                             name="category"
//                             value={formData.category}
//                             onChange={handleChange}
//                             className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
//                             required
//                         >
//                             <option value="">Select a category</option>
//                             <option value="Electronics">Electronics</option>
//                             <option value="Vehicles">Vehicles</option>
//                             <option value="Furniture">Furniture</option>
//                             <option value="Books">Books</option>
//                             <option value="Others">Others</option>
//                         </select>
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="font-medium">Location</label>
//                         <input
//                             type="text"
//                             name="location"
//                             value={formData.location}
//                             onChange={handleChange}
//                             className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
//                             required
//                         />
//                     </div>


//                     <div className="flex flex-col">
//                         <label className="font-medium">Description</label>
//                         <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300" required />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="font-medium">Price</label>
//                         <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300" required />
//                     </div>

//                     <div className="flex flex-col">
//                         <label className="font-medium">Due Date</label>
//                         <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300" required />
//                     </div>

//                     {/* Availability Dropdown */}
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="availability">
//                         Availability
//                     </label>
//                     <select
//                         name="availability"
//                         value={formData.availability}
//                         onChange={handleChange}
//                         className="mb-4 block w-full p-2 border rounded"
//                     >
//                         <option value="Available">Available</option>
//                         <option value="Rented">Rented</option>
//                     </select>

//                     {/* Delivery Option Dropdown */}
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryOption">
//                         Delivery Option
//                     </label>
//                     <select
//                         name="deliveryOption"
//                         value={formData.deliveryOption}
//                         onChange={handleChange}
//                         className="mb-4 block w-full p-2 border rounded"
//                     >
//                         <option value="Pickup">Pickup</option>
//                         <option value="Delivery">Delivery</option>
//                     </select>


//                     {formData.deliveryOption === "Delivery" && (
//                         <div className="flex flex-col">
//                             <label className="font-medium">Delivery Cost</label>
//                             <input type="number" name="deliveryCost" value={formData.deliveryCost} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300" required />
//                         </div>
//                     )}

//                     <div className="flex flex-col items-center">
//                         <label className="w-full h-40 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer rounded-lg">
//                             <FiUpload size={30} className="text-gray-600" />
//                             <span className="text-gray-600">Click to upload or drag images here</span>
//                             <input type="file" multiple name="images" accept="image/*" className="hidden" onChange={handleImageUpload} />
//                         </label>

//                         {/* Image Preview */}
//                         <div className="mt-4 flex flex-wrap gap-2 justify-center">
//                             {formData.images.map((image, index) => (
//                                 <img key={index} src={URL.createObjectURL(image)} alt="Preview" className="w-24 h-24 object-cover rounded border border-gray-300" />
//                             ))}
//                         </div>
//                     </div>

//                     <div className="flex justify-between mt-4">
//                         <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all">Cancel</button>
//                         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all">Add Item</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default SellerAddItemForm;

import React, { useState, useEffect } from "react";
import { FiUpload } from "react-icons/fi";
import { API_BASE_URL } from "../config";

import axios from "axios";

const SellerAddItemForm = ({ itemData, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        days_for_rent: "", // replaced dueDate
        deliveryOption: "Pickup",
        deliveryCost: "",
        images: [],
        category: "",
        location: "",
        availability: "Available",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (itemData) {
            setFormData({
                name: itemData.name || "",
                price: itemData.price || "",
                category: itemData.category || "",
                description: itemData.description || "",
                availability: itemData.status || "Available",
                days_for_rent: itemData.days_for_rent || "",
                deliveryOption: itemData.deliveryOption || "Pickup",
                deliveryCost: itemData.deliveryCost || "",
                images: itemData.images || [],
                location: itemData.location || "",
            });
        }
    }, [itemData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        // Check max images limit (6)
        if (files.length + formData.images.length > 6) {
            alert("You can upload a maximum of 6 images.");
            return;
        }
        setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => {
            const newImages = [...prev.images];
            newImages.splice(index, 1);
            return { ...prev, images: newImages };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Count new files (File objects) and existing image URLs (strings)
        const numNewImages = formData.images.filter((img) => typeof img !== "string").length;
        const numExistingImages = formData.images.filter((img) => typeof img === "string").length;

        if (numNewImages + numExistingImages < 3) {
            alert("Please upload at least 3 images.");
            return;
        }

        const data = new FormData();
        formData.images.forEach((image) => {
            if (typeof image !== "string") {
                data.append("images", image);
            }
        });

        try {
            setLoading(true);
            let uploadedImages = [];

            if (data.has("images")) {
                const response = await axios.post(`${API_BASE_URL}/items/upload`, data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.data.success) {
                    uploadedImages = response.data.images; // URLs of newly uploaded images
                } else {
                    alert("Image upload failed");
                    return;
                }
            }

            const allImages = [
                ...formData.images.filter((img) => typeof img === "string"),
                ...uploadedImages,
            ];

            const submittedData = {
                ...formData,
                images: allImages,
                days_for_rent: Number(formData.days_for_rent), // Convert to number
                deliveryCost: formData.deliveryOption === "Delivery" ? Number(formData.deliveryCost) : 0,
            };

            onSubmit(submittedData);
            onClose();

        } catch (error) {
            console.error("Upload error:", error);
            alert("Something went wrong while uploading");
        } finally {
            setLoading(false); // Hide loader
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-lg overflow-auto p-4">
            <div className="bg-white p-6 rounded-md w-2/3 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-center">{itemData ? "Edit Item" : "Add New Item"}</h2>
                {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24 animate-spin"></div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... other inputs stay the same ... */}

                    <div className="flex flex-col">
                        <label className="font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Vehicles">Vehicles</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Books">Books</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Days Available for Rent</label>
                        <input
                            type="number"
                            name="days_for_rent"
                            value={formData.days_for_rent}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                            required
                        />
                    </div>

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="availability">
                        Availability
                    </label>
                    <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className="mb-4 block w-full p-2 border rounded"
                    >
                        <option value="Available">Available</option>
                        <option value="Rented">Rented</option>
                    </select>

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryOption">
                        Delivery Option
                    </label>
                    <select
                        name="deliveryOption"
                        value={formData.deliveryOption}
                        onChange={handleChange}
                        className="mb-4 block w-full p-2 border rounded"
                    >
                        <option value="Pickup">Pickup</option>
                        <option value="Delivery">Delivery</option>
                    </select>

                    {formData.deliveryOption === "Delivery" && (
                        <div className="flex flex-col">
                            <label className="font-medium">Delivery Cost</label>
                            <input
                                type="number"
                                name="deliveryCost"
                                value={formData.deliveryCost}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                                required
                            />
                        </div>
                    )}

                    <div className="flex flex-col items-center">
                        <label className="w-full h-40 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer rounded-lg">
                            <FiUpload size={30} className="text-gray-600" />
                            <span className="text-gray-600">Click to upload or drag images here</span>
                            <input type="file" multiple name="images" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>

                        {/* Image Preview with Remove Button */}
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {formData.images.map((image, index) => {
                                const src = typeof image === "string" ? image : URL.createObjectURL(image);
                                return (
                                    <div key={index} className="relative w-24 h-24">
                                        <img
                                            src={src}
                                            alt="Preview"
                                            className="w-24 h-24 object-cover rounded border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition"
                                            title="Remove image"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
                        >
                            {itemData ? "Update Item" : "Add Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerAddItemForm;


// but what about the dueDate fiedl in the seller form , we discussed that instead of that there should eb days_for_rent so please tell me where to make changes ,and also automatic due_date willl be calculated where in backend like in buyer side's backend function or in seller ? -