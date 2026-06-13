import { SplineSceneBasic } from "@/components/ui/demo";
import { Code2, MonitorSmartphone, Palette, ArrowRight, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  shortDesc: string;
  category: string;
  year: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    id: "lumina",
    title: "Lumina Storefront",
    shortDesc: "Ein leistungsstarkes E-Commerce-Erlebnis mit dynamischen 3D-Produktvorschauen.",
    category: "E-Commerce",
    year: "2026",
    image: "https://images.unsplash.com/photo-1481481363529-f831968846c4?q=75&w=800&auto=format&fit=crop",
  },
  {
    id: "aura",
    title: "Aura Digital",
    shortDesc: "Preisgekröntes Portfolio und Markenidentitäts-Website für eine Kreativagentur.",
    category: "Web Design",
    year: "2025",
    image: "https://images.unsplash.com/photo-1522542611704-9d2eb0202073?q=75&w=800&auto=format&fit=crop",
  },
  {
    id: "orbit",
    title: "Orbit Dashboard",
    shortDesc: "Komplexes SaaS-Tool zur Datenvisualisierung mit Dark Mode und maßgeschneiderten Komponenten.",
    category: "SaaS",
    year: "2025",
    image: "https://images.unsplash.com/photo-1558655146-d49340d94010?q=75&w=800&auto=format&fit=crop",
  }
];

