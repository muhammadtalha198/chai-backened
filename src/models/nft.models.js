import mongoose, { Schema } from "mongoose";


const attributeSchema = new Schema(
  {
    trait_type: { 
        type: String, 
        required: true 
    },
    value: { 
        type: Schema.Types.Mixed, 
        required: true 
    },
  },
  { _id: false }
);

const nftSchema = new Schema(
  {
    name: { 
        type: String,
         required: true 
    },
    description: { 
        type: String 
    },

    fileURL: { 
        type: String, 
        required: true 
    },

    metadataURL: { 
        type: String, 
        required: true 
    },

    tokenURI: { 
        type: String, 
        required: true 
    },
    
    attributes: [attributeSchema],

    creatorAddress: { 
        type: String 
    },

  },
  { timestamps: true }
);

export const NFT = mongoose.model("NFT", nftSchema);