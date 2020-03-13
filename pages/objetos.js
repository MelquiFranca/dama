const PECAS = document.getElementsByClassName('peca');
const DAMAS = document.getElementsByClassName('dama');
const CASAS = document.getElementsByClassName('casa');
const POSICOES = document.getElementsByClassName('black'); 
const BANCO_PECAS = document.getElementById("bancoPecas");

main();

function main() {
    desenhaTabuleiro();
    gerarPecasRed(12);
    gerarPecasBlue(12);
    carregarEventosObjetos();
}

function validaMovimento(casa, idpeca) {
    let retorno = casa.classList.contains('black');
    const filho = casa.getElementsByClassName('peca');
    const peca = document.getElementById(idpeca);

    const corPeca = peca.id.split('-')[0];
    
    switch(corPeca) {
        case 'blue': 
            retorno = retorno && validaMovimentoBlue(casa, peca);
            break;
        case 'red':
            retorno = retorno && validaMovimentoRed(casa, peca);
            break;        
    }

    retorno = retorno && (filho.length == 0);    

    return retorno;
}

function validaMovimentoRed(casa, peca) {
    const linColOrigem = peca.parentNode.id.split('-');
    const linColDestino = casa.id.split('-');
    const movDistanciaLinha = Math.abs(linColDestino[0] - linColOrigem[0]);
    const movDistanciaColuna = Math.abs(linColDestino[1] - linColOrigem[1]);
    let retorno;

    if(movDistanciaLinha == 1 && movDistanciaColuna == 1) {
        if(linColOrigem[0] < linColDestino[0]) {            
            retorno = true;
        } else {
            retorno = false;
        }
    } else if(movDistanciaLinha == 2 && movDistanciaColuna == 2) {
        retorno = verificaPecaParaComer(linColOrigem, linColDestino, 'jogadorRed');

    } else {
        retorno = false;
    }   

    if(retorno && (parseInt(linColDestino[0]) == 7)) {
        peca.classList.add('dama');
    }

    return retorno;
}

// function validaMovimentoDama(origem, destino, jogadorCor) {
//     const novaOrigem;
//     const novoDestino;
//     let retorno;
//     if(true) {
//         verificaPecaParaComer(origem, destino, jogadorCor);
//     } else {
//         retorno = validaMovimentoDama(novaOrigem, novoDestino, jogadorCor);
//     }

//     return retorno;
// }

function validaMovimentoBlue(casa, peca) {
    const linColOrigem = peca.parentNode.id.split('-');
    const linColDestino = casa.id.split('-');
    const movDistanciaLinha = Math.abs(linColDestino[0] - linColOrigem[0]);
    const movDistanciaColuna = Math.abs(linColDestino[1] - linColOrigem[1]);
    let retorno;
    if(movDistanciaLinha == 1 && movDistanciaColuna == 1) {
        if(linColOrigem[0] > linColDestino[0]) {            
            retorno = true;
        } else {
            retorno = false;
        }
    } else if(movDistanciaLinha == 2 && movDistanciaColuna == 2) {
        retorno = verificaPecaParaComer(linColOrigem, linColDestino, 'jogadorBlue');

    } else {
        retorno = false;
    }   

    if(retorno && (parseInt(linColDestino[0]) == 0 )) {
        peca.classList.add('dama');
    }

    return retorno;
}

function verificaPecaParaComer(origem, destino, jogadorCor) {
    // console.log(origem, destino);
    
    let linhaCasaPulada;
    let colunaCasaPulada;
    let direita;
    let frente;

    // direita = true e esquerda = false
    frente = origem[0] < destino[0];
    direita = origem[1] < destino[1];

    if(frente && direita) { 

        linhaCasaPulada = parseInt(destino[0]) - 1;
        colunaCasaPulada = parseInt(destino[1]) - 1;

    } else if(!frente && direita) {

        linhaCasaPulada = parseInt(destino[0]) + 1;
        colunaCasaPulada = parseInt(destino[1]) - 1;

    } else if(frente && !direita) {        
        linhaCasaPulada = parseInt(destino[0]) - 1;
        colunaCasaPulada = parseInt(destino[1]) + 1;

    } else if(!frente && !direita) {
        linhaCasaPulada = parseInt(destino[0]) + 1;
        colunaCasaPulada = parseInt(destino[1]) + 1;

    }


    if(linhaCasaPulada < 0 || colunaCasaPulada < 0) {
        return false;
    }

    const casaPulada = document.getElementById(`${linhaCasaPulada}-${colunaCasaPulada}`);
    const bancoPecas = document.getElementById('bancoPecas');
    // console.log(casaPulada.childNodes[0]);

    if(casaPulada.childNodes.length 
        && 
        casaPulada.childNodes[0].classList.contains('peca') 
        && 
        !casaPulada.childNodes[0].classList.contains(jogadorCor)             
    ) {
        casaPulada.childNodes[0].classList.add("pecaComida");
        bancoPecas.appendChild(casaPulada.childNodes[0]);

        return true;
    }
    return false;
}
function carregarEventosObjetos() {
    Array.from(PECAS).map(peca => {
        // peca.ondragstart = function(event) {
        //     movimentaPeca(event);
        // };

        peca.onclick = selecionarPeca
    });
    
    Array.from(CASAS).map(casa => {
        // casa.ondragover = function(event) {
        //     event.preventDefault();
        // };  
    
        if(casa.classList.contains("black")) {
            casa.onclick = soltaPeca;
        }
    });
}

