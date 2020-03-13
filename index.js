const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// const arrayPosicoes = {
//     0: [0,1,2,3],
//     1: [1]
// }
app.use(cors());
app.use(express.static(__dirname + '/pages'));

app.get('/tabuleiro/:id', (req, res) => {
    res.sendFile(__dirname + '/pages/tabuleiro.html');
    // res.send();
});
app.get('/tabuleiro', (req, res) => {
    const pagina = fs.readFileSync(path.resolve('pages/tabuleiro.html'));
    res.writeHead(200, {"Content-Type": "text/html"});     
    res.write(pagina);
    // res.sendFile(__dirname + '/pages/tabuleiro.html');
    res.send();
});

app.get('/inicio', (req, res) => {
    res.sendFile(__dirname + '/pages/entrar.html');
});

io.on('connection', function(socket) {
    // console.log("Jogador conectado.");
    // socket.emit("teste", {usuario: "Melquisedeque"});
    socket.on("tabuleiro-banco-pecas", function(dados) {
        // console.log(dados);
        socket.broadcast.emit('atualiza-tabuleiro-banco-pecas', dados);
    });
    socket.on("mensagem", function(dados) {
        socket.broadcast.emit('retorno-mensagem', dados);
    });
    
});

http.listen('3333', () => {
    console.log('Hello World');
});