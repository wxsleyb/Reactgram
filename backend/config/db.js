const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = process.env.URI

// Crie um cliente MongoClient com um objeto MongoClientOptions para definir a versão da API estável
const cliente = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function executar() {
  try {
    // Conecte o cliente ao servidor (opcional a partir da versão 4.7)
    await cliente.connect();
    // Envie um ping para confirmar uma conexão bem-sucedida
    await cliente.db("admin").command({ ping: 1 });
    console.log("Você se conectou com sucesso ao MongoDB!");
  } finally {
    // Garante que o cliente será fechado quando você terminar/ocorrer erro
    await cliente.close();
  }
}
executar().catch(console.dir);
