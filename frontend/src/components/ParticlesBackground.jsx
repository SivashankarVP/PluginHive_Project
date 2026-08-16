import React, { useEffect, useRef } from "react";

export const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particle config - Food-themed embers, sparks, sesame seeds
    const PARTICLE_COUNT = 120;
    const particles = [];

    const colors = [
      "rgba(255, 152, 0, ALPHA)",   // amber
      "rgba(255, 87, 34, ALPHA)",   // deep orange
      "rgba(255, 235, 59, ALPHA)",  // yellow gold
      "rgba(255, 193, 7, ALPHA)",   // warm yellow
      "rgba(255, 111, 0, ALPHA)",   // fire orange
    ];

    const randomBetween = (min, max) => Math.random() * (max - min) + min;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = randomBetween(0, canvas.width);
        this.y = randomBetween(canvas.height * 0.3, canvas.height + 100);
        this.z = randomBetween(0.1, 1.0); // Depth factor (z-axis simulation)
        this.baseRadius = randomBetween(1.5, 5.5);
        this.radius = this.baseRadius * this.z; // Bigger = closer
        this.speedY = randomBetween(0.3, 1.2) * this.z;
        this.speedX = randomBetween(-0.4, 0.4);
        this.drift = randomBetween(-0.3, 0.3);
        this.alpha = randomBetween(0.2, 0.85) * this.z;
        this.colorTemplate = colors[Math.floor(Math.random() * colors.length)];
        this.twinkleSpeed = randomBetween(0.005, 0.02);
        this.twinkleOffset = randomBetween(0, Math.PI * 2);
        this.glowRadius = this.radius * randomBetween(2.5, 5);
        this.life = 0;
        this.maxLife = randomBetween(200, 600);
        // Shape: 0=circle, 1=ellipse (sesame seed), 2=diamond, 3=star
        this.shape = Math.floor(Math.random() * 4);
      }

      get color() {
        return this.colorTemplate.replace("ALPHA", this.alpha.toFixed(2));
      }

      get glowColor() {
        return this.colorTemplate.replace("ALPHA", (this.alpha * 0.35).toFixed(2));
      }

      update() {
        this.life++;
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.life * 0.03 + this.twinkleOffset) * this.drift;
        const twinkle = Math.sin(this.life * this.twinkleSpeed + this.twinkleOffset);
        this.alpha = Math.max(0, Math.min(0.9, (0.5 + twinkle * 0.4) * this.z));

        // Fade in/out at life boundaries
        const fadeIn = Math.min(1, this.life / 60);
        const fadeOut = Math.max(0, 1 - (this.life - (this.maxLife - 80)) / 80);
        this.alpha *= Math.min(fadeIn, fadeOut);

        if (this.life >= this.maxLife || this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }
      }

      drawCircle() {
        // Glow halo
        const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.glowRadius);
        grd.addColorStop(0, this.color);
        grd.addColorStop(1, this.glowColor.replace("ALPHA", "0.0"));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core particle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.radius * 6;
        ctx.shadowColor = this.colorTemplate.replace("ALPHA", "0.9");
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      drawSeed() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.life * 0.01 + this.twinkleOffset);
        ctx.scale(1, 0.5);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radius * 1.5, this.radius, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.radius * 4;
        ctx.shadowColor = this.colorTemplate.replace("ALPHA", "0.8");
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      drawDiamond() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI / 4);
        ctx.shadowBlur = this.radius * 5;
        ctx.shadowColor = this.colorTemplate.replace("ALPHA", "0.9");
        ctx.beginPath();
        ctx.rect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      drawStar() {
        const spikes = 4;
        const outerR = this.radius * 1.8;
        const innerR = this.radius * 0.7;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.life * 0.02 + this.twinkleOffset);
        ctx.shadowBlur = outerR * 5;
        ctx.shadowColor = this.colorTemplate.replace("ALPHA", "0.9");
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const angle = (i * Math.PI) / spikes;
          const px = Math.cos(angle) * r;
          const py = Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      draw() {
        if (this.shape === 0) this.drawCircle();
        else if (this.shape === 1) this.drawSeed();
        else if (this.shape === 2) this.drawDiamond();
        else this.drawStar();
      }
    }

    // Create all particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = new Particle();
      p.life = Math.floor(Math.random() * p.maxLife); // Stagger start
      particles.push(p);
    }

    const sortByDepth = () => {
      particles.sort((a, b) => a.z - b.z);
    };
    sortByDepth();

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pa = particles[i];
          const pb = particles[j];
          const dx = pa.x - pb.x;
          const dy = pa.y - pb.y;
          const dz = Math.abs(pa.z - pb.z);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dz < 0.2) {
            const alpha = (1 - dist / 100) * 0.08 * Math.min(pa.z, pb.z);
            ctx.beginPath();
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.strokeStyle = `rgba(255, 152, 0, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frame % 60 === 0) sortByDepth();

      drawConnections();

      for (const p of particles) {
        p.update();
        p.draw();
      }

      frame++;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};
