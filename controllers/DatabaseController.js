const {Sequelize} = require("sequelize");
let sequelize;
if(process.env.PORT) {
    sequelize = new Sequelize(process.env.URI);
} else {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: 'BASE_DADOS_LOCAL.sqlite'
    
    });
}

async function deletarTabelaSalas() {
    await sequelize.query(`DROP TABLE IF EXISTS salas`);
}

const SQL_CREATE_POSTGRES = `CREATE TABLE IF NOT EXISTS salas(
    id BIGSERIAL,
    sala VARCHAR(255) UNIQUE NOT NULL,
    vezJogada VARCHAR(255) NULL,
    jogadorRed VARCHAR(255) NULL,
    jogadorBlue VARCHAR(255) NULL,
    tabuleiro TEXT NULL,
    bancoPecas TEXT NULL,
    PRIMARY KEY(serial)
)`;

const SQL_CREATE = `CREATE TABLE IF NOT EXISTS salas(
    id INTEGER PRIMARY KEY,
    sala VARCHAR(255) UNIQUE NOT NULL,
    vezJogada VARCHAR(255) NULL,
    jogadorRed VARCHAR(255) NULL,
    jogadorBlue VARCHAR(255) NULL,
    tabuleiro TEXT NULL,
    bancoPecas TEXT NULL
)`;

async function criarTabelaSalas(BANCO) {
    deletarTabelaSalas();
    let sql;
    if(BANCO) {
        sql = SQL_CREATE_POSTGRES;
    } else {
        sql = SQL_CREATE;
    }
    await sequelize.query(sql);
}

async function inserirSalaDB(dados) {
    const retorno = await sequelize.query(`INSERT INTO salas 
        (id, sala, vezJogada, jogadorRed, jogadorBlue, tabuleiro, bancoPecas) 
        VALUES (null, ?, ?, ?, ?, ?, ?)`, 
    {
        replacements: [
            dados.sala,
            dados.vezJogada, 
            dados.jogadorRed, 
            dados.jogadorBlue, 
            dados.tabuleiro, 
            dados.bancoPecas
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
        SET vezJogada = ?, jogadorRed = ?, jogadorBlue = ?, tabuleiro = ?, bancoPecas = ?
        WHERE sala = ?
    `, {
        replacements: [
            dados.vezJogada, 
            dados.jogadorRed, 
            dados.jogadorBlue, 
            dados.tabuleiro, 
            dados.bancoPecas,
            dados.sala
        ],
    });

    return retorno;
}
async function atualizarVezJogadaSalaDB(dados) {
    const retorno = await sequelize.query(`UPDATE salas 
        SET vezJogada = ? 
        WHERE sala = ?
    `, {
        replacements: [
            dados.vezJogada,
            dados.sala
        ],
    });

    return retorno;
}

module.exports = {
    criarTabelaSalas,
    inserirSalaDB,
    selecionarSalaDB,
    atualizarSalaDB,
    atualizarVezJogadaSalaDB
}