"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { theme } from "@/lib/theme";
import FooterGL from "./UI/FooterGL";

function AnimatedLink({ 
  href, 
  children, 
  className = "font-display text-2xl md:text-3xl lg:text-4xl", 
  external = false,
}: { 
  href: string; 
  children: React.ReactNode;
  className?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <motion.span
        className={`${className} inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full`}
        style={{ color: theme.colors.textPrimary }}
      >
        {children}
      </motion.span>
      <motion.span
        className={`${className} absolute left-0 top-0 w-full inline-block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 italic`}
        style={{ color: theme.colors.textSecondary }}
      >
        {children}
      </motion.span>
    </>
  );

  const wrapperClass = `relative overflow-hidden group flex justify-start md:justify-end`;

  if (external) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className={wrapperClass}>{content}</a>;
  }
  return <Link href={href} className={wrapperClass}>{content}</Link>;
}

function LocalTime() {
  const [time, setTime] = useState("");
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        timeZone: 'America/New_York',
        timeZoneName: 'short'
      }));
    };
    updateTime();
    const int = setInterval(updateTime, 1000);
    return () => clearInterval(int);
  }, []);

  return <span suppressHydrationWarning>{time}</span>;
}

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);

  return (
    <footer
      ref={containerRef}
      className="relative w-full overflow-hidden flex flex-col h-[100vh] max-h-[100vh]"
      style={{
        backgroundColor: "#050505",
        color: theme.colors.textPrimary,
      }}
    >
      {/* ── Top Visual Banner (Fluid + Marquee) ── */}
      <div className="relative w-full flex-1 min-h-0 overflow-hidden">
        {/* WebGL Fluid Background */}
        <FooterGL />

        {/* Top fade — blends in from the hero above */}
        <div
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none z-20"
          style={{ background: "linear-gradient(to bottom, #050505 0%, transparent 100%)" }}
        />
        {/* Marquee on top of fluid - using Difference blending for dynamic fluid fill */}
        <div className="absolute inset-0 flex flex-col justify-center overflow-hidden z-10 pointer-events-none select-none opacity-100 mix-blend-difference">
          <div className="flex whitespace-nowrap marquee-inner w-max">
            <span className="shrink-0 font-display text-[35vh] md:text-[20vw] font-black uppercase text-white tracking-tighter pr-12 leading-none">
              ADONAI RESERVE ADONAI RESERVE
            </span>
            <span className="shrink-0 font-display text-[35vh] md:text-[20vw] font-black uppercase text-white tracking-tighter pr-12 leading-none" aria-hidden>
              ADONAI RESERVE ADONAI RESERVE
            </span>
          </div>
          <style>{`
            .marquee-inner {
              animation: marquee-scroll 35s linear infinite;
            }
            @media (min-width: 768px) {
              .marquee-inner {
                animation: marquee-scroll 30s linear infinite;
              }
            }
            @keyframes marquee-scroll {
              0%   { transform: translateX(0); }
              100% { transform: translate3d(-50%, 0, 0); }
            }
          `}</style>
        </div>
      </div>

      {/* ── Content Section ── */}
      <motion.div style={{ y }} className="w-full flex flex-col pt-16 relative z-20 pointer-events-auto bg-[#050505] shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 px-6 md:px-14 pb-8 gap-16 items-center">
          
          {/* Brand Vibe / Manifesto */}
          <div className="flex flex-col">
            <h3 className="font-mono mb-6 uppercase" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255, 255, 255, 0.4)" }}>
              The Ethos
            </h3>
            <p className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight" style={{ color: theme.colors.textPrimary }}>
              Forged in faith.<br />
              Built by grace.<br />
              <span className="italic" style={{ color: "rgba(255, 255, 255, 0.5)" }}>Adonai Reserve.</span>
            </p>
          </div>

          {/* Socials & Direct Contact */}
          <div className="flex flex-col md:items-end text-left md:text-right">
            <h3 className="font-mono mb-6 uppercase" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "rgba(255, 255, 255, 0.4)" }}>Connect</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <AnimatedLink href="https://www.instagram.com/adonaireserve?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" external className="font-mono text-[11px] tracking-[0.15em]">
                  INSTAGRAM ↗
                </AnimatedLink>
              </li>
              <li>
                <AnimatedLink href="mailto:contact@adonaireserve.com" external className="font-mono text-[11px] tracking-[0.15em]">
                  CONTACT@ADONAIRESERVE.COM
                </AnimatedLink>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Copyright ── */}
        <div className="w-full flex flex-col items-center justify-center pt-6 pb-8 relative">
          <div className="w-full flex flex-col md:flex-row justify-between px-6 md:px-14 font-mono z-10" style={{ fontSize: "12px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.8)" }}>
            <span className="mb-4 md:mb-0">© {new Date().getFullYear()} ADONAI RESERVE. ALL RIGHTS RESERVED.</span>
            <span>NEW YORK — <LocalTime /></span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
