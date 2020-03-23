function criaAlerta(msg, tituloBotao) {
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
        body.removeChild(alerta);
    }

    alerta.appendChild(textoAlerta);
    alerta.appendChild(btnAlerta);
    
}
