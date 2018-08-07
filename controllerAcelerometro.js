const five = require('johnny-five');

class ControllerAcelerometer {
  
  constructor() {
    this.board = null;
    this.status = false;
  }

  // ativar(board) {
  //   this.board = board;

  //   const accelerometer = new five.Accelerometer({
  //     controller: "MPU6050"
  //   });
  
  //   accelerometer.on("change", function() {
  //     console.log("accelerometer");
  //     console.log("  x            : ", this.x);
  //     console.log("  y            : ", this.y);
  //     console.log("  z            : ", this.z);
  //     console.log("  pitch        : ", this.pitch);
  //     console.log("  roll         : ", this.roll);
  //     console.log("  acceleration : ", this.acceleration);
  //     console.log("  inclination  : ", this.inclination);
  //     console.log("  orientation  : ", this.orientation);
  //     console.log("--------------------------------------");
  //   });
  //   this.ativo = true;
  // }


  ativar(board) {
    this.board = board;

    const gyro = new five.Gyro({
      controller: "MPU6050",
      sensitivity: 131 // optional    
    });
  
    gyro.on("change", function() {
      console.log("gyro");
      console.log("  x            : ", this.x);
      console.log("  y            : ", this.y);
      console.log("  z            : ", this.z);
      console.log("  pitch        : ", this.pitch);
      console.log("  roll         : ", this.roll);
      console.log("  yaw          : ", this.yaw);
      console.log("  rate         : ", this.rate);
      console.log("  isCalibrated : ", this.isCalibrated);
      console.log("--------------------------------------");
    });
    this.ativo = true;
  }
}


module.exports = ControllerAcelerometer;