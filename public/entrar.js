const FORMULARIO = document.getElementById("form-login");
const BTN_ENTRAR_SALA = document.getElementById("entrar-sala");

limparHistorico();   

FORMULARIO.onsubmit = login
BTN_ENTRAR_SALA.onclick = login

async function login(event) {
    event.preventDefault();
    const sala = FORMULARIO.sala.value;
    const jogador = FORMULARIO.jogador.value;
    const cor =  FORMULARIO.corJogador.value;

    let entrarSala;
    if(event.target.classList.contains("btn")) {
        entrarSala = (event.target.id == "entrar-sala");
    } else {
        entrarSala = (event.target.parentNode.id == "entrar-sala");
    }

    const retorno = await fetch("/validaLogin", {
        method: "POST",
        mode: "cors",
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({jogador, sala, cor, entrarSala})
    });
    const resposta = await retorno.json();
    // console.log(resposta);
    if(resposta.sala) {
        window.localStorage.voce = (cor == 1) ? resposta.jogadorblue : resposta.jogadorred;
        window.localStorage.rival = (cor == 0) ? resposta.jogadorblue : resposta.jogadorred;
        window.localStorage.sala = resposta.sala;
        window.localStorage.corPeca = cor;
        // window.localStorage.entrou = resposta.entrou;
        window.location = "tabuleiro";
        return true;
    } else {
        // alert(resposta.erro, {title: "Titulo"});
        criaAlerta(resposta.erro, "Voltar");
        return false;
    }
}

function limparHistorico() {
    window.localStorage.removeItem("sala");
    window.localStorage.removeItem("voce");
    window.localStorage.removeItem("rival");
    window.localStorage.removeItem("corPeca");
    window.localStorage.removeItem("dados");
    window.localStorage.removeItem("entrou");
}