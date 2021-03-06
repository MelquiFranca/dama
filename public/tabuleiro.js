const PECAS = document.getElementsByClassName('peca');
const DAMAS = document.getElementsByClassName('dama');
const CASAS = document.getElementsByClassName('casa');
const POSICOES = document.getElementsByClassName('black'); 
const BANCO_PECAS = document.getElementById("bancopecas");

const CHAT = document.getElementById("chat-form");
const EXIBE_CHAT = document.getElementById("exibe-chat");
const FECHA_CHAT = document.getElementById("fechar-chat");
const CABECALHO_CHAT = document.querySelector("#chat-form .cabecalho");
const MENSAGENS = document.getElementById("mensagens");

const MODO_ESPERA = document.getElementById("modoEspera");

const FINALIZA_JOGADA = document.getElementById("finaliza-jogada");

const SAIR_SALA = document.getElementById("sair");
const NOVO_JOGO = document.getElementById('novo-menu');
const EXIBE_MENU = document.getElementById('exibe-menu');
const VOLTAR_MENU = document.getElementById('voltar-menu');

let CONTAGEM;

if(!window.localStorage.sala) {
    window.location = "inicio";
} else {
    main();
}

function main() {
    // window.localStorage.proximaJogada = false;    
    desenhaTabuleiro();
    gerarPecasRed(12);
    gerarPecasBlue(12);
    carregarEventosObjetosJogador(window.localStorage.corPeca, window.localStorage.proximaJogada);
}

function validaMovimento(casa, idpeca) {
    let retorno = casa.classList.contains('black');
    const filho = casa.getElementsByClassName('peca');
    const peca = document.getElementById(idpeca);

    const corPeca = peca.id.split('-')[0];
    
    let validacao;
    switch(corPeca) {
        case 'blue': 
            validacao = validaMovimentoBlue(casa, peca);
            if(validacao.comeu) {
                validacao.retorno = retorno && validacao.retorno;
                retorno = validacao;
            } else {
                retorno = retorno && validacao;
            }
            break;
        case 'red':
            validacao = validaMovimentoRed(casa, peca);
            if(validacao.comeu) {
                validacao.retorno = retorno && validacao.retorno;
                retorno = validacao;
            } else {
                retorno = retorno && validacao;
            }
            break;        
    }


    if(retorno.comeu) {
        retorno.retorno = retorno.retorno && (filho.length == 0);
    } else {
        // retorno = retorno && validacao;
        retorno = retorno && (filho.length == 0);    
    }
    
    return retorno;
}

