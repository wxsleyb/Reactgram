
const User = require("../models/User")
    
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
 
const jwtSecret = process.env.JWT_SECRET
require("../config/db.js")
// gerar o token do usuario
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d",
    })
}
 
// registrar usuario e logar
// ...

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verificar se o usuário já existe
        const user = await User.findOne({ email }).maxTimeMS(30000); // Aumente o limite de tempo para 20 segundos (20000ms)

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


module.exports = {
    register, 
}