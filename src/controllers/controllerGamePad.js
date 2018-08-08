const gamepad = require('gamepad');
const EventEmitter = require('events').EventEmitter;

const constants = require('../resources/constants');

const TECLAS = {
  PARACIMA: 13, //4, //no mac
  DIREITA: 16, //5, // no mac
  PARABAIXO: 14, //6, no mac
  ESQUERDA: 15 //7, no mac
}

function addDevices(controllerGamePad) {
  const devicesLength = controllerGamePad.devices.length;
  controllerGamePad.devices = [];
  for (let i = 0, l = gamepad.numDevices(); i < l; i++) {
    controllerGamePad.devices.push(gamepad.deviceAtIndex(i));
  }
  if (controllerGamePad.devices.length != devicesLength) {
    controllerGamePad.emit('devicesChanged', controllerGamePad.devices)
  }
}

function sendComandoParaCarrinho(controllerGamePad, comando) {
  if (controllerGamePad.comandoCarrinhoInterval) {
    clearInterval(controllerGamePad.comandoCarrinhoInterval);
  }
  controllerGamePad.comandoCarrinhoInterval = setInterval(() => {
    if (comando){
      controllerGamePad.controllerMotores[comando]();
    }
  }, constants.timersCarrinho.tempoIntervaloReenviarComando);
}

function delegateDownEvents(controllerGamePad) {
  // console.log('-----');
  // for (const lastKey of controllerGamePad.lastKeys) {
  //   console.log(lastKey);    
  // }
  // console.log('-----');
  if (!controllerGamePad.controllerMotores.ativo) {
    return;
  }
  if (controllerGamePad.lastKeys.length > 1) {
    if (controllerGamePad.lastKeys.includes(TECLAS.PARACIMA) &&
      controllerGamePad.lastKeys.includes(TECLAS.DIREITA)) {
      sendComandoParaCarrinho(controllerGamePad, 'frenteDireita');
      } else if (controllerGamePad.lastKeys.includes(TECLAS.PARACIMA) &&
      controllerGamePad.lastKeys.includes(TECLAS.ESQUERDA)) {
      sendComandoParaCarrinho(controllerGamePad, 'frenteEsquerda');
    } else if (controllerGamePad.lastKeys.includes(TECLAS.PARABAIXO) &&
      controllerGamePad.lastKeys.includes(TECLAS.DIREITA)) {
      sendComandoParaCarrinho(controllerGamePad, 'reversoDireita');      
    } else if (controllerGamePad.lastKeys.includes(TECLAS.PARABAIXO) &&
      controllerGamePad.lastKeys.includes(TECLAS.ESQUERDA)) {
      sendComandoParaCarrinho(controllerGamePad, 'reversoEsquerda');            
    }   
  } else {
    if (controllerGamePad.lastKeys.includes(TECLAS.PARACIMA)) {
      sendComandoParaCarrinho(controllerGamePad, 'frenteReto');      
    } else if (controllerGamePad.lastKeys.includes(TECLAS.DIREITA)) {
      sendComandoParaCarrinho(controllerGamePad, 'estercerDireita');      
    } else if (controllerGamePad.lastKeys.includes(TECLAS.PARABAIXO)) {
      sendComandoParaCarrinho(controllerGamePad, 'reversoReto');      
    } else if (controllerGamePad.lastKeys.includes(TECLAS.ESQUERDA)) {
      sendComandoParaCarrinho(controllerGamePad, 'estercerEsquerda');            
    }  
  }
}

class ControllerGamePad extends EventEmitter {

  constructor(controllerMotores) {
    super();
    this.controllerMotores = controllerMotores;
    this.devices = [];
    this.lastKeys = [];
    this.comandoCarrinhoInterval = null;
    // EventEmitter.call(this);
  }
  
  ativar() {
    gamepad.init();
    // Intervalo para processar os eventos enviados pelo gamepad
    setInterval(() => {
      gamepad.processEvents();
    }, 16);

    // Verificar novos dispositivos 
    setInterval(() => {
      gamepad.detectDevices();
      addDevices(this);
    }, 1000);

    this.setEvents();
  }

  desativar() {
    gamepad.shutdown();
  }

  clearLastKeys() {
    this.lastKeys = [];
    if (this.comandoCarrinhoInterval) {
      clearInterval(this.comandoCarrinhoInterval);
    }
  }

  setEvents() {
  
    // Quando uma tecla é onkeyup no gamepad
    gamepad.on('up', (id, num) => {
      if (this.onKeyUpTimeOut) {
        clearTimeout(this.onKeyUpTimeOut);
      }
      this.onKeyUpTimeOut = setTimeout(() => {
        this.clearLastKeys();        
      }, 100);
    });

    // Quando uma tecla é onkeydown no gamepad
    // Ao pressionar 2 teclas juntas, é enviado 
    // cada tecla separada e ao soltar 1 ou duas ocorre
    // o evento up, desta forma utilizei um timeout para
    // tratar a recepção do evento da segunda tecla
    gamepad.on('down', (id, num) => {
      this.lastKeys.push(num);
      if (!this.onDownKeyTimeOut) {
        clearTimeout(this.onDownKeyTimeOut);
      }
      this.onDownKeyTimeOut = setTimeout(() => {
        delegateDownEvents(this);        
      }, 35);
    })
  }

}

let instance = null;

module.exports = function getInstance(controllerMotores) {
  if (!instance && controllerMotores) {
    instance = new ControllerGamePad(controllerMotores);
    // se eu uso ele para travar as instancias do singleton realmente,
    // ocorre um erro nos eventos, dessa forma retirei ele tratando direto na instacia local
    // outra forma de tratar é joga uma valor do instance no global e retornar sempre
    // Object.freeze(instance); 
  }
  return instance;
}