function validaMovimentoDama(linColOrigem, linColDestino, jogadorCor) {
    let retorno;
    const movDistanciaLinha = Math.abs(linColDestino[0] - linColOrigem[0]);
    const movDistanciaColuna = Math.abs(linColDestino[1] - linColOrigem[1]);
    if(movDistanciaColuna == movDistanciaLinha) {
        retorno = isCasaPuladaVazia(linColOrigem, linColDestino);   
    
        if(!retorno) {            
            retorno = {retorno: verificaPecaParaComerDama(linColOrigem, linColDestino, jogadorCor), comeu: true};
        } else {
            return retorno;
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
        retorno = validaMovimentoDama(linColOrigem, linColDestino, "jogadorred");
        if(window.localStorage.proximaJogada == "true" && !retorno.comeu) { 
            return false;
        }
    } else {

        if(movDistanciaLinha == 1 && movDistanciaColuna == 1 && window.localStorage.proximaJogada != "true") {

            if(linColOrigem[0] < linColDestino[0]) {            
                retorno = true;
            } else {
                retorno = false;
            }
        } else if(movDistanciaLinha == 2 && movDistanciaColuna == 2) {
            retorno = {retorno: verificaPecaParaComer(linColOrigem, linColDestino, 'jogadorred'), comeu: true};

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
        retorno = validaMovimentoDama(linColOrigem, linColDestino, "jogadorblue");
        if(window.localStorage.proximaJogada == "true" && !retorno.comeu) { 
            return false;
        }
    } else {
        if(movDistanciaLinha == 1 && movDistanciaColuna == 1 && window.localStorage.proximaJogada != "true") {
            
            if(linColOrigem[0] > linColDestino[0]) {            
                retorno = true;
            } else {
                retorno = false;
            }
        } else if(movDistanciaLinha == 2 && movDistanciaColuna == 2) {
            retorno = {retorno: verificaPecaParaComer(linColOrigem, linColDestino, 'jogadorblue'), comeu: true};

        } else {
            // console.log("TEESTE");
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
    const bancopecas = document.getElementById('bancopecas');
    // console.log(casaPulada.childNodes[0]);

    if(casaPulada.childNodes.length 
        && 
        casaPulada.childNodes[0].classList.contains('peca') 
        && 
        !casaPulada.childNodes[0].classList.contains(jogadorCor)             
    ) {
        casaPulada.childNodes[0].classList.add("pecaMini");
        casaPulada.childNodes[0].classList.remove("peca");
        bancopecas.appendChild(casaPulada.childNodes[0]);

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
    const bancopecas = document.getElementById('bancopecas');
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
        bancopecas.appendChild(casaPulada.childNodes[0]);

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

function carregarEventosObjetosJogador(corPeca, proximaJogada) {
    Array.from(PECAS).map(peca => {
        // peca.ondragstart = function(event) {
        //     movimentaPeca(event);
        // };

        
        if(corPeca == 0) {
            if(peca.classList.contains("jogadorred")) {
                if(proximaJogada == "true") {
                    if(peca.classList.contains("pecaSelecionada")) {
                        peca.onclick = selecionarPeca
                    } else {
                        peca.onclick = null
                    }

                } else {
                    peca.onclick = selecionarPeca
                }
            } 
        } else if(corPeca == 1) {
            if(peca.classList.contains("jogadorblue")) {
                if(proximaJogada == "true") {
                    if(peca.classList.contains("pecaSelecionada")) {
                        peca.onclick = selecionarPeca
                    } else {
                        peca.onclick = null
                    }

                } else {
                    peca.onclick = selecionarPeca
                }
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
    // CABECALHO_CHAT.onclick = fechaChat
    FINALIZA_JOGADA.onclick = finalizaJogada
    NOVO_JOGO.onclick = reiniciaJogo
    SAIR_SALA.onclick = sairSala
    EXIBE_MENU.onclick = function() {
        exibeOcultaMenu(true);
    };
    VOLTAR_MENU.onclick = function() {
        exibeOcultaMenu(false);
    };
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
        const retorno = validaMovimento(event.target, pecaId);
        const retornoComeu = (retorno.comeu) ? retorno.retorno : retorno;
        if(retornoComeu){
            event.target.appendChild(document.getElementById(pecaId));   
            carregarEventosObjetosJogador(window.localStorage.corPeca, true);         
            enviaPosicaoTabuleiro();            
            window.localStorage.proximaJogada = true;
            if(!retorno.retorno) {                
                finalizaJogada();
            }
        }
    }
}

function gerarPecasRed(quantidade) {    
    
    let i = 0;

    while(i < quantidade) {
        
        const pecaRed = document.createElement('div');
        pecaRed.classList.add('peca');
        pecaRed.classList.add('jogadorred');
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
        pecaBlue.classList.add('jogadorblue');

        // pecaBlue.innerHTML = POSICOES[i].id;
        pecaBlue.setAttribute('id', `blue-${POSICOES[POSICOES.length - i].id}`);
        POSICOES[POSICOES.length - i].appendChild(pecaBlue);
        i++;
    }
}

function desenhaTabuleiro() {
    let i = 0;
    let inicio = true;
    const corpo = document.getElementById('corpo');
    const tabuleiro = document.createElement('div');
    tabuleiro.setAttribute('id', 'tabuleiro');
    tabuleiro.classList.add('tabuleiro');
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

    corpo.insertBefore(tabuleiro, corpo.childNodes[4]);
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
        case dados.jogadorred: 
            nomeJogadorRed.innerText = "Você";
            nomeJogadorBlue.innerText = dados.jogadorblue ? dados.jogadorblue : "Aguardando...";
            window.localStorage.rival = dados.jogadorblue;
            break;
        case dados.jogadorblue:
            nomeJogadorBlue.innerText = "Você";
            nomeJogadorRed.innerText = dados.jogadorred ? dados.jogadorred : "Aguardando...";
            window.localStorage.rival = dados.jogadorred;
            break;
    }


    
}

function ativaJogadorVez(dados) {
    // console.log(dados);
    let campoNomeAtual;
    let campoNomeAntigo;
    if(dados.vezjogada == dados.jogadorred) {
        campoNomeAtual = document.getElementById("nomeJogadorRed").parentNode;
        campoNomeAntigo = document.getElementById("nomeJogadorBlue").parentNode;

    } else {
        campoNomeAtual = document.getElementById("nomeJogadorBlue").parentNode;        
        campoNomeAntigo = document.getElementById("nomeJogadorRed").parentNode;
    }
      
    if(!(window.localStorage.voce == dados.vezjogada)) {
        // console.log("Não é Você: ", dados.vezjogada);
        removeEventosObjetos();
        ativaDesativaFinalizarJogada(false);
    } else {
        // console.log("VOCE: ", dados.vezjogada);
        carregarEventosObjetosJogador(window.localStorage.corPeca, window.localStorage.proximaJogada);
        ativaDesativaFinalizarJogada(true);
    }

    campoNomeAtual.classList.add("vezjogada");
    campoNomeAntigo.classList.remove("vezjogada");
}

function enviaPosicaoTabuleiro() {        
    // socket.emit("", ); 
    socket.emit("tabuleiro-banco-pecas", {
        vezjogada: window.localStorage.voce,
        sala: window.localStorage.sala.toUpperCase(),
        tabuleiro: converteTabuleiroEmObjeto(), 
        bancopecas: {...Array.from(BANCO_PECAS.childNodes).map(peca => peca.id)}
    });  
}


function reiniciaJogo() {
    function funcaoConfirmar() {
        const tabuleiro = document.getElementById('tabuleiro');
        const corpo = document.getElementById('corpo');
        corpo.removeChild(tabuleiro);
        BANCO_PECAS.innerHTML = null;
        
        main();
        enviaPosicaoTabuleiro();        
        exibeOcultaMenu(false);
        window.localStorage.proximaJogada = false;

    }
    criaAlerta(`Deseja realmente Iniciar um novo jogo?
    Será perdido o andamento desta partida.`, {
        tituloBotao: "Confirmar",
        alertaCor: 'alertaBranco',
        alertaTextoCor: "#ff3939",
        icone: 'fa-exclamation-circle',
        funcaoConfirmar,
    }, true);
}

function finalizaJogada() {
    clearTimeout(CONTAGEM);
    window.localStorage.proximaJogada = false;
    socket.emit("finaliza-jogada", {
        vezjogada: window.localStorage.voce,
        sala: window.localStorage.sala.toUpperCase(),        
    });   

    socket.on("atualiza-rival-bk", function(data) {
        atualizaStatusJogo(data, true);
    });
}

function ativaDesativaFinalizarJogada(status) {
    const icon = document.getElementById('finaliza-jogada-icone');
    if(status) {
        icon.classList.remove('fa-hourglass');
        icon.classList.add('fa-check');
        FINALIZA_JOGADA.setAttribute('title', 'Finalizar Jogada.');
        FINALIZA_JOGADA.classList.add("vezJogadaAtivo");
        FINALIZA_JOGADA.classList.remove("vezJogadaInativo");
    } else {        
        icon.classList.remove('fa-check');
        icon.classList.add('fa-hourglass');
        FINALIZA_JOGADA.setAttribute('title', 'Aguarde o seu Rival.');
        FINALIZA_JOGADA.classList.add("vezJogadaInativo");
        FINALIZA_JOGADA.classList.remove("vezJogadaAtivo");
    }  
    
    // FINALIZA_JOGADA.innerHTML = icon.innerHTML;
    
}

function iniciaCronometro(dados, tempo) {
    const cronometro = document.getElementById('cronometro');
    
    function alteraContagem(seg) {
        if(window.localStorage.rival == "null") {
            socket.emit('atualiza-cronometro', {
                sala: window.localStorage.sala,
                cronometro: seg
            });
            clearTimeout(CONTAGEM);
            cronometro.innerText = "30";     
            return;
        }

        if(seg < 0) {
            finalizaJogada();
            return;
        } else {            
            cronometro.innerHTML = seg;
            socket.emit('atualiza-cronometro', {
                sala: window.localStorage.sala,
                cronometro: seg
            });
            
            CONTAGEM = setTimeout(() => {
                alteraContagem(seg - 1)
            }, 1000);    
        }
    }

    // console.log(dados);
    // if(window.localStorage.voce == dados.vezjogada && window.localStorage.rival != "null") {
    //     alteraContagem(tempo);        
    // } else {
    //     clearTimeout(CONTAGEM);
    //     cronometro.innerText = "30";          
    // }
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
    if(dados == null) {
        return;
    }
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
    // console.log(data);
    if(data == null) {
        return;
    }

    if(Object.keys(data).length) {
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
        socket.emit("mensagem", {mensagem: mensagem.value, sala: window.localStorage.sala.toUpperCase()});     
        adicionaHistoricoMensagem(mensagem.value);
        document.getElementById("enviar-mensagem").disabled = true;
        document.getElementById("enviar-mensagem").style.background = "#999";
        document.getElementById("enviar-mensagem").innerText = "Aguarde...";
        setTimeout((teste) => {
            document.getElementById("enviar-mensagem").style.background = "#047294";
            document.getElementById("enviar-mensagem").disabled = false;
            document.getElementById("enviar-mensagem").innerText = "Enviar";
        }, 7000);

        mensagem.value = "";
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
            document.getElementById("enviar-mensagem").style.background = "#047294";
            document.getElementById("enviar-mensagem").disabled = false;
            // const mensagemRemover = document.getElementById(mensagem.id);
            corpo.removeChild(mensagem);
        }, 8000);
}

function adicionaHistoricoMensagem(texto, rival) {
    const chatHistorico = document.getElementById('chat-historico');
    const chatHistoricoMensagem = document.createElement('div');
    chatHistoricoMensagem.classList.add('chat-historico-mensagem');
    
    const chatNomeUsuario = document.createElement('div');  
    const chatTextoMensagem = document.createElement('div');  
    
    if(rival) {
        chatNomeUsuario.classList.add('chat-nome-usuario-rival');
        chatTextoMensagem.classList.add('chat-texto-mensagem-rival');
        chatNomeUsuario.innerText = window.localStorage.rival;
        
    } else {
        chatNomeUsuario.classList.add('chat-nome-usuario-voce');
        chatTextoMensagem.classList.add('chat-texto-mensagem-voce');
        chatNomeUsuario.innerText = "Você";
        
    }
    
    chatTextoMensagem.innerText = texto;

    chatHistoricoMensagem.appendChild(chatNomeUsuario);
    chatHistoricoMensagem.appendChild(chatTextoMensagem);

    chatHistorico.appendChild(chatHistoricoMensagem);
}

function exibeChat(event) {
    event.preventDefault();
    CHAT.style.display = "flex";
    // BANCO_PECAS.style.display = "none";
    EXIBE_CHAT.style.display = "none";
}

function fechaChat(event) {
    event.preventDefault();
    EXIBE_CHAT.style.display = "flex";
    // BANCO_PECAS.style.display = "flex";
    CHAT.style.display = "none";   
}

function atualizaStatusJogo(data, finaliza) {
    ativaJogadorVez(data);
    atualizaBancoPecas(data.bancopecas);
    atualizaTabuleiro(data.tabuleiro);
    exibirModoEspera('Aguardando seu rival conectar...');

    socket.emit('atualiza-cronometro', {
        sala: window.localStorage.sala,
        finaliza: finaliza || false,
        reload: true
    });
    socket.on('atualiza-cronometro-bk', function(tempo) {
        iniciaCronometro(data, tempo);        
    });
}

function sairSala(e) {
    e.preventDefault();
    socket.emit('sair-sala', {
        sala: window.localStorage.sala.toUpperCase(), 
        jogador: window.localStorage.voce
    });

    limparHistorico();
    window.location = 'inicio';
}

function exibirModoEspera(texto) {
    if(window.localStorage.rival == "null") {
        MODO_ESPERA.innerText = texto;
        MODO_ESPERA.style.display = 'flex';
    } else {
        MODO_ESPERA.style.display = 'none';
    }
}
const socket = io();
socket.on("connect", async function() {
    // console.log(socket);
    socket.emit("nova-sala", {sala: window.localStorage.sala.toUpperCase(), rival: window.localStorage.voce});

    const retorno = await fetch("/carregaDadosSala", {
        method: "POST",
        mode: "cors",
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({sala: window.localStorage.sala.toUpperCase()})
    });
    
    const resposta = await retorno.json();
    
    exibeInformacoesSalaNatela({
        sala: resposta.sala.toUpperCase(),
        jogadorred: resposta.jogadorred,
        jogadorblue: resposta.jogadorblue,
    });
    
    ativaJogadorVez(resposta);

    if(resposta.tabuleiro) {
        atualizaTabuleiro(resposta.tabuleiro);
        atualizaBancoPecas(resposta.bancopecas);
    }
    
    if(window.localStorage.rival) {        
        socket.emit("atualiza-rival-inicio", {sala: window.localStorage.sala.toUpperCase()});
    }

    exibirModoEspera('Aguardando seu rival conectar...');
    socket.emit('atualiza-cronometro', {
        sala: window.localStorage.sala,
        // cronometro: seg,
        reload: true
    });
    socket.on('atualiza-cronometro-bk', function(tempo) {
        iniciaCronometro(resposta, tempo);        
    });
});

socket.on("atualiza-rival-inicio-bk", function(data) {
    exibeInformacoesSalaNatela(data);
    exibirModoEspera('Aguardando seu rival conectar...');
});

socket.on('atualiza-tabuleiro-banco-pecas', function(data) {
    atualizaStatusJogo(data);
});

socket.on("inicia-jogada", function(data) {   
    socket.emit("atualiza-rival", data);    
    atualizaStatusJogo(data);    
});

socket.on("retorno-mensagem", function(data) {
    // console.log(data);
    exibeMensagem(data);
    adicionaHistoricoMensagem(data, true);
});

// socket.on("carrega-dados-sala", function(data) {
//     console.log(data);
// });
