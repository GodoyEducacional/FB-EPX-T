const express = require("express");
const axios = require("axios"); // Biblioteca para requisição HTTP
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Importa o modelo criado
const Address = require("../backend/model/Address");

// Carrega as variàveis de ambiente .ENV
dotenv.config();

// Chama o Express (Servidor)
const app = express();

// Permitir JSON nas requisições
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "GET, POST");
  res.header("Access-Control-Allow-Origin", "Content-Type");
  next;
});

// http://localhost:3000/api/cep/13455721
// Rota GET para buscar informações conforme o CEP informado
app.get("/api/cep/:cep", async (req, res) => {
  const { cep } = req.params; // Extrai o CEP da URL

  try {
    // Faz requisição GET para API ViaCEP, passando o CEP
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o CEP!" });
  }
});

// Obtem as credenciais do MongoDB armazernada no .env
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Cria a string de conexão com o MongoDB
const mongoURI = `mongodb+srv://${dbUser}:${dbPassword}@clusterapi.h93mb.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAPI`;

// Define a porta que o servidor irá executar
const port = 3000;

mongoose
  .connect(mongoURI) // Conecta ao banco pelo Linl
  .then(() => {
    // Quando for conecto corretamente
    console.log("Conectou ao banco!"); // Exibe uma mensagem no console
    // Inicia o sercidor após o banco de dados conectar
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("Erro ao conectar ao MongoDB!", err)); // Exibe o erro
