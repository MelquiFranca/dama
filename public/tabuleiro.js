const PECAS = document.getElementsByClassName('peca');
const DAMAS = document.getElementsByClassName('dama');
const CASAS = document.getElementsByClassName('casa');
const POSICOES = document.getElementsByClassName('black'); 
const BANCO_PECAS = document.getElementById("bancoPecas");
const CHAT = document.getElementById("chat-form");
const EXIBE_CHAT = document.getElementById("exibe-chat");
const FECHA_CHAT = document.getElementById("fechar-chat");
const MENSAGENS = document.getElementById("mensagens");
const FINALIZA_JOGADA = document.getElementById("finaliza-jogada");

if(!window.localStorage.sala) {
    window.location = "inicio";
} else {
    main();
}

function main() {
    desenhaTabuleiro();
    gerarPecasRed(12);
    gerarPecasBlue(12);
    carregarEventosObjetosJogador(window.localStorage.corPeca);
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

function validaMovimentoDama(linColOrigem, linColDestino, jogadorCor) {
    let retorno;
    const movDistanciaLinha = Math.abs(linColDestino[0] - linColOrigem[0]);
    const movDistanciaColuna = Math.abs(linColDestino[1] - linColOrigem[1]);
    if(movDistanciaColuna == movDistanciaLinha) {
        retorno = isCasaPuladaVazia(linColOrigem, linColDestino);        
        if(!retorno) {
            retorno = verificaPecaParaComerDama(linColOrigem, linColDestino, jogadorCor);
        }
    } else {
        retorno = false;
    }
    

    return retorno;
}

function validaMovimentoRed(casa, peca) {
    const linColOrigem = peca.parentNode.id.split('-');
    const linColDestino = casa.id.split('-');
    const movDistanciaLinha = Math.abs(linColDestino[0] - linColOrigem[0]);
    const movDistanciaColuna = Math.abs(linColDestino[1] - linColOrigem[1]);
    let retorno;

    if(peca.classList.contains("dama")) {
        retorno = validaMovimentoDama(linColOrigem, linColDestino, "jogadorRed");
    } else {
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
    }
    return retorno;
}

function validaMovimentoBlue(casa, peca) {
    const linColOrigem = peca.parentNode.id.split('-');
    const linColDestino = casa.id.split('-');
    const movDistanciaLinha = Math.abs(linColDestino[0] - linColOrigem[0]);
    const movDistanciaColuna = Math.abs(linColDestino[1] - linColOrigem[1]);
    let retorno;

    if(peca.classList.contains("dama")) {
        retorno = validaMovimentoDama(linColOrigem, linColDestino, "jogadorBlue");
    } else {
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
        casaPulada.childNodes[0].classList.add("pecaMini");
        casaPulada.childNodes[0].classList.remove("peca");
        bancoPecas.appendChild(casaPulada.childNodes[0]);

        return true;
    }
    return false;
}

function verificaPecaParaComerDama(origem, destino, jogadorCor) {
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

    if(
            casaPulada.childNodes.length 
        && 
            casaPulada.childNodes[0].classList.contains('peca') 
        && 
            !casaPulada.childNodes[0].classList.contains(jogadorCor)    
        && 
            isCasaPuladaVazia(origem, [linhaCasaPulada, colunaCasaPulada])        
    ) {
        // console.log(casaPulada.childNodes[0]);
        casaPulada.childNodes[0].classList.add("pecaMini");
        casaPulada.childNodes[0].classList.remove("peca");
        bancoPecas.appendChild(casaPulada.childNodes[0]);

        return true;
    } 

    return false;
}

function isCasaPuladaVazia(origem, destino) {
    // let inicio = Math.abs(origem[0]);
    let fim = Math.abs(destino[0] - origem[0]);
    let retorno;
    const difLin = destino[0] - origem[0];
    const difCol = destino[1] - origem[1];
    // console.log("difLin:", difLin);
    // console.log("difCol:", difCol);

    if(fim <= 1) {
        return true;
    }

    for(let inicio = 1; inicio <= fim - 1; inicio++) {

        const lin = (difLin < 0) ? (parseInt(destino[0]) + inicio) : (parseInt(destino[0]) - inicio);
        const col = (difCol < 0) ? (parseInt(destino[1]) + inicio) : (parseInt(destino[1]) - inicio);

        // console.log(`${lin}-${col}`);
        const casaPulada = document.getElementById(`${lin}-${col}`);

        if(casaPulada.childNodes.length 
            && 
            casaPulada.childNodes[0].classList.contains('peca')              
        ) {
            retorno = false;
            break;
        } else {
            retorno = true;
        }
    }

    return retorno;
}

function carregarEventosObjetosJogador(corPeca) {
    Array.from(PECAS).map(peca => {
        // peca.ondragstart = function(event) {
        //     movimentaPeca(event);
        // };

        if(corPeca == 0) {
            if(peca.classList.contains("jogadorRed")) {
                peca.onclick = selecionarPeca
            } 
        } else if(corPeca == 1) {
            if(peca.classList.contains("jogadorBlue")) {
                peca.onclick = selecionarPeca
            }
        }
    });
    
    Array.from(CASAS).map(casa => {
        // casa.ondragover = function(event) {
        //     event.preventDefault();
        // };  
    
        if(casa.classList.contains("black")) {
            casa.onclick = soltaPeca;
        }
    });

    CHAT.onsubmit = enviaChat
    EXIBE_CHAT.onclick = exibeChat
    FECHA_CHAT.onclick = fechaChat
    FINALIZA_JOGADA.onclick = finalizaJogada
}

function removeEventosObjetos() {
    Array.from(PECAS).map(peca => {
        // peca.ondragstart = function(event) {
        //     movimentaPeca(event);
        // };

        peca.onclick = null;
        if(peca.classList.contains("pecaSelecionada")){
            peca.classList.remove("pecaSelecionada");

            if(peca.childNodes.length) {
                const mao = peca.childNodes[0];
                if(mao.classList.contains("mao")) {
                    peca.removeChild(mao);
                }
            }

        }    
    });

        
    Array.from(CASAS).map(casa => {
        // casa.ondragover = function(event) {
        //     event.preventDefault();
        // };  
    
        if(casa.classList.contains("black")) {
            casa.onclick = null;
        }
    });

    FINALIZA_JOGADA.onclick = null
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

function exibeInformacoesSalaNatela(dados) {
    // console.log(dados);
    const titulo = document.getElementById('titulo');
    const nomeJogadorRed = document.getElementById('nomeJogadorRed');
    const nomeJogadorBlue = document.getElementById('nomeJogadorBlue');
    titulo.innerText = dados.sala.toUpperCase();

    switch(window.localStorage.voce) {
        case dados.jogadorRed: 
            nomeJogadorRed.innerText = "Você";
            nomeJogadorBlue.innerText = dados.jogadorBlue ? dados.jogadorBlue : "Aguardando...";
            break;
        case dados.jogadorBlue:
            nomeJogadorBlue.innerText = "Você";
            nomeJogadorRed.innerText = dados.jogadorRed ? dados.jogadorRed : "Aguardando...";
            break;
    }
    
}

function ativaJogadorVez(dados) {
    let campoNomeAtual;
    let campoNomeAntigo;
    if(dados.vezJogada == dados.jogadorRed) {
        campoNomeAtual = document.getElementById("nomeJogadorRed").parentNode;
        campoNomeAntigo = document.getElementById("nomeJogadorBlue").parentNode;

    } else if(dados.vezJogada == dados.jogadorBlue) {
        campoNomeAtual = document.getElementById("nomeJogadorBlue").parentNode;        
        campoNomeAntigo = document.getElementById("nomeJogadorRed").parentNode;
    }
    
    if(!(window.localStorage.voce == dados.vezJogada)) {
        // console.log("Não é Você: ", dados.vezJogada);
        removeEventosObjetos();
        ativaDesativaFinalizarJogada(false);
    } else {
        // console.log("VOCE: ", dados.vezJogada);
        carregarEventosObjetosJogador(window.localStorage.corPeca);
        ativaDesativaFinalizarJogada(true);
    }

    campoNomeAtual.classList.add("vezJogada");
    campoNomeAntigo.classList.remove("vezJogada");
}

function enviaPosicaoTabuleiro() {        
    // socket.emit("", ); 
    socket.emit("tabuleiro-banco-pecas", {
        vezJogada: window.localStorage.voce,
        sala: window.localStorage.sala,
        tabuleiro: converteTabuleiroEmObjeto(), 
        bancoPecas: {...Array.from(BANCO_PECAS.childNodes).map(peca => peca.id)}
    });  
}

function finalizaJogada() {
    socket.emit("finaliza-jogada", {
        vezJogada: window.localStorage.rival,
        sala: window.localStorage.sala
    });   
}

function ativaDesativaFinalizarJogada(status) {
    if(status) {
        FINALIZA_JOGADA.innerText = "Finalizar Jogada";
        FINALIZA_JOGADA.classList.add("vezJogadaAtivo");
        FINALIZA_JOGADA.classList.remove("vezJogadaInativo");
    } else {
        FINALIZA_JOGADA.innerText = "Aguarde...";
        FINALIZA_JOGADA.classList.add("vezJogadaInativo");
        FINALIZA_JOGADA.classList.remove("vezJogadaAtivo");
    }
}

function converteTabuleiroEmObjeto() {
    let obj = {};
    Array.from(CASAS).map(casa => {        
        if(casa.childNodes.length) {
            obj[casa.id] = {
                pecaId: casa.childNodes[0].id,
                isDama: casa.childNodes[0].classList.contains("dama")
            };
        } else {
            obj[casa.id] = {
                pecaId: null,
                isDama: false
            };
        }
    });

    return obj;
}

function atualizaTabuleiro(dados) {
    // console.log(dados);
    Object.keys(dados).map((casaId) => {
        const casa = document.getElementById(casaId);
        const peca = document.getElementById(dados[casaId].pecaId);
        if(dados[casaId].isDama) {
            peca.classList.add("dama");
        }
        // casa.innerHTML = "";
        if(peca) {
            casa.appendChild(peca);
        }
    })
}

function atualizaBancoPecas(data) {
    if (Object.keys(data).length) {
        Object.keys(data).map(indice => {
            const peca = document.getElementById(data[indice]);
            peca.classList.remove("peca");
            peca.classList.add("pecaMini");
            if(peca.childNodes.length) {
                peca.removeChild(peca.childNodes[0]);
            }
            BANCO_PECAS.appendChild(peca);
        });
    }
}

function enviaChat(event) {
    event.preventDefault();
    const mensagem = document.getElementById("texto");
    if(mensagem.value.length) {
        socket.emit("mensagem", {mensagem: mensagem.value, sala: window.localStorage.sala});     
        
        document.getElementById("enviar-mensagem").disabled = true;
        document.getElementById("enviar-mensagem").style.background = "#999";
        document.getElementById("enviar-mensagem").innerText = "Aguarde...";
        setTimeout((teste) => {
            document.getElementById("enviar-mensagem").style.background = "#04945d";
            document.getElementById("enviar-mensagem").disabled = false;
            document.getElementById("enviar-mensagem").innerText = "Enviar";
        }, 7000);
    }
}

function exibeMensagem(texto) {
        const mensagem = document.createElement("div");
        const corpo = document.getElementById("corpo");
        mensagem.classList.add("mensagem");
        // mensagem.id = MENSAGENS.childNodes.length;
        mensagem.innerText = texto;
        corpo.appendChild(mensagem);

        setTimeout(() => {
            document.getElementById("enviar-mensagem").style.background = "#04945d";
            document.getElementById("enviar-mensagem").disabled = false;
            // const mensagemRemover = document.getElementById(mensagem.id);
            corpo.removeChild(mensagem);
        }, 8000);
}
function exibeChat(event) {
    event.preventDefault();
    CHAT.style.display = "flex";
    BANCO_PECAS.style.display = "none";
    event.target.style.display = "none";
}

function fechaChat(event) {
    event.preventDefault();
    EXIBE_CHAT.style.display = "flex";
    BANCO_PECAS.style.display = "flex";
    CHAT.style.display = "none";   
}


function limparHistorico() {
    window.localStorage.removeItem("jogador");
    window.localStorage.removeItem("sala");
    window.localStorage.removeItem("dados");
}

function atualizaStatusJogo(data) {
    ativaJogadorVez(data);
    atualizaBancoPecas(data.bancoPecas);
    atualizaTabuleiro(data.tabuleiro);
}
const socket = io(process.env.PORT ? undefined : "http://192.168.1.4:3333");
socket.on("connect", async function() {
    socket.emit("nova-sala", window.localStorage.sala);

    const retorno = await fetch("/carregaDadosSala", {
        method: "POST",
        mode: "cors",
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({sala: window.localStorage.sala})
    });
    
    const resposta = await retorno.json();
    
    exibeInformacoesSalaNatela({
        sala: resposta.sala,
        jogadorRed: resposta.jogadorRed,
        jogadorBlue: resposta.jogadorBlue,
    });
    
    ativaJogadorVez(resposta);

    if(resposta.tabuleiro) {
        atualizaTabuleiro(resposta.tabuleiro);
        atualizaBancoPecas(resposta.bancoPecas);
    }
});

socket.on('atualiza-tabuleiro-banco-pecas', function(data) {
    atualizaStatusJogo(data);
});

socket.on("inicia-jogada", function(data) {    
    atualizaStatusJogo(data);
});

socket.on("retorno-mensagem", function(data) {
    // console.log(data);
    exibeMensagem(data);
});

// socket.on("carrega-dados-sala", function(data) {
//     console.log(data);
// });
