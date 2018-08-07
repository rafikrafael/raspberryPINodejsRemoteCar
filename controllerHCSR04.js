const five = require('johnny-five');

class ControllerHCSR04 {

  constructor(pin, freq) {
    this.pin = pin;
    this.freq = freq || 1000
    this.ativo = false
    this.modulo = {};
    this.cm = -1;
  }

  ativar(board) {

    this.modulo = new five.Proximity({
      controller: "HCSR04",
      pin: this.pin,
      freq: this.freq
    });

    board.repl.inject({
      proximity: this.modulo
    })

    this.modulo.on('data', data => {
      this.cm = data.cm;
      console.log(this.pin, '->', this.cm);
    })

    this.ativo = true;    
  }

  getCM() {
    return this.cm;
  }

}

module.exports = ControllerHCSR04;