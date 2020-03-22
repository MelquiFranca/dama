const {Sequelize} = require("sequelize");
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.PORT ? 'BASE_DADOS.sqlite' : 'BASE_DADOS_LOCAL.sqlite'

});

async function criarTabelaSalas() {
    await sequelize.query(`CREATE TABLE IF NOT EXISTS salas(
        id INTEGER PRIMARY KEY,
        sala VARCHAR(255) UNIQUE NOT NULL,
        vezJogada VARCHAR(255) NULL,
        jogadorRed VARCHAR(255) NULL,
        jogadorBlue VARCHAR(255) NULL,
        tabuleiro TEXT NULL,
        bancoPecas TEXT NULL
    )`);
}

async function inserirSalaDB(dados) {
    const retorno = await sequelize.query(`INSERT INTO salas 
        (sala, vezJogada, jogadorRed, jogadorBlue, tabuleiro, bancoPecas) 
        VALUES (?, ?, ?, ?, ?, ?)`, 
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