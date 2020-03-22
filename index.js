const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const Salas = require('./Salas');
const DB = require('./controllers/DatabaseController');
DB.criarTabelaSalas();

app.use(cors());
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/inicio');
});
app.get('/tabuleiro/:id', (req, res) => {
    res.sendFile(__dirname + '/public/tabuleiro.html');
    // res.send();
});
app.get('/tabuleiro', (req, res) => {
    const pagina = fs.readFileSync(path.resolve('public/tabuleiro.html'));
    res.writeHead(200, {"Content-Type": "text/html"});     
    res.write(pagina);
    // res.sendFile(__dirname + '/public/tabuleiro.html');
    res.send();
});
app.get('/inicio', (req, res) => {
    res.sendFile(__dirname + '/public/entrar.html');
});
app.post('/validaLogin', async (req, res) => {
    // res.sendFile(__dirname + '/public/entrar.html');
    const {sala, jogador, cor, entrarSala} = req.body;

    if(entrarSala) {
        const retorno = await Salas.entrarSala(sala, jogador, cor);
        // console.log("ENTROU", retorno);
        res.send(retorno);

    } else {
        const existeSala = await Salas.selecionar(sala);
        if(existeSala) {
            const entrou = await Salas.entrarSala(sala, jogador, cor);             
            // console.log("ENTROU",entrou);
            res.send(entrou);

        } else {
            const novaSala = await Salas.criar(sala, jogador, cor);
            // console.log("NOVA",novaSala);
            res.send(novaSala);            
        }
}
});

app.post('/carregaDadosSala', async (req, res) => {
    const { sala } = req.body;
    const existeSala = await Salas.selecionar(sala);
    // console.log(existeSala);
    res.send(existeSala);
})

io.on('connection', function(socket) {
    
    socket.on("nova-sala", function(dados) {
        // console.log(socket.id);
        // socket.emit("atualiza-rival", dados.rival);
        socket.join(dados.sala);        
    });
    // socket.emit("atualiza-rival", )
    // console.log(socket.rooms);
    socket.on("tabuleiro-banco-pecas", async function(dados) {
        // console.log(dados);
        const retorno = await Salas.atualizarHistoricoSala({
            sala: dados.sala, 
            tabuleiro: dados.tabuleiro, 
            bancoPecas: dados.bancoPecas
        });
        // console.log(retorno);
        socket.in(dados.sala).emit('atualiza-tabuleiro-banco-pecas', retorno);
    });
    
    socket.on("finaliza-jogada", async function(data) {
        const retorno = await Salas.atualizarVezJogada({
            vezJogada: data.vezJogada,
            sala: data.sala,
        });

        socket.in(data.sala).emit('inicia-jogada', retorno);

    });

    socket.on("atualiza-rival", function(data) {
        socket.in(data.sala).emit('atualiza-rival-bk', data);
    })
    socket.on("mensagem", function(dados) {
        socket.in(dados.sala).emit('retorno-mensagem', dados.mensagem);
    });
        
});

http.listen(process.env.PORT || '3333', () => {
    // console.log('Hello World');
});