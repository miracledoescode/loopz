import { motion } from 'framer-motion';

export function Navbar() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 inset-x-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div 
          className="flex items-center justify-between rounded-full px-6 py-3"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-5 h-5 rounded-full bg-[#FFFFFF]" />
            <span className="font-display font-bold text-lg text-[#FFFFFF] tracking-tight">Loopz</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A3A3A3]">
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-[#FFFFFF] transition-colors">How it Works</button>
            <button onClick={() => scrollTo('features')} className="hover:text-[#FFFFFF] transition-colors">Features</button>
          </div>

          {/* CTA */}
          <div>
            <button onClick={() => scrollTo('cta')} className="bg-[#FFFFFF] text-[#000000] hover:bg-[#E5E5E5] rounded-full px-5 py-2 text-sm font-bold transition-transform active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
