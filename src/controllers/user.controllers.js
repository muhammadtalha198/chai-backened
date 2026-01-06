import {asyncHandler} from "../utils/asynchandler.js";
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {Apiresponse} from "../utils/ApiResponse.js";
 
const registerUser = asyncHandler(async(req, res) => {
    
    const{fullname, email, username, password} = req.body;
    
    if([fullname, email, username, password].some(field => field?.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{email}, {username}]
    });
    if(existingUser){
        throw new ApiError(409, "User with provided email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverPhotoLocalPath = req.files?.coverPhoto[0]?.path;

    if(!avatarLocalPath || !coverPhotoLocalPath){
        throw new ApiError(400, "Avatar and Cover Photo are required");
    }

    const avatarUploadResult = await uploadOnCloudinary(avatarLocalPath, "avatars");
    const coverPhotoUploadResult = await uploadOnCloudinary(coverPhotoLocalPath, "coverPhotos");

    if (!avatarUploadResult?.url || !coverPhotoUploadResult?.url){
        throw new ApiError(500, "Image upload failed");
    }

    const newUser = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatarUploadResult.url,
        coverPhoto: coverPhotoUploadResult.url
    });

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(500, "User creation failed");
    }

    return res.status(201).json(
        new Apiresponse(201,createdUser, "User registered successfully"));
    

});
    

export {registerUser}; 