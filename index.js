const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGODB_CONNECT_URI;
const express = require("express");
const app = express();
const cors = require('cors')

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("lendasamazonia").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
}
run().catch(console.dir);


app.post("/adduser", async (req, res) => {
  try {
    const { nome, idade } = req.body;
    const db = client.db("lendasamazonia");
    const collection = db.collection("usuario");

    const result = await collection.insertOne({ nome, idade });

    res.json({ message: "Usuário adicionado com sucesso", insertedId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar o usuário", details: error.message });
  }
});


app.get("/",(req,res)=>{
  res.send("Hello");
})
// Rota para listar todos os usuários
app.get("/users", async (req, res) => {
  try {
    const db = client.db("lendasamazonia");
    const collection = db.collection("usuario");

    const users = await collection.find({}).toArray();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar os usuários", details: error.message });
  }
});


app.listen(port, () => {
  console.log(`Rodando na porta ${port}`);
});
