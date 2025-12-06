import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Configuration
    const PARTICLE_COUNT = 2500;
    const INTERACTION_RADIUS = 300;
    const MOUSE_FORCE = 2.0;
    
    const COLORS = [
        '#FFD700', // Gold
        '#FDB931', // Metallic Gold
        '#6c5ce7', // Purple
        '#ffffff', // White
    ];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      ax: number;
      ay: number;
      age: number;
      lifespan: number;
      baseColor: string;
      size: number;
      friction: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.ax = 0;
        this.ay = 0;
        this.age = 0;
        this.lifespan = Math.random() * 200 + 100;
        this.baseColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.size = Math.random() * 1.5 + 0.5;
        this.friction = 0.96; // Slipperiness
      }

      update(w: number, h: number, chaos: number, time: number, mouse: {x: number, y: number, isDown: boolean}) {
        this.age++;

        // 1. BASE CHAOS FIELD (The wind)
        const scale = 0.005;
        const angle = (Math.cos(this.x * scale) + Math.sin(this.y * scale)) * chaos;
        const noise = Math.sin(time * 0.001 + this.x * 0.002) * 0.5;
        const theta = angle + noise;
        
        // Base force from the field
        this.ax = Math.cos(theta) * 0.1;
        this.ay = Math.sin(theta) * 0.1;

        // 2. INTERACTIVE PHYSICS (The Mouse)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < INTERACTION_RADIUS) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            
            // Calculate force magnitude (stronger when closer)
            const forceMagnitude = (1 - distance / INTERACTION_RADIUS) * MOUSE_FORCE;

            if (mouse.isDown) {
                // ATTRACTION (Black Hole)
                this.ax += forceDirectionX * forceMagnitude * 2;
                this.ay += forceDirectionY * forceMagnitude * 2;
            } else {
                // REPULSION (Fluid Push)
                this.ax -= forceDirectionX * forceMagnitude;
                this.ay -= forceDirectionY * forceMagnitude;
            }
        }

        // Apply acceleration to velocity
        this.vx += this.ax;
        this.vy += this.ay;

        // Apply Friction
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Update Position
        this.x += this.vx;
        this.y += this.vy;

        // Screen Wrap
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
        
        // Reset old particles
        if (this.age > this.lifespan) {
            this.reset(w, h);
        }
      }

      reset(w: number, h: number) {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
          this.vx = 0; 
          this.vy = 0;
          this.age = 0;
          this.lifespan = Math.random() * 200 + 50;
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Dynamic Color based on speed
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        
        if (speed > 3) {
            ctx.fillStyle = '#ffffff'; // White hot
        } else if (speed > 1.5) {
            ctx.fillStyle = '#a55eea'; // Plasma Purple
        } else {
            ctx.fillStyle = this.baseColor; // Normal Gold/Base
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Event Handlers
    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseDown = () => { mouseRef.current.isDown = true; };
    const handleMouseUp = () => { mouseRef.current.isDown = false; };

    const init = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = [];
        for(let i=0; i<PARTICLE_COUNT; i++) {
            particles.push(new Particle(canvas.width, canvas.height));
        }
    };

    // Animation Loop
    let currentChaos = 2; // Stabilized Chaos

    const animate = (time: number) => {
        // Light Trails
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(5, 5, 7, 0.1)'; // Slightly faster fade for clearer physics
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'lighter';

        // Modulate chaos slowly over time
        const chaos = currentChaos + Math.sin(time * 0.0005) * 0.5;

        particles.forEach(p => {
            p.update(canvas.width, canvas.height, chaos, time, mouseRef.current);
            p.draw(ctx);
        });

        animationFrameId = requestAnimationFrame(() => animate(performance.now()));
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    
    init();
    animate(0);

    return () => {
        window.removeEventListener('resize', init);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mousedown', handleMouseDown);
        window.removeEventListener('mouseup', handleMouseUp);
        cancelAnimationFrame(animationFrameId);
    };

  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-[#050507]">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
    </div>
  );
};

export default Background;