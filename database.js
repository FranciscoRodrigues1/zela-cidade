const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

//Criando uma função assíncrona
const criarBanco = async () => {
  const db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });

  //Criando a tabela de incidentes

  await db.exec(`
    CREATE TABLE IF NOT EXISTS incidentes(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_problema TEXT,                              -- O que aconteceu (Buraco, Lixo, Luz...)
        localizacao TEXT,                                -- Onde aconteceu (Rua, Bairro)
        descricao TEXT,                                  -- Detalhes da reclamação
        prioridade TEXT,                                 -- Baixa, Média ou Alta   
        nome_solicitante TEXT,                           -- Quem está avisando
        data_registro TEXT,                              -- Data em formato (ex: 16/03 16.03)
        hora_registro TEXT,                              -- Hora que foi registrado
        status_resolucao TEXT DEFAULT 'Pendente'         -- O banco define automaticamente como 'Pendente'
    )
    `);

  console.log(
    "Banco de dados configurado: A tabela de registros urbanos está pronta!",
  );

  //==== CRUD ====//

  // Insert - C do Crud - que significa CREATE //

  const checagem = await db.get(`SELECT COUNT (*) AS total FROM incidentes`);

  if (checagem.total === 0) {
    await db.exec(`
    INSERT INTO incidentes(tipo_problema, localizacao, descricao, prioridade, nome_solicitante, data_registro, hora_registro) VALUES
    ("Iluminação", "Rua Amapá, 853, Bairro Boa Esperança", "Poste queimado há dias", "Média", "Kelton Rodrigues", "16/03/2026", "08:30"),
    ("Falta de energia", "Rua Antonio Zeferino Veras", "Local na escuridão", "Alta", "João Almeida", "16/03/2026", "22:15"),
    ("Falta de Água", "Rua 24 de Maio, 3412", "Vazamento de água constante próximo ao bueiro.", "Alta", "José Pires", "16/03/2026", "10:00"),
    ("Pavimentação", "Avenida Principal","Calçada em mau estado", "Alta", "Maria Agatha","14/03/2026", "14:30")
    `);
  } else {
    console.log(`Banco pronto com ${checagem.total} de incidentes `);
  }

  // SELECT - R do CRUD - READ que significa LER / CONSULTAR //

  const todosOsIncidentes = await db.all("SELECT * FROM incidentes");
  console.table(todosOsIncidentes);

  // Exemplo de SELECT especifico //

  const chamadosKelton = await db.all(
    `SELECT * FROM incidentes WHERE nome_solicitante = "Kelton Rodrigues"`,
  );
  console.table(chamadosKelton);

  // U do CRUD - Update - Que siginifica atualizar //

  await db.run(`
    UPDATE incidentes
    SET status_resolucao = "em análise"
    WHERE  data_registro = "16/03/2026"
    `);

  console.log(
    "Todos as reclamações do dia 16/03/2026 tiveram umas atualizaçoão",
  );

  //UPDATE

  await db.run(`
  UPDATE incidentes
  SET status_resolucao = "Resolvido"
  WHERE tipo_problema = "Falta de energia"
  `);
  console.log("Problema do hospital resolvido");

  // console.table(todosOsIncidentes)

  // D do CRUD - que siginifica DELETAR / APAGAR OU REMOVER //

  await db.run(`DELETE FROM incidentes WHERE id = 2 `);

  console.log("Registro do ID 2 removido");

  //Relatório/SELECT Final
  //console.log("Relatório Atualizado(FINAL)");

  const resultadoFinal = await db.all(`SELECT * FROM incidentes`);
  console.table(resultadoFinal);

  return db; //Retorna o banco (Entregando a chabe do banco pra alguém)

};

module.exports = { criarBanco } //Cria uma ponte que permite compartilhar funções entre os arquivos
