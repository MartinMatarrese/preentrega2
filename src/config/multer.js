import multer from "multer";
import { __dirname } from "../patch.js";

const sotrageProducts = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${file.originalname}`);
    },
    destination: (req, file, cb) => {
        cb(null, `${__dirname}/public/img/products`)
    }
})

export const uploadProds = multer({storage: sotrageProducts})