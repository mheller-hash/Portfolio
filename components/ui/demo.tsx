'use client'
 
import React, { useRef, useState, useEffect } from "react";
import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useInView } from "framer-motion"
  
export function SplineSceneBasic({ onLoad }: { onLoad?: (splineApp?: any) => void } = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const lastMouseUpdate = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track if container is in view to pause rendering of WebGL when scrolled away
  const isInView = useInView(containerRef, { margin: "200px 0px 200px 0px" });

  // Scroll Parallax connection with organic spring smoothing (subtle depth for optimal paint efficiency)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yScrollRaw = useTransform(scrollYProgress, [0, 1], [0, 20]);
  // Super smooth, highly-damped spring to eliminate any shaky, wobbly scale or scroll jumps with fast rest-kill to optimize performance
  const yScrollSpring = useSpring(yScrollRaw, { stiffness: 45, damping: 25, restSpeed: 0.001, restDelta: 0.001 });

  // Mouse proximity states for pseudo-3D parallax gaze/offset
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Super soft, premium springs that glide instead of popping back violently, with rest-kill to save CPU ticks
  const springX = useSpring(mouseX, { stiffness: 40, damping: 24, restSpeed: 0.001, restDelta: 0.001 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 24, restSpeed: 0.001, restDelta: 0.001 });

  // Map normalized coordinates into subtle, elegant rotation & translation ranges (reduced to prevent shakiness)
  const rotateY = useTransform(springX, [-0.5, 0.5], [-1.5, 1.5]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [1.5, -1.5]);
  const xOffset = useTransform(springX, [-0.5, 0.5], [-2, 2]);
  const yOffset = useTransform(springY, [-0.5, 0.5], [-2, 2]);

  // Combined vertical animation offsets to prevent key duplicate issues in style maps
  const combinedY = useTransform([yScrollSpring, yOffset], ([yScrollVal, yOffsetVal]) => {
    return (yScrollVal as number) + (yOffsetVal as number);
  });

  const handleMouseEnter = () => {
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now();
    if (now - lastMouseUpdate.current < 16) return; // Limit CPU-intensive state changes to max ~60 FPS
    lastMouseUpdate.current = now;

    if (!containerRef.current) return;
    if (!rectRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect) return;
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized cursor position relative to card boundaries [-0.5 to 0.5]
    const x = (event.clientX - rect.left) / width - 0.5;
    const y = (event.clientY - rect.top) / height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const splineRef = useRef<any>(null);

  const handleMouseLeave = () => {
    // Reset to perfectly centered neutral orientation
    mouseX.set(0);
    mouseY.set(0);
    rectRef.current = null; // Clear cached rect so scroll / resize is correctly dynamic
  };

  const handleSplineLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    setIsReady(true);

    if (splineApp) {
      try {
        // Access underlying Three.js WebGLRenderer & cap pixel ratio
        const renderer = splineApp.renderer || splineApp._renderer;
        if (renderer && typeof renderer.setPixelRatio === 'function') {
          // Limit high-density Retina screen multiplier to 1.4 for excellent sharpness yet major GPU render times improvement
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.4));
        }
      } catch (e) {
        // Silently bypass if renderer API is different
      }
    }

    // Make the interactive waving/winking effect trigger automatically when the site has loaded!
    // We delay slightly to let the loading screen fade out cleanly, then trigger the built-in states.
    setTimeout(() => {
      if (!splineApp) return;
      try {
        // 1. Emit hover/enter events on potential interactive node names in the scene model.
        // Firing these virtual mouse events forces the Spline state machine to run its hover/click transitions.
        const interactableObjects = ["Character", "Group", "Robot", "Avatar", "scene", "Objects", "main", "Arm", "Hand", "Head"];
        interactableObjects.forEach((name) => {
          try {
            splineApp.emitEvent('mouseHover', name);
            splineApp.emitEvent('mouseEnter', name);
          } catch (e) {
            // Silently ignore if a name is not present in the scene
          }
        });

        // 2. Play transitions or set states if they are exposed as Spline variables.
        if (splineApp.getVariables) {
          const variables = splineApp.getVariables();
          variables.forEach((variable: any) => {
            const varName = variable.name.toLowerCase();
            // Automatically trigger animation states representing waving, winking, or initialization play
            if (
              varName.includes("wave") || 
              varName.includes("wink") || 
              varName.includes("winken") ||
              varName.includes("state") || 
              varName.includes("play") || 
              varName.includes("start")
            ) {
              try {
                splineApp.setVariable(variable.name, true);
              } catch (e) {}
              try {
                splineApp.setVariable(variable.name, 1);
              } catch (e) {}
            }
          });
        }
      } catch (err) {
        console.warn("Spline wave auto-trigger failed: ", err);
      }
    }, 800);

    if (onLoad) {
      onLoad(splineApp);
    }
  };

  return (
    <div 
      ref={containerRef} 
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-neutral-700 via-[#1d1e26] to-[#1d1e26] relative overflow-hidden select-none"
    >
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] lg:bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_30%,#000_40%,transparent_100%)] pointer-events-none z-0" />

      {/* Gray background glow top left */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] min-w-[400px] bg-neutral-600/30 rounded-full blur-[120px] pointer-events-none z-0" />

      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="#f97316"
        fillOpacity="0.4"
      />

      <AnimatePresence>
        {!isReady && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#1d1e26] z-50 pointer-events-none"
          >
            {/* Clean geometric animation skeleton */}
            <div className="relative flex items-center justify-center w-24 h-24 md:w-28 md:h-28">
              {/* Outer pulsing ring */}
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ rotate: { repeat: Infinity, duration: 8, ease: "linear" }, scale: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
                className="absolute inset-0 border border-dashed border-white/20 rounded-full"
              />
              {/* Inner glowing core */}
              <motion.div 
                animate={{ scale: [0.93, 1.07, 0.93] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-12 h-12 bg-white/10 border border-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.15)]"
              >
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
              </motion.div>
            </div>
            <p className="mt-4 text-[10px] md:text-xs text-neutral-400 font-mono tracking-[0.25em] uppercase text-center max-w-[200px] leading-relaxed select-none font-semibold">
              Loading Experience
            </p>
            <div className="mt-2.5 w-20 h-[1.5px] bg-neutral-800 rounded-full overflow-hidden relative">
              <motion.div 
                animate={{ x: [-100, 100] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Large Ambient Glow Sphere on the left of the hero section */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-white/15 rounded-full filter blur-[100px] md:blur-[170px] pointer-events-none z-0" />
      
      {/* Subtle Orange Glow Sphere on the top right */}
      <div className="absolute top-0 right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-orange-500/10 rounded-full filter blur-[100px] md:blur-[140px] pointer-events-none z-0" />
      
      <div className="max-w-[1920px] mx-auto px-4 md:px-12 w-full h-full flex flex-col md:flex-row items-center relative">
        
        {/* Left Content (Text) */}
        <div className="w-full md:w-[55%] z-30 pt-24 sm:pt-32 md:pt-0 md:pl-0 lg:pl-4 xl:pl-8 pointer-events-none flex flex-col justify-center h-full pb-16 sm:pb-0 relative mt-10 md:mt-20">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] font-display font-bold tracking-tighter leading-[1.1] md:leading-[1.05] text-white max-w-4xl"
          >
            <span className="block mb-2 md:mb-4">Deine neue</span>
            <span className="block mb-2 md:mb-4"><span className="text-neutral-300">Website</span> beginnt</span>
            <span className="block mt-4 md:mt-6"><span className="text-white font-medium bg-orange-500 leading-none px-2.5 md:px-4 py-0 md:py-1 xl:px-5 md:rounded-full rounded-xl inline-block shadow-[0_0_20px_rgba(249,115,22,0.3)] tracking-normal translate-y-[-8px] md:translate-y-[-16px]">hier.</span></span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 md:mt-4 lg:-mt-1 border-l-[3px] border-orange-500 pl-4 md:pl-5 pointer-events-auto shadow-[0_0_15px_rgba(249,115,22,0.1)]"
          >
            <p className="text-neutral-200 text-base md:text-lg lg:text-xl max-w-lg leading-relaxed font-medium">
              Ich entwickle moderne Websites, die Vertrauen schaffen und Unternehmen <span className="text-white font-semibold flex items-center md:inline">professionell präsentieren.</span>
            </p>
          </motion.div>
        </div>

        {/* Right Content (Spline 3D Scene) */}
        {/* On mobile devices we make this container pointer-events-none so scrolling with touch gesture is never blocked or sluggish */}
        <div className="absolute inset-0 md:relative md:w-1/2 flex items-center justify-center md:justify-end opacity-100 lg:cursor-grab lg:active:cursor-grabbing z-20 pointer-events-none lg:pointer-events-auto h-full overflow-visible">
          
          {/* Bottom Spotlight Illuminating the 3D figure */}
          <div className="absolute bottom-[-10%] md:bottom-[-20%] right-[-10%] w-[120%] md:w-[800px] h-[200px] md:h-[400px] bg-white/10 blur-[80px] md:blur-[120px] rounded-[100%] pointer-events-none z-0 mix-blend-screen" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ 
              y: combinedY,
              visibility: isInView ? "visible" : "hidden"
            }} 
            // Keep the figure entirely within parent boundaries and center it nicely to prevent clipping
            className="w-full md:w-full right-0 h-[85%] md:h-[100%] absolute md:relative [will-change:transform] flex items-center justify-center md:justify-end"
          >
            <motion.div
              style={{
                x: xOffset,
                y: yOffset,
              }}
              className="w-full h-full relative flex items-center justify-center md:justify-end [will-change:transform] [backface-visibility:hidden] [transform:translate3d(0,0,0)]"
            >
              {/* Immediate lightweight, responsive loading skeleton & hover-ready holographic sphere */}
              <div 
                className="absolute inset-0 flex items-center justify-center md:justify-end transition-all duration-1000 ease-in-out"
                style={{ 
                  opacity: isReady ? 0 : 1,
                  pointerEvents: isReady ? "none" : "auto",
                  transform: isReady ? "scale(0.9) translate3d(0, 20px, 0)" : "scale(1) translate3d(0,0,0)",
                  transitionDelay: isReady ? "100ms" : "0ms"
                }}
              >
                <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center select-none pointer-events-auto">
                  {/* Immersive radial glow underlay */}
                  <div className="absolute w-[240px] sm:w-[320px] h-[240px] sm:h-[320px] bg-gradient-to-tr from-orange-500/20 to-sky-500/10 rounded-full blur-[40px] animate-pulse pointer-events-none" />

                  {/* Simulated depth sphere with Framer Motion interactive drag - feels instant and premium */}
                  <motion.div
                    drag
                    dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }}
                    dragElastic={0.25}
                    dragTransition={{ bounceStiffness: 150, bounceDamping: 15 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-44 sm:w-56 h-44 sm:h-56 rounded-full bg-gradient-to-br from-neutral-800/80 via-neutral-900/90 to-black/95 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_2px_4px_rgba(255,255,255,0.1)] flex items-center justify-center cursor-grab active:cursor-grabbing"
                  >
                    {/* Glowing core */}
                    <div className="absolute w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-gradient-to-tr from-orange-500/30 to-sky-500/25 blur-xl animate-pulse" />
                    
                    {/* Internal rotating core rings */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                      className="absolute w-32 sm:w-44 h-32 sm:h-44 border border-white/[0.08] rounded-full"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                      className="absolute w-28 sm:w-36 h-28 sm:h-36 border border-dashed border-orange-500/25 rounded-full"
                    />

                    {/* Cosmic center particle */}
                    <div className="absolute inset-4 rounded-full border border-white/[0.03] flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border border-orange-500/40 bg-orange-500/10 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.3)] animate-pulse">
                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Elegant floating abstract satellite nodes */}
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                    className="absolute top-10 right-10 w-4 h-4 rounded-full bg-orange-500/40 border border-white/20 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                  />
                  <motion.div
                    animate={{ 
                      y: [0, 12, 0],
                      rotate: [360, 180, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="absolute bottom-12 left-8 w-3 h-3 rounded-full bg-sky-500/40 border border-white/20 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
                  />
                </div>
              </div>

              {/* Live WebGL Spline scene overlay - blends in seamlessly once fully loaded and compiled */}
              {isMobile !== null && (
                <div 
                  className="absolute -inset-8 sm:-inset-12 md:-inset-16 flex items-center justify-center transition-all duration-1000 ease-in-out"
                  style={{ 
                    opacity: isReady ? 1 : 0,
                    pointerEvents: isReady ? "auto" : "none",
                    transform: isReady ? "scale(1) translate3d(0,0,0)" : "scale(0.95) translate3d(0, 15px, 0)"
                  }}
                >
                  <SplineScene 
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full scale-[0.75] sm:scale-[0.8] md:scale-[0.9] lg:scale-[1.0] origin-center pointer-events-none md:pointer-events-auto"
                    onLoad={handleSplineLoad}
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>


      </div>
    </div>
  )
}

