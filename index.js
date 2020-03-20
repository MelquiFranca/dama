const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const Salas = require('./Salas');

app.use(cors());
app.use(express.static(__dirname + '/pages'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.post('/validaLogin', (req, res) => {
    // res.sendFile(__dirname + '/pages/entrar.html');
    const {sala, jogador, cor, entrarSala} = req.body;

    if(entrarSala) {
        const retorno = Salas.entrarSala(sala, jogador, cor);
        if(retorno.erro) {
            res.send(retorno);
        }

        res.send(retorno);

    } else {
        const existeSala = Salas.selecionar(sala);
        if(existeSala) {
            const entrou = Salas.entrarSala(sala, jogador, cor);

            if(entrou.erro) {
                res.send(entrou);
            } else {                
                res.send(entrou);
            }

        } else {
            const novaSala = Salas.criar(sala, jogador, cor);
            res.send(novaSala);            
        }
}
});

app.post('/carregaDadosSala', (req, res) => {
    const { sala } = req.body;
    const existeSala = Salas.selecionar(sala);
    res.send(existeSala);
})

io.on('connection', function(socket) {
    
    socket.on("nova-sala", function(sala) {
        // console.log(socket.id);
        socket.join(sala);        
    });

    // console.log(socket.rooms);
    socket.on("tabuleiro-banco-pecas", function(dados) {
        // console.log(dados);
        Salas.atualizarHistoricoSala({
            sala: dados.sala, 
            tabuleiro: dados.tabuleiro, 
            bancoPecas: dados.bancoPecas
        });
        socket.in(dados.sala).emit('atualiza-tabuleiro-banco-pecas', {tabuleiro: dados.tabuleiro, bancoPecas: dados.bancoPecas});
    });

    socket.on("mensagem", function(dados) {
        socket.in(dados.sala).emit('retorno-mensagem', dados.mensagem);
    });
        
});

http.listen('3333', () => {
    // console.log('Hello World');
});