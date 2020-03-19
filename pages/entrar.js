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

    if(resposta.sala) {
        window.localStorage.jogador = resposta.jogador;
        window.localStorage.sala = resposta.sala;
        window.location = "tabuleiro";
        return true;
    } else {
        alert(resposta.erro);
        return false;
    }
}


function limparHistorico() {
    window.localStorage.removeItem("jogador");
    window.localStorage.removeItem("sala");
}