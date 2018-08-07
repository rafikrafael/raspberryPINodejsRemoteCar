const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

const ControleCarro = require('./controleCarro');

const pinosFrente = { pins: { pwm: 3, dir: 22, cdir: 23 } };
const pinosTrazeira = { pins: { pwm: 2, dir: 24, cdir: 25 } }

const cc = new ControleCarro(pinosFrente, pinosTrazeira);

io.on('connection', (socket) => {

  // Trocar depois para um tipo
  // 0 -> reto 1 -> esquerda 2 -> direita
  let lado = 0;

  // Trocar depois para um tipo
  // 0 -> reto 1 -> esquerda 2 -> direita  
  let direcao = 0;

  console.log('Cliente Conectado ao Servidor socket io');
  
  socket.emit('robot status', {data: 'server connected' });

  socket.on('recebeEventosTeclado', (evento) => {
    if (evento.type == 'keyup') {
      if (evento.keyCode == 39 || evento.keyCode == 37) {
        lado = 0;
      }
      else if (evento.keyCode == 38 || evento.keyCode == 40) {
        direcao = 0;
      }
    }
    else if (evento.type == 'keydown') {
      if (evento.keyCode == 39) {//Right
        lado = 2;
      }
      else if (evento.keyCode == 37) {//Left
        lado = 1;
      }
      else if (evento.keyCode == 38) {//Up
        direcao = 1;
      }
      else if (evento.keyCode == 40) {//Down
        direcao = 2;
      }
    }

    cc.trataComandos({lado, direcao});
  })

  socket.on('frenteReto', () => {
    cc.frenteReto();
  });

  socket.on('frenteEsquerda', () => {
    cc.frenteEsquerda();
  });

  socket.on('frenteDireita', () => {
    cc.frenteDireita();
  });

  socket.on('reversoReto', () => {
    cc.reversoReto();
  });

  socket.on('reversoEsquerda', () => {
    cc.reversoEsquerda();
  });

  socket.on('reversoDireita', () => {
    cc.reversoDireita();
  });
  
});

http.listen(8080, () => {
  console.log('Server Rodando na Porta 8080');
})

cc.ativar();