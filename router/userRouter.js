import express from "express";
import {getUser, setUser,findAllUser,findAllUserById} from  "../controller/userContorller.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination:(req,file,callback)=> {
        callback(null,"uploads/");
    },
    filename: (req,file,callback)=> {
        callback(null,`image-${Date.now()}.${file.originalname}`)
    }
})

const upload = multer({storage})

const router = express.Router();

router.post('/auth',upload.single('file'),setUser);
router.post('/details',getUser);
router.post('/search',findAllUser);
router.post('/searchById',findAllUserById);

export default router;

