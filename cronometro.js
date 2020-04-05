let contador = 30;

function alterar(tempo) {
    if(contador <= 0) {
        zerar();
    } else {
        contador = tempo;
    }
    return contador;
}

function getContador() {
    return contador;
}
function zerar() {
    contador = 30;
}

module.exports = {
    alterar,
    getContador,
    zerar
}



