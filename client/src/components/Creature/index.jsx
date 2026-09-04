class Creature {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.size = 10;
    this.baseSpeed = 2;
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;
  }

  draw (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const healthBarWidth = 20;
    const healthPercent = Math.max(0, this.energy / this.maxEnergy);

    ctx.fillStyle = 'red';
    ctx.fillRect(-healthBarWidth / 2, -this.size - 10, healthBarWidth, 3);

    ctx.fillStyle = 'green';
    ctx.fillRect(-healthBarWidth / 2, -this.size - 10, healthBarWidth * healthPercent, 3);

    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(this.size, 0);
    ctx.lineTo(-this.size, -this.size / 1.5);
    ctx.lineTo(-this.size, this.size / 1.5);

    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();

    ctx.restore();
  }

  update (canvasWidth, canvasHeight) {
    this.energy -= 0.2;

    let currentSpeed = this.baseSpeed;
    if(this.energy < 30){
        currentSpeed = Math.max(0.5, this.baseSpeed * (this.energy / 30));
    }

    this.x += Math.cos(this.angle) * currentSpeed;
    this.y += Math.sin(this.angle) * currentSpeed;

    if (this.x > canvasWidth) this.x = 0;
    if (this.x < 0) this.x = canvasWidth;
    if (this.y > canvasHeight) this.y = 0;
    if (this.y < 0) this.y = canvasHeight;
  }
}

export default Creature;