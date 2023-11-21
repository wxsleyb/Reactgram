
const User = require("../models/User")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const jwtSecret = process.env.JWT_SECRET
require("../config/db.js")
// gerar o token do usuario
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d",
    })
}

// registrar usuario e logar

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verificar se o usuário já existe
        const user = await User.findOne({ email })
        //const user = await User.findOne({ email });
        //const user = await User.findOne({email: req.body.email })
        //const user = await User.findOne({ email })


        if (user) {
            return res.status(422).json({ errors: ["Por favor, utilize outro e-mail"] });
        }

        // Gerar um hash de senha
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Criar o usuário
        const newUser = await User.create({
            name,
            email,
            password: passwordHash,
        });

        if (!newUser) {
            return res.status(422).json({ errors: ["Houve um erro, por favor, tente mais tarde."] });
        }

        res.status(201).json({
            _id: newUser._id,
            token: generateToken(newUser._id),
        });
    } catch (error) {
        console.error(error); // Registrar o erro no console para depuração
        res.status(500).json({ errors: ["Erro interno do servidor."] });
    }
}


//logar usuario
const login = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    //checa se usuario existe

    if (!user) {
        res
            .status(404)
            .json({ errors: ["Usuário não encontrado."] })
    }

    //checa se as senhas coincidem
    if (!(await bcrypt.compare(password, user.password))) {
        res
            .status(422)
            .json({ errors: ["Senha inválida."] })
    }

    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user._id),
    });
}

// acessa o perfil do usuario

const getCurrentUser = async (req, res) => {
    const user = req.user

    res.status(200).json(user)
}

//update um usuario

const upload = async (req, res) => {
    const { name, password, bio } = req.body

    let profileImage = null

    if (req.file) {
        profileImage = req.file.filename
    }
    const reqUser = req.user
    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select("-password")

    if (name) {
        user.name = name
    }

    if (password) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash
    }

    if (profileImage) {
        user.profileImage = profileImage
    }

    if (bio) {
        user.bio = bio
    }

    await user.save()

    res.status(200).json(user)
}

//pegar usuario pelo id
const getUserById = async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findById(new mongoose.Types.ObjectId(id)).select("-password")
        // checar se o usuario existe
        if (!user) {
            res.status(404).json({ errors: ["Usuário não encontrado.1"] })
            return
        }
        res.status(200).json(user)

    } catch (error) {

        res.status(404).json({ errors: ["Usuário não encontrado.2"] })
        return
    }
   
}


module.exports = {
    register,
    login,
    getCurrentUser,
    upload,
    getUserById,
}