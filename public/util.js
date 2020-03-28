
function exibeOcultaMenu(status) {
    const menu = document.getElementById("menu");
    menu.classList.toggle('animacaoExibeMenu');
}

function criaAlerta(msg, options, confirmar, funcaoAuxiliar) {
    if(funcaoAuxiliar) {
        funcaoAuxiliar();
    }
    const body = document.getElementsByTagName("body")[0];
    const alerta = document.createElement('div');
    const alertaIcone = document.createElement('div');
    const icone = document.createElement('i');
    const textoAlerta = document.createElement('div');
    const btnAlerta = document.createElement('button');
    const btnAlertaConfirmar = document.createElement('button');
    
    
    alertaIcone.classList.add('alertaIcone');
    icone.classList.add('fa');
    icone.classList.add(options.icone);
    icone.style.color = options.alertaTextoCor;
    alerta.classList.add('alerta');
    alerta.classList.add(options.alertaCor);
    textoAlerta.classList.add('texto');
    btnAlerta.classList.add("btnAlerta");
    

    if(confirmar) {
        btnAlertaConfirmar.classList.add("btnAlertaConfirmar");
        btnAlertaConfirmar.innerText = options.tituloBotao;      
        btnAlertaConfirmar.onclick = function() {
            if(options.funcaoConfirmar) {
                options.funcaoConfirmar();
            }
            const body = document.getElementsByTagName("body")[0];
            body.removeChild(alerta);
            return true;
        }
    }

    textoAlerta.innerText = msg;
    btnAlerta.innerText = "Voltar";
    

    btnAlerta.onclick = function() {
        if(options.funcaoVoltar) {
            options.funcaoVoltar();
        }
        const body = document.getElementsByTagName("body")[0];
        body.removeChild(alerta);
        return false;
    }

    
    // span.appendChild(iconeTabuleiro);
    // span.appendChild(icone);
    alertaIcone.appendChild(icone);
    alerta.appendChild(alertaIcone);
    alerta.appendChild(textoAlerta);
    if(confirmar) {
        alerta.appendChild(btnAlertaConfirmar);
    }
    alerta.appendChild(btnAlerta);
    body.appendChild(alerta);
}

function limparHistorico() {
    window.localStorage.removeItem("sala");
    window.localStorage.removeItem("voce");
    window.localStorage.removeItem("rival");
    window.localStorage.removeItem("corPeca");
    window.localStorage.removeItem("dados");
    window.localStorage.removeItem("entrou");
    window.localStorage.removeItem("proximaJogada");
}