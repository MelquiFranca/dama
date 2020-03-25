function criaAlerta(msg, options) {
    const BTN_FORMULARIO = document.getElementById("enviarFormulario");
    const BTN_ENTRAR_SALA = document.getElementById("entrar-sala");
    BTN_FORMULARIO.setAttribute('disabled', true);
    BTN_ENTRAR_SALA.setAttribute('disabled', true);

    const body = document.getElementsByTagName("body")[0];
    const alerta = document.createElement('div');
    const alertaIcone = document.createElement('div');
    const icone = document.createElement('i');
    const textoAlerta = document.createElement('div');
    const btnAlerta = document.createElement('button');
    
    alertaIcone.classList.add('alertaIcone');
    icone.classList.add('fa');
    icone.classList.add(options.icone);
    icone.style.color = options.alertaTextoCor;
    alerta.classList.add('alerta');
    alerta.classList.add(options.alertaCor);
    textoAlerta.classList.add('texto');
    btnAlerta.classList.add("btnAlerta");

    // fa-chess-board
    // fa-stack fa-lg

    textoAlerta.innerText = msg;
    btnAlerta.innerText = options.tituloBotao;

    btnAlerta.onclick = function() {
        BTN_FORMULARIO.removeAttribute('disabled');
        BTN_ENTRAR_SALA.removeAttribute('disabled');
        body.removeChild(alerta);
    }

    // span.appendChild(iconeTabuleiro);
    // span.appendChild(icone);
    alertaIcone.appendChild(icone);
    alerta.appendChild(alertaIcone);
    alerta.appendChild(textoAlerta);
    alerta.appendChild(btnAlerta);
    body.appendChild(alerta);
}
