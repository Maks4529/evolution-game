import { useEffect, useRef } from 'react';
import Creature from '../Creature';
import Food from '../Food';
import styles from './Simulation.module.css';

function Simulation () {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const creaturesCount = 10;
    const creatures = Array.from({ length: creaturesCount }, () => {
      return new Creature(Math.random() * canvas.width, Math.random() * canvas.height);
    });

    const foodCount = 30;
    const foods = Array.from({length: foodCount}, () => {
      return new Food(Math.random() * canvas.width, Math.random() * canvas.height);
    });

    const render = () => {
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      creatures.forEach(creature => {
        creature.angle += (Math.random() - 0.5) * 0.1;
        creature.update(canvas.width, canvas.height);
        creature.draw(ctx);

        for(let i = foods.length - 1; i >= 0 ; i--){
          const food = foods[i];

          const dx = creature.x - food.x;
          const dy = creature.y - food.y;

          const distance = Math.hypot(dx, dy);

          if(distance < creature.size + food.radius){
            foods.splice(i, 1);
            foods.push(new Food(Math.random() * canvas.width, Math.random() * canvas.height));
          }
        }
      });

      foods.forEach(food => {
        food.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className={styles.board}>
      <h2 className={styles.mainTitle}>Evolutionary sandbox</h2>
      <canvas
        ref={canvasRef}
        width='800'
        height='600'
        className={styles.canvas}
      />
    </div>
  );
}

export default Simulation;
