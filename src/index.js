const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const join = require('path').join;

const ControllerBoard = require('./controllers/controllerBoard');
const ControllerMotores = require('./controllers/controllerMotores');
const ControllerHCRS04 = require('./controllers/controllerHCSR04');
const ControllerAcelerometer = require('./controllers/controllerAcelerometro');
const ControllerGamePad = require('./controllers/controllerGamePad');
const constants = require('./resources/constants');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendfile(join(__dirname, 'public', 'views', 'index.html'));
});

const pinosTrazeira = { pins: { pwm: 2, dir: 22, cdir: 23 } };
const pinosFrente = { pins: { pwm: 3, dir: 24, cdir: 25 } }

const cc = new ControllerMotores(pinosFrente, pinosTrazeira);

// const hcsr04frente_01 = new ControllerHCRS04(30);
// const hcsr04frente_02 = new ControllerHCRS04(28);
// const hcsr04frente_03 = new ControllerHCRS04(26);
// const hcsr04trazeira_01 = new ControllerHCRS04(31);
// const hcsr04trazeira_02 = new ControllerHCRS04(29);
// const hcsr04trazeira_03 = new ControllerHCRS04(27);
// const controllerAcelerometro = new ControllerAcelerometer()

const modulesActivate = [
  cc,
  // controllerAcelerometro,
  // hcsr04frente_01,
  // hcsr04frente_02,
  // hcsr04frente_03,
  // hcsr04trazeira_01,
  // hcsr04trazeira_02,
  // hcsr04trazeira_03
]

const cb = new ControllerBoard(modulesActivate)
cb.ativar();

const controllerGamePad = ControllerGamePad(cc);
controllerGamePad.ativar();
controllerGamePad.on('devicesChanged', (devices) => {
  console.log(devices);
})

io.on('connection', (socket) => {

  // Trocar depois para um tipo
  // 0 -> reto 1 -> esquerda 2 -> direita
  let lado = 0;

  // Trocar depois para um tipo
  // 0 -> reto 1 -> esquerda 2 -> direita  
  let direcao = 0;

  console.log('Cliente Conectado ao Servidor socket io');
  socket.emit('robot status', {data: 'server connected' });  

  socket.emit('timersCarrinho', constants.timersCarrinho);

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

  socket.on('reto', () => {
    cc.reto();
  })

  socket.on('esquerda', () => {
    cc.esquerda();
  })

  socket.on('direita', () => {
    cc.direita();
  })

  socket.on('frente', () => {
    cc.frente();
  })

  socket.on('reverso', () => {
    cc.reverso();
  })
  
  socket.on('parado', () => {
    cc.parado();
  })

  socket.on('paradoTotal', () => {
    cc.paradoTotal();
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
  
  setInterval(() => {
    socket.emit('robot status', {data: '' });
    // console.log('Atualiando pagina!');
    
  }, 500);

});

http.listen(8080, () => {
  console.log('Server Rodando na Porta 8080');
});