const mongoose = require("mongoose")

//conexão

const dbUser = process.env.DEB_USER
const dbPassword = process.env.DEB_PASS


const conn = async () =>{

    try{
        const dbConn = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.joqjvit.mongodb.net/`);
        console.log("Conectou ao banco!")
        return dbConn;
    } catch (error){
        console.log(error);
    }
}

conn()

module.exports = conn