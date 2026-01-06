import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});



const uploadOnCloudinary = async(localFilePath) => {
    
    try {
        if (!localFilePath) return null;
        // Upload the image to Cloudinary
        
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "images", // Optional: specify a folder in Cloudinary
            use_filename: true,
            unique_filename: false
        });
        //if file uploaded successfully, delete the local file
        // console.log("file upload successfully:", result.url);
        fs.unlinkSync(localFilePath); // Delete the local file in case of error
        
        return result;
        
    } catch (error) {
        fs.unlinkSync(localFilePath); // Delete the local file in case of error
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

export {uploadOnCloudinary};