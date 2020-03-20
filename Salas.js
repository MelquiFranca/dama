const fs = require("fs");
const path = require("path");

// function listar() {
//     return SALAS;
// }
    
function selecionar(sala) {
    const ARQUIVO = path.resolve("salas", `${sala}.json`);
    const existeSala = fs.existsSync(ARQUIVO);

    if(existeSala) {
        const sala = JSON.parse(fs.readFileSync(ARQUIVO,  "utf8"));

        if(!sala.sala) {
            return null;
        }

        return sala;
    }
    
    return null;
}

function criar(sala, jogador, cor) {        
    let novaSala = selecionar(sala);

    if(!novaSala) {
        let jogadorRed;
        let jogadorBlue;

        if(cor == 0) {
            jogadorRed = jogador;
            jogadorBlue = null;
        } else {
            jogadorRed = null;
            jogadorBlue = jogador;
        }

        novaSala = {
            sala,
            jogadorRed,
            jogadorBlue
        };

        salvarArquivo(sala, novaSala);
    }

    return novaSala;
}

function entrarSala(sala, jogador, cor) {
    let salaExistente = selecionar(sala);

    if(!salaExistente) {
        return {erro: "A sala não existe"};
    } else {
        let validacao;

        if(cor == 0) { 
            validacao = (salaExistente.jogadorRed == null) && (salaExistente.jogadorBlue != jogador);
        } else if(cor == 1){
            validacao = (salaExistente.jogadorBlue == null) && (salaExistente.jogadorRed != jogador);
        }

        if(validacao) {
            if(cor == 0) { 
                salaExistente.jogadorRed = jogador;
            } else if(cor == 1){
                salaExistente.jogadorBlue = jogador;
            }
            
            salvarArquivo(sala, salaExistente);        

            return salaExistente;

        } else {
            return {erro: "A sala está cheia ou o nome do jogador informado já existe na sala."};
        }
    }

}

function atualizarHistoricoSala(dados) {
    const sala = selecionar(dados.sala);
    sala.tabuleiro = dados.tabuleiro;
    console.log(sala);
    salvarArquivo(dados.sala, sala);
}

function salvarArquivo(sala, dados) {
    const ARQUIVO = path.resolve("salas", `${sala}.json`);
    fs.writeFileSync(ARQUIVO, JSON.stringify(dados), {
        encoding: "utf8"
    });
}
module.exports = {
    // listar,
    selecionar,
    criar,
    entrarSala,
    atualizarHistoricoSala
}