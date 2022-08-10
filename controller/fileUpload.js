import multer from 'multer'
 import path from 'path'
 import __dirname from './path.js'
/*
 import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname=dirname(fileURLToPath(
  import.meta.url)); */   
const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
        const rename=Date.now()+'-'+file.originalname.split(' ').join('-');
        cb(null, rename)
    }
  })

  const upload = multer({storage })
  export default upload;

