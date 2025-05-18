import React, { useState } from "react";
import { FiUpload } from "react-icons/fi";
import axios from "axios"

const SellerAddItemForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        dueDate: "",
        deliveryOption: "Pickup",
        deliveryCost: "",
        images: [],
        category: "",
        location: "",
        availability: "Available",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 6) {
            alert("You can upload a maximum of 6 images.");
            return;
        }
        setFormData({ ...formData, images: [...formData.images, ...files] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.images.length < 3) {
            alert("Please upload at least 3 images.");
            return;
        }

        const data = new FormData();
        formData.images.forEach((image) => data.append("images", image));

        try {
            for (let pair of data.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await axios.post("http://localhost:8000/api/v1/items/upload", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const result = response.data;

            if (result.success) {
                const submittedData = {
                    ...formData,
                    images: result.images,
                    deliveryCost:
                        formData.deliveryOption === "Delivery"
                            ? Number(formData.deliveryCost)
                            : 0,
                };
                onSubmit(submittedData);
                onClose();
            } else {
                alert("Image upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Something went wrong while uploading");
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-lg overflow-auto p-4">
            <div className="bg-white p-6 rounded-md w-2/3 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-center">Add New Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="font-medium">Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300" required />
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
                        <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300" required />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Price</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300" required />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-medium">Due Date</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300" required />
                    </div>

                    {/* Availability Dropdown */}
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

                    {/* Delivery Option Dropdown */}
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
                            <input type="number" name="deliveryCost" value={formData.deliveryCost} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-300" required />
                        </div>
                    )}

                    <div className="flex flex-col items-center">
                        <label className="w-full h-40 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center cursor-pointer rounded-lg">
                            <FiUpload size={30} className="text-gray-600" />
                            <span className="text-gray-600">Click to upload or drag images here</span>
                            <input type="file" multiple name="images" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>

                        {/* Image Preview */}
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            {formData.images.map((image, index) => (
                                <img key={index} src={URL.createObjectURL(image)} alt="Preview" className="w-24 h-24 object-cover rounded border border-gray-300" />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-all">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all">Add Item</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SellerAddItemForm;
