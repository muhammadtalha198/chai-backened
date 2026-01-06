import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { NFT } from "../models/nft.models.js";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../services/pinataService.js"; // See previous pinataService.js
import { Apiresponse } from "../utils/ApiResponse.js";

const createNFT = asyncHandler(async (req, res) => {
    const { name, description, attributes, creatorAddress, keyvalues } = req.body;

    if (!req.file) {
        throw new ApiError(400, "NFT file is required");
    }
    if (!name || !description) {
        throw new ApiError(400, "NFT name and description are required");
    }

    // 1️⃣ Upload file to Pinata
    const fileUpload = await uploadFileToIPFS(req.file, {
        name: req.file.originalname,
        keyvalues: keyvalues ? JSON.parse(keyvalues) : { env: "prod" },
    });

    // 2️⃣ Create metadata JSON
    const metadata = {
        name,
        description,
        image: `ipfs://${fileUpload.cid}`,
        attributes: attributes ? JSON.parse(attributes) : [],
    };

    // 3️⃣ Upload metadata JSON to Pinata
    const metadataUpload = await uploadJSONToIPFS(metadata, {
        name: `${name}-metadata`,
        keyvalues: keyvalues ? JSON.parse(keyvalues) : { project: "NFT" },
    });

    // 4️⃣ Save NFT info to MongoDB
    const nftDoc = await NFT.create({
        name,
        description,
        fileURL: fileUpload.url,
        metadataURL: metadataUpload.url,
        tokenURI: `ipfs://${metadataUpload.cid}`,
        attributes: metadata.attributes,
        creatorAddress,
    });

    return res.status(201).json(
        new Apiresponse(201, nftDoc, "NFT created and saved successfully")
    );
});

export { createNFT };
