"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

function MaskedLink({ name, href }: { name: string; href: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const textRef = useRef<SVGTextElement | null>(null);
  const sweepRef = useRef<SVGRectElement | null>(null);
  const maskIdRef = useRef("mask-" + Math.random().toString(36).slice(2, 9));
  const FONT_SIZE = 20;

  useEffect(() => {
    const svg = svgRef.current;
    const txt = textRef.current;
    const sweep = sweepRef.current;
    if (!svg || !txt || !sweep) return;

    requestAnimationFrame(() => {
      const bbox = (txt as SVGTextElement).getBBox();
      svg.setAttribute("viewBox", `0 0 ${bbox.width} ${bbox.height}`);
      svg.style.width = `${bbox.width}px`;
      svg.style.height = `${bbox.height - 5}px`;

      const stripeW = Math.max(8, bbox.width * 0.26);
      sweep.setAttribute("width", String(stripeW));
      sweep.setAttribute("height", String(bbox.height - 10));
      sweep.setAttribute("y", "0");
      sweep.setAttribute("x", String(-bbox.width * 0.45));
    });
  }, []);

  const handleEnter = () => {
    const txt = textRef.current;
    const sweep = sweepRef.current;
    if (!txt || !sweep) return;
    const bbox = (txt as SVGTextElement).getBBox();
    const endX = bbox.width + 10;
    gsap.killTweensOf(sweep);
    gsap.fromTo(
      sweep,
      { attr: { x: -bbox.width * 0.45 } },
      { duration: 0.7, attr: { x: endX }, ease: "power2.out" }
    );
  };

  return (
    <a
      href={href}
      onMouseEnter={handleEnter}
      onFocus={handleEnter}
      className="inline-block"
      style={{ lineHeight: 0, textDecoration: "none", cursor: "pointer" }}
    >
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible", display: "block" }}
        aria-hidden="true"
      >
        <defs>
          <mask id={maskIdRef.current} maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              ref={sweepRef}
              x="0"
              y="0"
              width="10"
              height="100%"
              fill="black"
            />
          </mask>
        </defs>
        <text
          ref={textRef}
          x="0"
          y={FONT_SIZE * 0.78}
          fontSize={FONT_SIZE}
          fill="white"
          mask={`url(#${maskIdRef.current})`}
        >
          {name}
        </text>
      </svg>
    </a>
  );
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      // Animate overlay slide down
      gsap.fromTo(
        overlayRef.current,
        { y: "-100%" },
        { y: "0%", duration: 0.6, ease: "power4.out" }
      );

      // Animate links stagger
      if (linksRef.current && linksRef.current.children.length > 0) {
        gsap.fromTo(
          Array.from(linksRef.current.children),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
        );
      }
    } else {
      // Animate overlay exit upwards
      gsap.to(overlayRef.current, {
        y: "-100%",
        duration: 0.6,
        ease: "power4.in",
      });
    }
  }, [open]);

  return (
    <header className="w-full z-50 flex items-center justify-center py-4 fixed top-0">
      <section className="flex justify-between w-full max-w-6xl items-center px-4">
        <a href="/">
          <h1 className="text-6xl text-shadow-2xs  text-white">Rio</h1>
        </a>

        <div className="flex gap-x-6 justify-center items-center">
          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-8 font-medium">
            {navLinks.map((link) => (
              <MaskedLink key={link.name} name={link.name} href={link.href} />
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Menu onClick={() => setOpen(!open)} />

          {/* Overlay Menu */}
          <div
            ref={overlayRef}
            className="fixed inset-0 bg-black/70  bg-opacity-95 flex flex-col items-center justify-center gap-10 z-50 translate-y-[-100%]"
          >
            <div ref={linksRef} className="flex flex-col gap-8 items-center">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-4xl  text-white"
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => setOpen(false)}
                className="mt-10 hover:cursor-pointer text-white text-lg"
              >
                Close ✕
              </button>
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}

const Menu = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      id="menu"
      onClick={onClick}
      className="flex w-8 flex-col justify-start items-start gap-0.5 transition-all duration-300 hover:gap-2 cursor-pointer"
    >
      <span className="w-full h-0.5 bg-white transition-all duration-300"></span>
      <span className="w-full h-0.5 bg-white transition-all duration-300"></span>
    </div>
  );
};
