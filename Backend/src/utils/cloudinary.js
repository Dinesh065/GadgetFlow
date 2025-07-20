// import { v2 as cloudinary } from "cloudinary"
// import fs from "fs"
// import path from "path";
// import dotenv from 'dotenv';
// dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;

//         const normalizedPath = path.resolve(localFilePath);

//         const fileExtension = path.extname(normalizedPath).toLowerCase();

//         const resourceType = fileExtension === ".pdf" ? "raw" : "image";

//         const response = await cloudinary.uploader.upload(normalizedPath, {
//             resource_type: resourceType,
//         });

//         return response;
//     } catch (error) {
//         console.error("Cloudinary upload error:", error);
//         fs.unlinkSync(localFilePath);
//         return null;
//     }
// };

// export { uploadOnCloudinary }

// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";
import path from "path";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (buffer, originalname) => {
    return new Promise((resolve, reject) => {
        const extension = path.extname(originalname).toLowerCase();

        // Determine the resource type based on extension
        const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".svg"];
        const resourceType = imageExtensions.includes(extension) ? "image" : "raw";

        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: resourceType,
                folder: "uploads",
                public_id: originalname.split(".")[0], // optional
            },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

export { uploadOnCloudinary };