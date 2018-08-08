const five = require('johnny-five');

class ControllerBoard {
  constructor(modulesActivate) {
    this.modulesActivate = modulesActivate;
    this.board = null;
    this.ativo = false;
  }

  ativar() {
    this.board = new five.Board();

    this.board.on("ready", () => {
      for (const module_ of this.modulesActivate) {
        module_.ativar(this.board);
      }
      this.ativo = true;
    });
  }

}

module.exports = ControllerBoard;