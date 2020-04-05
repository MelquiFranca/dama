const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const Salas = require('./Salas');
const DB = require('./controllers/DatabaseController');
const Cronometro = require('./cronometro');

DB.criarTabelaSalas(process.env.PORT || null);

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
        const retorno = await Salas.entrarSala(sala.toUpperCase(), jogador, cor);
        retorno.entrou = true;
        res.send(retorno);

    } else {
        const existeSala = await Salas.selecionar(sala.toUpperCase());
        if(existeSala) {
            const retorno = await Salas.entrarSala(sala.toUpperCase(), jogador, cor);             
            retorno.entrou = true;
            res.send(retorno);

        } else {
            const retorno = await Salas.criar(sala.toUpperCase(), jogador, cor, 30);
            res.send(retorno);            
        }
}
});

app.post('/carregaDadosSala', async (req, res) => {
    const { sala } = req.body;
    const existeSala = await Salas.selecionar(sala.toUpperCase());
    // console.log(existeSala);
    res.send(existeSala);
})

io.on('connection', function(socket) {
    
    socket.on("nova-sala", function(dados) {
        // console.log(socket.id);        
        socket.join(dados.sala.toUpperCase());        
    });

    socket.on("atualiza-cronometro", async function(dados) {
        const cronometroAtual = Cronometro.getContador();
        let cronometro;

        if(!dados.reload) {
            if(dados.finaliza) {
                cronometro = Cronometro.zerar();
            } else {
                cronometro = Cronometro.alterar(dados.cronometro);
            }
            // console.log(cronometro);
        } else {
 
            cronometro = Cronometro.alterar(cronometroAtual);
    
            socket.emit('atualiza-cronometro-bk', cronometro);
            // console.log(cronometro);
        }
        // const retorno = await Salas.atualizaCronometro(dados);   
    });

    socket.on("tabuleiro-banco-pecas", async function(dados) {
        // console.log(dados);
        const retorno = await Salas.atualizarHistoricoSala({
            sala: dados.sala, 
            tabuleiro: dados.tabuleiro, 
            bancopecas: dados.bancopecas,
        });
        // console.log(retorno);
        socket.in(dados.sala).emit('atualiza-tabuleiro-banco-pecas', retorno);
    });
    
    socket.on("finaliza-jogada", async function(data) {

        
        const retorno = await Salas.atualizarVezJogada({
            vezjogada: data.vezjogada,
            sala: data.sala,
        });
        
        const cronometro = Cronometro.zerar();
        // socket.emit('atualiza-cronometro-bk', cronometro);

        socket.in(data.sala).emit('inicia-jogada', retorno);

    });

    socket.on("atualiza-rival-inicio", async function(data) {
        const sala = await Salas.selecionar(data.sala);
        socket.in(data.sala).emit('atualiza-rival-inicio-bk', sala);
    });
    
    socket.on("atualiza-rival", function(data) {
        socket.in(data.sala).emit('atualiza-rival-bk', data);
    });
    socket.on("mensagem", function(dados) {
        socket.in(dados.sala).emit('retorno-mensagem', dados.mensagem);
    });
        
    socket.on("sair-sala", async function(dados) {
        const sala = await Salas.sairSala(dados);
        // console.log(sala);
        socket.in(dados.sala).emit('atualiza-rival-inicio-bk', sala);
    });
});

http.listen(process.env.PORT || '3333', () => {
    // console.log('Hello World');
});