function selecionarPeca(event) {
    const mao = document.createElement("div");
    mao.classList.add("mao");

    Array.from(PECAS).map(peca => {
        if(peca.id == event.target.id) {
            if(!peca.classList.contains("pecaSelecionada")){
                peca.classList.add("pecaSelecionada");
                peca.appendChild(mao);
            }
        } else {
            peca.classList.remove("pecaSelecionada");
            if(peca.childNodes.length) {
                peca.removeChild(peca.childNodes[0]);
            }
        }
    });   
}

// function movimentaPeca(event) {
//     // event.preventDefault();
//     // console.log(event.target);
//     event.dataTransfer.setData("Id", event.target.id);
// }   
function soltaPeca(event) {
    // event.preventDefault();
    if(event.target.childNodes.length) {
        return;
    }
    const pecaSelecionada = document.getElementsByClassName("pecaSelecionada");
    if(pecaSelecionada.length === 1) {  
        const pecaId = pecaSelecionada[0].id;
        // console.log(pecaId);
        if(validaMovimento(event.target, pecaId)){
            event.target.appendChild(document.getElementById(pecaId));
            enviaPosicaoTabuleiro();
        }
    }
}

function gerarPecasRed(quantidade) {    
    
    let i = 0;

    while(i < quantidade) {
        
        const pecaRed = document.createElement('div');
        pecaRed.classList.add('peca');
        pecaRed.classList.add('jogadorRed');
        // pecaRed.innerHTML = POSICOES[i].id;
        pecaRed.setAttribute('id', `red-${POSICOES[i].id}`);
        POSICOES[i].appendChild(pecaRed);

        i++;
    }
    
}

function gerarPecasBlue(quantidade) {
    
    let i = 1;
    while(i <= quantidade) {
        const pecaBlue = document.createElement('div');
        pecaBlue.classList.add('peca');
        pecaBlue.classList.add('jogadorBlue');

        // pecaBlue.innerHTML = POSICOES[i].id;
        pecaBlue.setAttribute('id', `blue-${POSICOES[POSICOES.length - i].id}`);
        POSICOES[POSICOES.length - i].appendChild(pecaBlue);
        i++;
    }
}

function desenhaTabuleiro() {
    let i = 0;
    let inicio = true;
    let tabuleiro = document.getElementById('tabuleiro');
    // tabuleiro.classList.add('tabuleiro');
    while(i < 8) {
        let j = 0;
        while(j < 8) {
            tabuleiro.appendChild(desenhaLinhaTabuleiro(inicio, i, j));
            j++;
            inicio = !inicio;
        }
        inicio = !inicio;
        i++;
    }

    // return tabuleiro;
}

function desenhaLinhaTabuleiro(inicio, ln, cl) {
    let cor = inicio;
    let linha = document.createElement('div');

    let id = `${ln}-${cl}`;
    corCasa = cor ? 'white' : 'black';

    linha = document.createElement('div');
    linha.classList.add('casa');
    linha.classList.add(corCasa);
    linha.setAttribute('id', id);

    return linha;
}

function enviaPosicaoTabuleiro() {        
    socket.emit("", ); 
    socket.emit("tabuleiro-banco-pecas", {
        tabuleiro: converteTabuleiroEmObjeto(), 
        bancoPecas: {...Array.from(BANCO_PECAS.childNodes).map(peca => peca.id)}
    });  
}

function converteTabuleiroEmObjeto() {
    let obj = {};
    Array.from(CASAS).map(casa => {        
        if(casa.childNodes.length) {
            obj[casa.id] = casa.childNodes[0].id;
        } else {
            obj[casa.id] = null;
        }
    });

    return obj;
}

function atualizaTabuleiro(dados) {
    // console.log(dados);
    Object.keys(dados).map((casaId) => {
        const casa = document.getElementById(casaId);
        const peca = document.getElementById(dados[casaId]);
        // casa.innerHTML = "";
        if(peca) {
            casa.appendChild(peca);
        }
    })
}

const socket = io("http://localhost:3333");

socket.on('atualiza-tabuleiro-banco-pecas', function(data) {    
    atualizaBancoPecas(data.bancoPecas);
    atualizaTabuleiro(data.tabuleiro);
});

function atualizaBancoPecas(data) {
    if (Object.keys(data).length) {
        Object.keys(data).map(indice => {
            const peca = document.getElementById(data[indice]);
            peca.classList.remove("pecaSelecionada");
            peca.classList.add("pecaComida");
            if(peca.childNodes.length) {
                peca.removeChild(peca.childNodes[0]);
            }
            BANCO_PECAS.appendChild(peca);
        });
    }
}
// socket.on('atualiza-banco-pecas', function(data) {    
//     // atualizaBancoPecas(data);
//     console.log(data);
// });
