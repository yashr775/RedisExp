import {v4 as uuid}  from 'uuid'
import multer from 'multer'

const storage = multer.diskStorage({
    destination(req,file,callback){
        callback(null,'uploads')
    },
    filename(req,file,callback){
        const id = uuid();
        const ext = file.originalname.split(".").pop();
        callback(null,`${id}.${ext}`)
    }
})

export const singleUpload = multer({ storage }).single("photo");
