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

    alerta.appendChild(textoAlerta);
    alerta.appendChild(btnAlerta);
    body.appendChild(alerta);
}
