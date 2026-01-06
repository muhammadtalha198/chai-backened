import { Router } from "express";
import { createNFT } from "../controllers/nft.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Single NFT file upload (image/video)
router.route("/create").post(
    upload.single("file"), // Expecting single file with field name 'file'
    createNFT
);

export default router;
