const fs = require("fs");
const path = require("path");
const DB = require('./controllers/DatabaseController');

async function selecionar(nome) {
    // const ARQUIVO = path.resolve("salas", `${sala}.json`);
    // const existeSala = fs.existsSync(ARQUIVO);
    const sala = await DB.selecionarSalaDB(nome);
    
    if(sala.length) {
        sala[0].tabuleiro = sala[0].tabuleiro ? JSON.parse(sala[0].tabuleiro) : null;
        sala[0].bancopecas = sala[0].bancopecas ? JSON.parse(sala[0].bancopecas) : null;

        return sala[0];
    }
    console.log(sala);
    return null;
}

async function criar(sala, jogador, cor, cronometro) {        
    // let novaSala = selecionar(sala);

    let novaSala = await selecionar(sala);

    if(!novaSala) {
        let jogadorred;
        let jogadorblue;

        if(cor == 0) {
            jogadorred = jogador;
            jogadorblue = null;
        } else {
            jogadorred = null;
            jogadorblue = jogador;
        }

        novaSala = {
            sala,
            vezjogada: jogadorred ? jogadorred : jogadorblue,
            jogadorred,
            jogadorblue,
            tabuleiro: null,
            bancopecas: null,
            chat: null, 
            cronometro: cronometro
        };

        await DB.inserirSalaDB(novaSala);
        novaSala = await selecionar(sala);
        return novaSala;
    } else {
        return {erro: "A Sala já existe!"};
    }

}

async function entrarSala(sala, jogador, cor) {
    // let salaExistente = selecionar(sala);
    let salaExistente = await selecionar(sala);

    if(!salaExistente) {
        return {erro: "A sala não existe!"};
    } else {
        let validacao;

        if(cor == 0) { 
            validacao = (salaExistente.jogadorred == null) && (salaExistente.jogadorblue != jogador);
        } else if(cor == 1){
            validacao = (salaExistente.jogadorblue == null) && (salaExistente.jogadorred != jogador);
        }

        if(validacao) {
            if(cor == 0) { 
                salaExistente.jogadorred = jogador;                
            } else if(cor == 1){
                salaExistente.jogadorblue = jogador;
            }
            
            if(salaExistente.vezjogada == null) {
                salaExistente.vezjogada = jogador;
            }

            salaExistente.tabuleiro = JSON.stringify(salaExistente.tabuleiro);
            salaExistente.bancopecas = JSON.stringify(salaExistente.bancopecas);
            salaExistente.chat = JSON.stringify(salaExistente.chat);
            await DB.atualizarSalaDB(salaExistente);
            // salvarArquivo(sala, salaExistente);        

            return salaExistente;

        } else {
            return {erro: "A sala está cheia ou o nome do jogador informado já existe na sala!"};
        }
    }

}

async function sairSala(dados) {
    // console.log(dados);
    const sala = await selecionar(dados.sala);
    if(sala) {
        switch(dados.jogador) {
            case sala.jogadorred: {
                sala.jogadorred = null;                                     
                break;
            }
            case sala.jogadorblue: {
                sala.jogadorblue = null;                                                     
                break;
            }
        }

        if(sala.vezjogada == dados.jogador) {
            sala.vezjogada =  null;
        }   
        sala.tabuleiro = JSON.stringify(dados.tabuleiro);
        sala.bancopecas = JSON.stringify(dados.bancopecas);
        sala.chat = JSON.stringify(dados.chat);
        await DB.atualizarSalaDB(sala);
        const salaAtualizada = await selecionar(dados.sala);

        // if(sala.jogadorred == null && sala.jogadorblue == null) {
        //     await DB.excluirSala(sala);
        //     return null;
        // }
        
        return salaAtualizada;
    }

    return null;
}
async function atualizarHistoricoSala(dados) {
    // const sala = selecionar(dados.sala);
    const sala = await selecionar(dados.sala);
    sala.tabuleiro = JSON.stringify(dados.tabuleiro);
    sala.bancopecas = JSON.stringify(dados.bancopecas);
    sala.chat = JSON.stringify(dados.chat);
    // sala.cronometro = dados.cronometro;
    // console.log(sala);
    // salvarArquivo(dados.sala, sala);
    await DB.atualizarSalaDB(sala);
    const salaAtualizada = await selecionar(dados.sala);
    return salaAtualizada;
}

async function atualizarVezJogada(dados) {
    // const sala = selecionar(dados.sala);
    const sala = await selecionar(dados.sala);
    sala.vezjogada = (dados.vezjogada == sala.jogadorred) ? sala.jogadorblue : sala.jogadorred;

    await DB.atualizarVezJogadaSalaDB(sala);
    // salvarArquivo(dados.sala, sala);
    const salaAtualizada = await selecionar(dados.sala);
    return salaAtualizada;
}

async function atualizaCronometro(dados) {
    await DB.atualizaCronometro(dados);
    const salaAtualizada = await selecionar(dados.sala);
    return salaAtualizada;
}
// function salvarArquivo(sala, dados) {
//     const ARQUIVO = path.resolve("salas", `${sala}.json`);
//     fs.writeFileSync(ARQUIVO, JSON.stringify(dados), {
//         encoding: "utf8"
//     });
// }
module.exports = {
    // listar,
    selecionar,
    criar,
    entrarSala,
    atualizarHistoricoSala,
    atualizarVezJogada,
    sairSala,
    atualizaCronometro
}