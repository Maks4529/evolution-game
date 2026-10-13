import Brain from "../../utils/Brain";

function pointToLineSegmentDistance(px, py, x1, y1, x2, y2) {
  const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if(l2 === 0) return Math.hypot(px - x1, py - y1);

  let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
  t = Math.max(0, Math.min(1, t));

  const closestX = x1 + t * (x2 - x1);
  const closestY = y1 + t * (y2 - y1);

  return Math.hypot(px - closestX, py - closestY);
}

class Creature {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.size = 10;
    this.maxSpeed = 4;
    this.baseSpeed = 2;
    this.maxEnergy = 100;
    this.energy = this.maxEnergy;
    this.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`;
    this.sensorLength = 130;
    this.sensorAngles = [-Math.PI / 4, 0, Math.PI / 4];
    this.sensorReadings = [0, 0, 0];

    this.brain = new Brain(3, 5, 2);
  }

  draw (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Health bar
    const healthBarWidth = 20;
    const healthPercent = Math.max(0, this.energy / this.maxEnergy);
    ctx.fillStyle = 'red';
    ctx.fillRect(-healthBarWidth / 2, -this.size - 10, healthBarWidth, 3);
    ctx.fillStyle = 'green';
    ctx.fillRect(-healthBarWidth / 2, -this.size - 10, healthBarWidth * healthPercent, 3);

    ctx.rotate(this.angle);

    ctx.lineWidth = 1;
    this.sensorAngles.forEach((sensorAngle, i) => {
      ctx.beginPath();

      ctx.moveTo(this.size, 0);

      const endX = this.size + Math.cos(sensorAngle) * this.sensorLength;
      const endY = Math.sin(sensorAngle) * this.sensorLength;

      ctx.lineTo(endX, endY);

      if(this.sensorReadings[i] > 0){
        ctx.strokeStyle = 'rgba(255, 50, 50, 0.9)';
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      }
      ctx.stroke();
    });

    // Creature
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

  update (canvasWidth, canvasHeight, foods) {
    this.energy -= 0.1;

    let currentSpeed = this.baseSpeed;
    if(this.energy < 30){
        currentSpeed = Math.max(0.5, this.baseSpeed * (this.energy / 30));
    }

    this.sensorReadings = [0, 0, 0];

    this.sensorAngles.forEach((angleOffset, i) => {
      const globalAngle = this.angle + angleOffset;

      const endX = this.x + Math.cos(globalAngle) * this.sensorLength;
      const endY = this.y + Math.sin(globalAngle) * this.sensorLength;

      let minDistance = this.sensorLength;

      foods.forEach(food => {
        const distToRay = pointToLineSegmentDistance(food.x, food.y, this.x, this.y, endX, endY);

        if(distToRay < food.radius){
          const distToFood = Math.hypot(food.x - this.x, food.y - this.y);
          if(distToFood < minDistance){
            minDistance = distToFood;
          }
        }
      });

      if(minDistance < this.sensorLength){
        this.sensorReadings[i] = 1 - (minDistance / this.sensorLength);
      }
    });

    const outputs = this.brain.predict(this.sensorReadings);

    this.angle += (outputs[0] - 0.5) * 0.5;
    this.baseSpeed = (outputs[1] - 0.5) * 2 * this.maxSpeed;

    this.x += Math.cos(this.angle) * currentSpeed;
    this.y += Math.sin(this.angle) * currentSpeed;

    if (this.x > canvasWidth) this.x = 0;
    if (this.x < 0) this.x = canvasWidth;
    if (this.y > canvasHeight) this.y = 0;
    if (this.y < 0) this.y = canvasHeight;
  }

  reproduce() {
    const child = new Creature(this.x, this.y);
    child.brain = this.brain.copy();
    child.brain.mutate(0.1);
    child.color = this.color;
    return child;
  }
}

export default Creature;