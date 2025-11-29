import multer from "multer";

// Configure multer storage (you can customize this as needed)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp'); // Specify the destination directory
    },
    
    filename: function (req, file, cb) {  
        cb(null,file.originalname); // Specify the file name
    }
});

export const upload = multer({ 
    storage: storage
 });


