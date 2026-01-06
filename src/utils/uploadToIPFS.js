// pinataService.js
import axios from "axios";
import FormData from "form-data";
import fs from "fs";


const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_FILE_API = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PINATA_JSON_API = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

// 1️⃣ Upload file with metadata (name + keyvalues)
export async function uploadFileToIPFS(file, options = {}) {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(file.path));

  // Pinata metadata
  const pinataMetadata = {
    name: options.name || file.originalname,
    keyvalues: options.keyvalues || { env: "prod" },
  };

  formData.append("pinataMetadata", JSON.stringify(pinataMetadata));

  const res = await axios.post(PINATA_FILE_API, formData, {
    maxBodyLength: Infinity,
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      ...formData.getHeaders(),
    },
  });

  return {
    cid: res.data.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`,
  };
}

// 2️⃣ Upload NFT metadata JSON
export async function uploadJSONToIPFS(metadata, options = {}) {
  const payload = metadata;
  const pinataMetadata = {
    name: options.name || metadata.name || "metadata.json",
    keyvalues: options.keyvalues || { type: "metadata" },
  };

  const res = await axios.post(PINATA_JSON_API, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
      pinataMetadata: JSON.stringify(pinataMetadata),
    },
  });

  return {
    cid: res.data.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`,
  };
}

// 3️⃣ Upload full NFT (file + metadata)
export async function uploadNFT(file, nftData) {
  // Upload file first
  const fileUpload = await uploadFileToIPFS(file, {
    name: nftData.fileName,
    keyvalues: nftData.keyvalues,
  });

  // Create NFT metadata
  const metadata = {
    name: nftData.name,
    description: nftData.description,
    image: `ipfs://${fileUpload.cid}`,
    attributes: nftData.attributes || [],
  };

  const metadataUpload = await uploadJSONToIPFS(metadata, {
    name: `${nftData.name}-metadata`,
    keyvalues: { project: "NFT", ...nftData.keyvalues },
  });

  return {
    fileCID: fileUpload.cid,
    fileURL: fileUpload.url,
    metadataCID: metadataUpload.cid,
    metadataURL: metadataUpload.url,
    tokenURI: `ipfs://${metadataUpload.cid}`,
    metadata,
  };
}
