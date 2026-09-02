import { useEffect, useRef } from 'react';
import styles from './Simulation.module.css';

class Creature {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.size = 10;
    this.speed = 2;
    this.color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  }

  draw (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
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
  };

  update(canvasWidth, canvasHeight){
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    if(this.x > canvasWidth) this.x = 0;
    if(this.x < 0) this.x = canvasWidth;
    if(this.y > canvasHeight) this.y = 0;
    if(this.y < 0) this.y = canvasHeight;
  };
}

function Simulation () {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const creaturesCount = 10;
    const creatures = Array.from({length: creaturesCount}, () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      const creature = new Creature(x, y);

      creature.angle = Math.random() * Math.PI * 2;

      return creature;
    });

    const render = () => {
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        creatures.forEach((creature) => {
          creature.angle += (Math.random() - 0.5) * 0.1;
          creature.update(canvas.width, canvas.height);
          creature.draw(ctx);
        });

        animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return(
    <div className={styles.board}>
        <h2 className={styles.mainTitle}>Evolutionary sandbox</h2>
        <canvas ref={canvasRef} width='800' height='600' className={styles.canvas} />
    </div>
  )
}

export default Simulation;