//Importações

const express = require("express"); //Framework que cria o servidor e as rotas
const { criarBanco } = require("./database"); //A chave que vai abrir a conexão com o banco de dados

const app = express(); //Inicialização: Ligando o motor do servidor

app.use(express.json()); //Tradutor: Configura o Express para entender dados enviados no formato JSON

//Criando a Rota Principal /Rota Raiz

app.get("/", (req, res) => {
  //res.send: Envia uma resposta simples (texto, html, json)
  res.send(`
        <body>
    <h1> ZelaCidade </h1>
    <h2> Gestão de Problemas Urbanos </h2>
    <p> Endpoint que leva aos incidentes cadastrados: /incidentes </p> 
        </body>
        
        `);
});

//Porta do servidor

const PORT = 3000;

//Ligando o Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


//Rota de Listagem - Para buscar todos os problemas registrados

app.get("/incidentes", async (req, res) => {

const db = await criarBanco() // Chamamos a função do outro arquivo. O await é o "aguarde", pois o banco precisa de tempo para abrir. 

const listaIncidentes = await db.all(`SELECT * FROM incidentes`)

res.json(listaIncidentes) //Entrega esses dados para o cliente em formato JSON

} ) 