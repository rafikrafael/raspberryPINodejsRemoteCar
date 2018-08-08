const five = require('johnny-five');
const constants = require('../resources/constants');

class ControllerMotores {
  
  constructor(pinosFrente, pinosTrazeira) {
    this.pins = [pinosFrente, pinosTrazeira];
    this.motors = {};
    this.status = false;
    this.intervaloParar = null;
  }

  ativar(board) {
    this.motors = new five.Motors(this.pins);

    board.repl.inject({
      motors: this.motors
    })
    this.ativo = true;
  }

  limparTimer() {
    if (this.intervaloParar) {
      clearTimeout(this.intervaloParar);
    }
  }

  tempoParar() {
    this.intervaloParar = setTimeout(() => {
      this.paradoTotal()
    }, constants.timersCarrinho.timeRotacaoMotor);
  }

  trataLado(lado) {
    switch (lado) {
      case 1: this.esquerda();
        break;
      case 2: this.direita();
        break;      
      default: this.reto();
        break;
    }
  }

  trataDirecao(direcao) {
    switch (direcao) {
      case 1: this.frente();
        break;
      case 2: this.reverso();
        break;      
      default: this.parado();
        break;
    }    
  }

  trataComandos(comando) {
    console.log(comando);

    if (!this.ativo) {
      return;
    }
    
    this.trataLado(comando.lado || 0);
    this.trataDirecao(comando.direcao || 0);
    
  }

  reto() {
    this.motors[0].stop();
  }

  esquerda() {
    this.motors[0].forward(255);
  }

  direita() {
    this.motors[0].reverse(255);
  }

  frente() {
    this.motors[1].forward(255);
  }

  reverso() {
    this.motors[1].reverse(255);
  }

  parado() {
    this.motors[1].stop();
  }

  paradoTotal() {
    this.motors[0].stop();
    this.motors[1].stop();
  }

  frenteEsquerda() {
    this.limparTimer();
    this.esquerda();
    this.frente()
    this.tempoParar()
  }

  frenteDireita() {
    this.limparTimer();
    this.direita();
    this.frente()
    this.tempoParar()
  }

  frenteReto() {
    this.limparTimer();
    this.reto();
    this.frente()
    this.tempoParar()
  }
  
  reversoEsquerda() {
    this.limparTimer();
    this.esquerda();
    this.reverso()
    this.tempoParar()
  }

  reversoDireita() {
    this.limparTimer();
    this.direita();
    this.reverso()
    this.tempoParar()
  }

  reversoReto() {
    this.limparTimer();
    this.reto();
    this.reverso()
    this.tempoParar()
  }
  
}

module.exports = ControllerMotores;