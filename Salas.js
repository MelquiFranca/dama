const SALAS = require('./salas.json');
const fs = require("fs");
    
function listar() {
    return SALAS;
}
    
function selecionar(sala) {
        const busca = SALAS.filter(item => {
        if(item.sala == sala) {
            return sala;
        }
    });
    if(busca.length) {
        return busca[0];
    }  
    return null;
}

function criar(sala, jogador, cor) {        
    let novaSala = selecionar(sala);

    if(novaSala) {
        return novaSala;
    } else {
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

        SALAS.push(novaSala);  
        fs.writeFileSync('./salas.json', JSON.stringify(SALAS));
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
            validacao = (sala.jogadorRed == null) && (sala.jogadorBlue != jogador);
        } else if(cor == 1){
            validacao = (sala.jogadorBlue == null) && (sala.jogadorRed != jogador);
        }

        if(validacao) {
                const novaSala = SALAS.map(sl => {
                    if(sl.sala == sala) {
                        sl.jogadorBlue = jogador;
                    }

                    return sl;
                });
                
                fs.writeFileSync('./salas.json', JSON.stringify(novaSala));
                return salaExistente;
        } else {
            return {erro: "A sala está cheia ou o nome do jogador informado já existe na sala."};
        }
    }

}

module.exports = {
    listar,
    selecionar,
    criar,
    entrarSala
}