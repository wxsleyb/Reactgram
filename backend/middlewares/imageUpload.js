const multer = require("multer")
const path = require("path")


//funçao onde a imagem será salva
const imageStorage = multer.diskStorage({
    destination: function(req,file,cb){
        let folder = ""
    

        if(req.baseUrl.includes("users")){
            folder = "users"
        } else if(req.baseUrl.includes("photos")){
            folder = "photos"
        }

        cb(null, `uploads/${folder}/`)
    },
    filename: (req,file,cb) =>{
        cb(null, Date.now()+path.extname(file.originalname))
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(png|jpg|jpeg|webp)$/)){
            //upload só de formato png e jpg
            return cb(new Error("Por favor, envie apenas png, jpg, jpeg ou webp!"))
        }
        cb(undefined, true)
    }
})

module.exports = {imageUpload}