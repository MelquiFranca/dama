const {Sequelize} = require("sequelize");
const path = require("path");
let sequelize;
if(process.env.PORT) {
    sequelize = new Sequelize(process.env.URI);
} else {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.resolve('DB_TESTES', 'DB_LOCAL_DOIS.sqlite')        
    });
}

async function deletarTabelaSalas() {
    await sequelize.query(`DROP TABLE IF EXISTS salas`);
}

const SQL_CREATE_POSTGRES = `CREATE TABLE IF NOT EXISTS salas(
    sala VARCHAR(255) UNIQUE NOT NULL,
    vezjogada VARCHAR(255) NULL,
    jogadorred VARCHAR(255) NULL,
    jogadorblue VARCHAR(255) NULL,
    tabuleiro TEXT NULL,
    bancopecas TEXT NULL,
    chat TEXT NULL,
    PRIMARY KEY(sala)
)`;
    // CREATE TABLE IF NOT EXISTS logUsuarios(
    //     nome VARCHAR(255) NOT NULL,
    //     data DATE NOT NULL,
    // )

const SQL_CREATE = `CREATE TABLE IF NOT EXISTS salas(
    id INTEGER PRIMARY KEY,
    sala VARCHAR(255) UNIQUE NOT NULL,
    vezjogada VARCHAR(255) NULL,
    jogadorred VARCHAR(255) NULL,
    jogadorblue VARCHAR(255) NULL,
    tabuleiro TEXT NULL,
    bancopecas TEXT NULL,
    chat TEXT NULL
)`;

async function criarTabelaSalas(BANCO) {
    let sql;
    // await deletarTabelaSalas();
    if(BANCO) {
        sql = SQL_CREATE_POSTGRES;
    } else {
        sql = SQL_CREATE;
    }
    await sequelize.query(sql);
}

async function inserirSalaDB(dados) {
    const retorno = await sequelize.query(`INSERT INTO salas 
        (sala, vezjogada, jogadorred, jogadorblue, tabuleiro, bancopecas, chat) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`, 
    {
        replacements: [
            dados.sala,
            dados.vezjogada, 
            dados.jogadorred, 
            dados.jogadorblue, 
            dados.tabuleiro, 
            dados.bancopecas,
            dados.chat
        ],
    });

    return retorno;
}

async function selecionarSalaDB(sala) {
    const retorno = await sequelize.query(`SELECT * FROM salas WHERE sala = ?`, {
        replacements: [sala],
    });

    return retorno[0];
}
async function atualizarSalaDB(dados) {
    const retorno = await sequelize.query(`UPDATE salas 
        SET vezjogada = ?, jogadorred = ?, jogadorblue = ?, tabuleiro = ?, bancopecas = ?, chat = ? 
        WHERE sala = ?
    `, {
        replacements: [
            dados.vezjogada, 
            dados.jogadorred, 
            dados.jogadorblue, 
            dados.tabuleiro, 
            dados.bancopecas,
            dados.chat,
            dados.sala
        ],
    });

    return retorno;
}
async function atualizarVezJogadaSalaDB(dados) {
    const retorno = await sequelize.query(`UPDATE salas 
        SET vezjogada = ? 
        WHERE sala = ?
    `, {
        replacements: [
            dados.vezjogada,
            dados.sala
        ],
    });

    return retorno;
}

async function excluirSala(sala) {
    const retorno = await sequelize.query(`DELETE FROM salas WHERE sala = ?`, {
        replacements: [sala],
    });
    // console.log(retorno);
    return retorno[0];
}

module.exports = {
    criarTabelaSalas,
    inserirSalaDB,
    selecionarSalaDB,
    atualizarSalaDB,
    atualizarVezJogadaSalaDB,
    excluirSala,
}