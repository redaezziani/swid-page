"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface BlobInstance {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  update: () => void;
  reset: () => void;
  draw: () => void;
}

const LiquidBlobs = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const blobsRef = useRef<BlobInstance[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    class Blob implements BlobInstance {
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor(color: string, radius: number) {
        this.baseX = Math.random() * width;
        this.baseY = Math.random() * height;
        this.x = this.baseX;
        this.y = this.baseY;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = radius;
        this.color = color;
      }

      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        this.vx += dx * 0.0015;
        this.vy += dy * 0.0015;

        this.vx *= 0.92;
        this.vy *= 0.92;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -this.radius) this.x = width + this.radius;
        if (this.x > width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = height + this.radius;
        if (this.y > height + this.radius) this.y = -this.radius;
      }

      // Smooth reset using GSAP tween
      reset() {
        gsap.to(this, {
          x: this.baseX,
          y: this.baseY,
          vx: 0,
          vy: 0,
          duration: 1.5,
          ease: "power2.out",
        });
      }

      draw() {
        if (!ctx) return;
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const colors = [
      "hsla(280,80%,60%,0.5)",
      "hsla(200,80%,60%,0.5)",
      "hsla(340,80%,60%,0.5)",
      "hsla(50,80%,60%,0.5)",
    ];
    blobsRef.current = colors.map((c) => new Blob(c, 300));

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";
      ctx.filter = "blur(120px)";

      blobsRef.current.forEach((b) => {
        b.update();
        b.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Smooth reset on mouse leave
    const section = canvas.parentElement;
    const handleMouseLeave = () => {
      blobsRef.current.forEach((b) => b.reset());
    };
    if (section) section.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (section) section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      id="liquid-section"
      className="relative h-screen w-full overflow-hidden bg-white"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 grid grid-cols-1 h-full grid-rows-4 w-full">
        <span className="w-full col-span-1 px-4 py-2 row-span-1 flex flex-col  items-start  border-t border-neutral-300/45 h-full">
          <h3 className=" text-neutral-500 text-lg">Core business areas</h3>
          <p className=" text-7xl mt-10 font-light ">What we do</p>
        </span>
        <span className="w-full col-span-1 px-4 py-2 row-span-1  border-t border-neutral-300/45 h-full"></span>
        <span className="w-full col-span-1 px-4 py-2 row-span-1  border-t border-neutral-300/45 h-full"></span>
        <span className="w-full col-span-1 px-4 py-2 row-span-1  border-t border-neutral-300/45 h-full"></span>
      </div>
    </section>
  );
};

export default LiquidBlobs;
