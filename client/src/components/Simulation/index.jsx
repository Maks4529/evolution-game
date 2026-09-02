import { useEffect, useRef } from 'react';
import styles from './Simulation.module.css';

class Creature {
  constructor (x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.size = 10;
  }

  draw (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.moveTo(this.size, 0);
    ctx.lineTo(-this.size, -this.size / 1.5);
    ctx.lineTo(-this.size, this.size / 1.5);

    ctx.fillStyle = 'lightgreen';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();

    ctx.restore();
  }
}

function Simulation () {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const testCreature = new Creature(canvas.width / 2, canvas.height / 2);

    const render = () => {
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        testCreature.angle += 0.05;
        testCreature.draw(ctx);

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