const Photo = require("../models/Photo")
const User = require("../models/User")

const mongoose = require("mongoose")


// inserir uma foto com um usuário relacionado a ela
const insertPhoto = async(req, res)=>{
    const {title} = req.body
    const image = req.file.filename
    const reqUser = req.reqUser
    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select("-password")
    //create a photo
    //const user = await User.findById(reqUser._id)
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    })
    


    //se a foto foi criada com sucesso, retorne o dado

    if(!newPhoto){
        res.status(422).json({
            errors: ["Houve um problema, por favor tente novamente mais tarde"]
        })
    }
    res.status(201).json(newPhoto)


    res.send("Photo insert")
}


module.exports = {
    insertPhoto,
}