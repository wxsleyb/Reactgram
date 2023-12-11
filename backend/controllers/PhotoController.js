const Photo = require("../models/Photo")
const User = require("../models/User")

const mongoose = require("mongoose")


// inserir uma foto com um usuário relacionado a ela
const insertPhoto = async(req, res)=>{
    const {title} = req.body
    const image = req.file.filename
    const reqUser = req.user
    const user = await User.findById(reqUser._id);  
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

// remover a foto do banco de dados

const deletePhoto = async(req, res) =>{
    const {id} = req.params
    const reqUser = req.user
    
    try {
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id))

    // checar se a foto existe

    if(!photo){
        res.status(404).json({errors: ["Foto não encontrada."]})
        return
    }
    // checa se a foto pertence ao usuario

    if(!photo.userId.equals(reqUser._id)){
        res.status(422).json({errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]})
        return
    }

    await Photo.findByIdAndDelete(photo._id)

    res.status(200).json({id: photo._id, message: "Foto exclúida com sucesso."})
    } catch (error) {
        res.status(404).json({errors: ["Foto não encontrada."]})
        return
    }
}

//pegar todas as fotos

const getAllPhotos = async(req,res)=>{
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec()

    return res.status(200).json(photos)
}

//pegar só as fotos do usuário
const getUserPhotos = async (req,res)=>{
    const {id} = req.params

    const photos = await Photo.find({userId: id})
        .sort([['createdAt', -1]])
        .exec()
    return res.status(200).json(photos)
}


// pegar foto por id

const getPhotoById = async (req, res) => {
    try {
        const { id } = req.params;

        const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

        // Check if the photo exists
        if (!photo) {
            return res.status(404).json({ errors: ["Foto não encontrada."] });
        }

        res.status(200).json(photo);
    } catch (error) {
        // Handle any potential errors that might occur during database operations
        console.error("Error fetching photo by ID:", error);
        res.status(500).json({ errors: ["Erro interno do servidor."] });
    }
};


// atualizar a foto

const updatePhoto = async(req,res)=>{
    const {id} = req.params
    const {title} = req.body
    const reqUser = req.user

    const photo= await Photo.findById(id)

    // checar se foto existe
    if(!photo){
        res.status(404).json({errors: ["Foto não encontrada."]})
        return
    }
    
    //checa se a foto pertence ao usuario
    if(!photo.userId.equals(reqUser._id)){
        res.status(422).json({errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]})
        return
    }

    if(title){
        photo.title = title
    }
    await photo.save()

    res.status(200).json({photo, message: "Foto atualizada com sucesso!"})

}

// funcionalidade de like

const likePhoto = async(req,res)=>{
    const{id} = req.params

    const reqUser = req.user

    const photo = await Photo.findById(id)
    if(!photo){
        res.status(404).json({errors: ["Foto não encontrada."]})
        return
    }

    // checa se o usuario ja deu like

    if(photo.likes.includes(reqUser._id)){
        res.status(422).json({errors: ["Você já curtiu a foto."]})
        return
    }

    //colocar o id do usuario no array de likes
    photo.likes.push(reqUser._id)
    photo.save()
    res
    .status(200)
    .json({photoId: id, userId: reqUser._id, message: "A foto foi curtida."})
}

//funcionalidade de comentário

const commentPhoto = async(req, res) =>{
    const{id} = req.params
    const{comment} = req.body
    
    const reqUser = req.user

    const user = await User.findById(reqUser._id)

    const photo = await Photo.findById(id)

    if(!photo){
        res.status(404).json({errors: ["Foto não encontrada."]})
        return
    }

    // colocar o comentário em um array de comentários

    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    }

    photo.comments.push(userComment)

    await photo.save()

    res.status(200).json({
        comment: userComment,
        message: "O comentário foi adicionado com sucesso!",
    })
}

// Search photos by title

const searchPhotos = async(req,res)=>{
    const{q}= req.query

    const photos = await Photo.find({title: new RegExp(q, "i")}).exec()

    res.status(200).json(photos)
}

module.exports = {
    insertPhoto,
    deletePhoto,
    getAllPhotos,
    getUserPhotos,
    getPhotoById,
    updatePhoto,
    likePhoto,
    commentPhoto,
    searchPhotos,
}