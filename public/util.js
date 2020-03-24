function criaAlerta(msg, tituloBotao) {
    const BTN_FORMULARIO = document.getElementById("enviarFormulario");
    const BTN_ENTRAR_SALA = document.getElementById("entrar-sala");
    BTN_FORMULARIO.setAttribute('disabled', true);
    BTN_ENTRAR_SALA.setAttribute('disabled', true);

    const body = document.getElementsByTagName("body")[0];
    const alerta = document.createElement('div');
    const textoAlerta = document.createElement('div');
    const btnAlerta = document.createElement('button');
    
    alerta.classList.add('alerta');
    textoAlerta.classList.add('texto');
    btnAlerta.classList.add("btnAlerta");

    textoAlerta.innerText = msg;
    btnAlerta.innerText = tituloBotao;

    btnAlerta.onclick = function() {
        BTN_FORMULARIO.removeAttribute('disabled');
        BTN_ENTRAR_SALA.removeAttribute('disabled');
        body.removeChild(alerta);
    }

    alerta.appendChild(textoAlerta);
    alerta.appendChild(btnAlerta);
    body.appendChild(alerta);
}