function FadeInSection({ children, delay = 0, className, key }: { children: ReactNode, delay?: number, className?: string, key?: string | number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#1d1e26] text-white font-sans antialiased selection:bg-[#0ea5e9] selection:text-white">
      {/* Top Header Row for Branding & CTA (Top Right) */}
      <header className="absolute top-6 md:top-8 left-0 right-0 w-full z-45 px-5 md:px-12 pointer-events-none">
        <div className="max-w-[1920px] mx-auto flex justify-between items-center w-full">
          {/* Top Left Branding */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex flex-col"
          >
            <a href="#home" className="text-orange-500 hover:text-orange-400 transition-colors font-display font-semibold tracking-tight text-base md:text-lg">
              M. Heller
            </a>
            <span className="hidden sm:block text-[9px] md:text-[10px] text-neutral-500 font-mono tracking-wider uppercase mt-0.5">
              Creative Technologist
            </span>
          </motion.div>

          {/* Top Right Call to Action */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto"
          >
            <a 
              href="#contact" 
              className="group relative inline-flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 md:py-2.5 bg-orange-500/5 hover:bg-orange-500/10 backdrop-blur-md rounded-full border border-orange-500/20 hover:border-orange-500 text-[10px] md:text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.5),_inset_0_0_10px_rgba(249,115,22,0.3)]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,1)] animate-pulse" />
              <span className="hidden sm:inline">Projekt anfragen</span>
              <span className="sm:hidden">Kontakt</span>
              <ArrowRight className="w-3 md:w-3.5 h-3 md:h-3.5 -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-orange-500" />
            </a>
          </motion.div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`fixed bottom-6 md:bottom-auto md:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[90%] sm:w-auto max-w-[400px] md:max-w-none`}>
        <div className={`flex items-center justify-between sm:justify-center gap-3 sm:gap-8 md:gap-12 lg:gap-16 text-[13px] sm:text-sm md:text-base font-medium text-white backdrop-blur-xl px-5 sm:px-8 md:px-10 lg:px-12 py-3 md:py-4 rounded-full border-[1.5px] border-orange-500 shadow-[0_10px_35px_rgba(0,0,0,0.6),_0_0_30px_rgba(249,115,22,0.6),_inset_0_0_15px_rgba(249,115,22,0.25)] transition-all ${isScrolled ? 'bg-[#0e0e11]/95' : 'bg-[#0e0e11]/80 md:bg-white/5'}`}>
          <a href="#about" className="hover:text-white/80 transition-colors">Über Mich</a>
          <a href="#work" className="hover:text-white/80 transition-colors">Projekte</a>
          <a href="#contact" className="hover:text-white/80 transition-colors">Kontakt</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="home" className="relative z-10 w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1d1e26]">
        <SplineSceneBasic onLoad={() => setIsSplineLoaded(true)} />
        {/* Extreme immersive ambient color glow at the bottom of the Hero section, blending into the orange section */}
        <div className="absolute bottom-0 left-0 right-0 h-[450px] sm:h-[600px] md:h-[750px] bg-gradient-to-t from-[#f97316]/20 via-[#ea580c]/10 via-[#7c2d12]/5 to-transparent pointer-events-none z-20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-[250px] sm:h-[350px] md:h-[450px] bg-gradient-to-t from-[#f97316]/10 via-[#ea580c]/5 to-transparent pointer-events-none z-20 blur-[80px]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 md:h-64 bg-gradient-to-t from-[#f97316]/8 to-transparent pointer-events-none z-20" />
      </main>

      {/* About / Expertise Section */}
      <section id="about" className="py-24 md:py-48 relative z-20 bg-[#1d1e26]" style={{ contentVisibility: "auto", containIntrinsicSize: "0 800px" }}>
        {/* Top Curved Divider (Dome) pointing upwards into Hero */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none z-10 overflow-visible" style={{ transform: "translateY(-99%)" }}>
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-36 sm:h-56 md:h-72 filter drop-shadow-[0_-20px_40px_rgba(249,115,22,0.35)]"
          >
            <defs>
              <linearGradient id="extremeWideDomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1d1e26" />
                <stop offset="25%" stopColor="#2c171e" />
                <stop offset="50%" stopColor="#43160e" />
                <stop offset="75%" stopColor="#854d0e" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <path d="M0,120 Q720,-10 1440,120 Z" fill="url(#extremeWideDomeGrad)" />
          </svg>
        </div>

        {/* Bottom Curved Divider (Cove) transitioning back from orange-500 to dark background #1d1e26 */}
        <div className="absolute bottom-0 left-0 right-0 h-28 md:h-44 pointer-events-none z-10 overflow-hidden">
          <svg
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="w-full h-full text-[#1d1e26] fill-current"
          >
            <path d="M0,0 Q720,130 1440,0 L1440,120 L0,120 Z" />
          </svg>
        </div>
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 relative z-20">
          <FadeInSection className="max-w-3xl mb-24 md:mb-32 text-center mx-auto space-y-6">
            <h2 className="text-orange-950 font-mono text-xs tracking-widest uppercase mb-4 opacity-90">Expertise</h2>
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-display font-medium tracking-tight leading-tight text-white">
              Kreativität trifft auf technologische Präzision.
            </h3>
            <p className="text-lg md:text-xl text-orange-50/95 mt-6 font-medium max-w-2xl mx-auto leading-relaxed">
              Ich entwerfe und entwickle herausragende digitale Erlebnisse. Von performanten Web-Applikationen bis hin zu immersiven 3D-Interfaces.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            <FadeInSection delay={0.1} className="p-8 md:p-10 rounded-3xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all duration-300 shadow-md">
              <Palette className="w-10 h-10 text-white mb-6" />
              <h4 className="text-xl font-medium mb-4 text-white">UI/UX Design</h4>
              <p className="text-orange-50/90 leading-relaxed text-sm md:text-base">
                Benutzerzentriertes Design mit klarem Fokus auf Ästhetik und nahtlose Interaktionen. Jedes Pixel hat seinen Zweck, um Emotionen und Klarheit zu vereinen.
              </p>
            </FadeInSection>
            <FadeInSection delay={0.2} className="p-8 md:p-10 rounded-3xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all duration-300 shadow-md">
              <Code2 className="w-10 h-10 text-white mb-6" />
              <h4 className="text-xl font-medium mb-4 text-white">Frontend Development</h4>
              <p className="text-orange-50/90 leading-relaxed text-sm md:text-base">
                Pixelperfekte Umsetzung moderner Schnittstellen mit React, Next.js und Framer Motion. Skalierbare Architektur und höchste Performance.
              </p>
            </FadeInSection>
            <FadeInSection delay={0.3} className="p-8 md:p-10 rounded-3xl bg-white/10 border border-white/10 hover:bg-white/15 transition-all duration-300 shadow-md">
              <MonitorSmartphone className="w-10 h-10 text-white mb-6" />
              <h4 className="text-xl font-medium mb-4 text-white">Creative Coding</h4>
              <p className="text-orange-50/90 leading-relaxed text-sm md:text-base">
                Integration von WebGL, Shadern und 3D-Elementen zur Schaffung immersiver Markenerlebnisse, die weit über das Standard-Web hinausgehen.
              </p>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Selected Work */}
      <section id="work" className="py-24 md:py-40 bg-[#1d1e26] relative z-20 overflow-hidden" style={{ contentVisibility: "auto", containIntrinsicSize: "0 1500px" }}>
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 relative z-10">
          <FadeInSection className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 md:mb-24">
            <div>
              <h2 className="text-[#0ea5e9] font-mono text-xs tracking-widest uppercase mb-4 text-center md:text-left">Portfolio</h2>
              <h3 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-center md:text-left">Ausgewählte Arbeiten</h3>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-[1600px] mx-auto">
            {PROJECTS.map((project, idx) => (
              <FadeInSection key={project.id} delay={0.1 * (idx % 2)} className={`group cursor-pointer ${idx % 2 !== 0 ? 'md:mt-32' : ''}`}>
                <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-neutral-900 border border-white/10 mb-8 group-hover:border-white/20 transition-all duration-500 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  
                  <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end">
                    <div className="space-x-3">
                      <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-xs font-mono uppercase tracking-wider border border-white/10 text-white">
                        {project.category}
                      </span>
                      <span className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-xs font-mono border border-white/10 text-neutral-300">
                        {project.year}
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-lg">
                      <ArrowRight className="w-5 h-5 -rotate-45" />
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <h4 className="text-2xl md:text-3xl font-medium tracking-tight mb-3 group-hover:text-[#0ea5e9] transition-colors">{project.title}</h4>
                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-xl">{project.shortDesc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-[#1d1e26] pt-32 pb-12 relative z-20 border-t border-white/5" style={{ contentVisibility: "auto", containIntrinsicSize: "0 600px" }}>
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
          <FadeInSection className="text-center max-w-4xl mx-auto mb-32 md:mb-48">
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-display font-medium tracking-tighter mb-8 md:mb-12 leading-none">
              Let's create <br/><span className="text-[#0ea5e9] bg-clip-text">magic</span> together.
            </h2>
            <p className="text-neutral-400 text-lg md:text-xl mb-12 max-w-xl mx-auto font-medium">
              Ob neues Projekt, technische Beratung oder einfach nur ein Kaffee – ich freue mich auf deine Nachricht.
            </p>
            <a href="mailto:m.heller@emagym.de" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1">
              <Mail className="w-5 h-5" />
              hello@mheller.design
            </a>
          </FadeInSection>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/10 text-neutral-500 text-sm font-mono">
            <p>© {new Date().getFullYear()} M. Heller. All rights reserved.</p>
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-white transition-colors font-medium">Twitter</a>
              <a href="#" className="hover:text-white transition-colors font-medium">GitHub</a>
              <a href="#" className="hover:text-white transition-colors font-medium">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}