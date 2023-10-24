const { MongoClient, ServerApiVersion } = require('mongodb');

const mongoose = require("mongoose")

const uri = process.env.URI

// Crie um cliente MongoClient com um objeto MongoClientOptions para definir a versão da API estável
const cliente = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const connectDatabase = async () => {
  try {
    //mongoose.set("useNewUrlParser", true);
    
    await mongoose.connect(process.env.URI);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectDatabase();
