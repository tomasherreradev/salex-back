import multer from 'multer';
import path from 'path';
import fs from 'fs';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        let uploadPath = 'uploads/'; 
        
        if (req.baseUrl.includes('cars')) {
            uploadPath = 'uploads/cars/';
        } else if (req.baseUrl.includes('users')) {
            uploadPath = 'uploads/users/';
        }

        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});


const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'));
        }
    },
});

export default upload;
