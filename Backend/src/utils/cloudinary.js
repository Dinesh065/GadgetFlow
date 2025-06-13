// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import path from "path";
// import mime from "mime-types"; // <- NEW
// import dotenv from "dotenv";

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;

//     const normalizedPath = path.resolve(localFilePath);
//     const mimeType = mime.lookup(normalizedPath); // detect file type, like image/png or application/pdf

//     // Decide resource_type
//     let resourceType = "raw"; // default for non-image
//     if (mimeType && mimeType.startsWith("image/")) {
//       resourceType = "image";
//     }

//     const response = await cloudinary.uploader.upload(normalizedPath, {
//       resource_type: resourceType,
//     });

//     console.log("file is uploaded on cloudinary", response.secure_url);

//     // Optional: Delete file only if uploaded successfully
//     fs.unlinkSync(normalizedPath);

//     return response;
//   } catch (error) {
//     console.error("Cloudinary upload error:", error);
//     // Remove temp file only on error too
//     if (fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//     }
//     return null;
//   }
// };

// export { uploadOnCloudinary };

import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        
        if (!localFilePath) return null
        const normalizedPath = path.resolve(localFilePath);  

        const response = await cloudinary.uploader.upload(normalizedPath, {
          resource_type: "image"
        });
        // console.log("file is uploaded on cloudinary",response.url);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath) 
        return null;
    }
}

export {uploadOnCloudinary}