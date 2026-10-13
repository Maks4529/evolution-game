import { useEffect, useRef } from 'react';
import Creature from '../Creature';
import Food from '../Food';
import styles from './Simulation.module.css';

function Simulation () {
  const canvasRef = useRef(null);

  const creaturesRef = useRef([]);
  const foodsRef = useRef([]);

  const addCreatures = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < 5; i++) {
      creaturesRef.current.push(
        new Creature(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        )
      );
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const init = () => {
      creaturesRef.current = Array.from({ length: 10 }, () => {
        return new Creature(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        );
      });

      foodsRef.current = Array.from({ length: 30 }, () => {
        return new Food(Math.random() * canvas.width, Math.random() * canvas.height);
      });
    };

    init();

    const render = () => {
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const newChildren = [];

      creaturesRef.current.forEach(creature => {
        creature.update(canvas.width, canvas.height, foodsRef.current);
        creature.draw(ctx);

        for (let i = foodsRef.current.length - 1; i >= 0; i--) {
          const food = foodsRef.current[i];

          const dx = creature.x - food.x;
          const dy = creature.y - food.y;

          const distance = Math.hypot(dx, dy);

          if (distance < creature.size + food.radius) {
            foodsRef.current.splice(i, 1);
            foodsRef.current.push(
              new Food(
                Math.random() * canvas.width,
                Math.random() * canvas.height
              )
            );

            creature.energy += 30;

            if (creature.energy >= creature.maxEnergy) {
              creature.energy = 50;

              const child = creature.reproduce();
              child.energy = 50;

              newChildren.push(child);
            }
          }
        }
      });

      if(newChildren.length > 0){
        creaturesRef.current.push(...newChildren);
      }

      creaturesRef.current = creaturesRef.current.filter(
        creature => creature.energy > 0
      );

      foodsRef.current.forEach(food => {
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
      <button onClick={addCreatures} className={styles.addCreaturesBtn}>
        Spawn 5 Creatures
      </button>
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
