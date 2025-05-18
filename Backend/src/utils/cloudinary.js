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
        //upload the file on cloudinary
        const normalizedPath = path.resolve(localFilePath); // <- this is important

        const response = await cloudinary.uploader.upload(normalizedPath, {
          resource_type: "image"
        });
        // const response = await cloudinary.uploader.upload(localFilePath, {
        //     resource_type: "image"
        // })
        //file has been uploaded successfully
        console.log("file is uploaded on cloudinary",response.url);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the  upload operation got failed
        return null;
    }
}

export {uploadOnCloudinary}