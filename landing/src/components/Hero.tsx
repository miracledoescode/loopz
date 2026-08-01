import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-40 pb-20 overflow-hidden px-6 lg:px-8 w-full bg-[#000000] flex flex-col items-center text-center">
      
      {/* 21st.dev Style Grid Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none z-0" 
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-6xl sm:text-7xl lg:text-[100px] font-bold tracking-tighter leading-[0.95] text-[#FFFFFF]"
        >
          Stop drowning.<br />
          Dump your brain.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-xl sm:text-2xl text-[#A3A3A3] max-w-2xl leading-relaxed text-balance font-medium tracking-tight"
        >
          The simple productivity app for overwhelmed doers. 
          Talk to Loopz, and get your exact next move in 15 seconds.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <button onClick={() => {
            document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' });
          }} className="bg-[#FFFFFF] text-[#000000] hover:bg-[#E5E5E5] rounded-full px-10 py-4 text-lg font-bold transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            Join the Waitlist
          </button>
        </motion.div>

        {/* Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 relative flex justify-center w-full max-w-2xl"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#FFFFFF]/5 rounded-full blur-[100px] pointer-events-none z-0" />

          <div className="relative w-full aspect-[1/2.15] max-w-[400px] bg-[#000000] rounded-[64px] border-[12px] border-[#171717] shadow-2xl overflow-hidden ring-1 ring-[#262626]">
            
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-[#000000] rounded-full z-20 shadow-inner flex items-center justify-end px-4 border border-[#262626]">
              <div className="w-3 h-3 rounded-full bg-[#FFFFFF]/10 shadow-[inset_0_0_2px_rgba(255,255,255,0.1)]" />
            </div>
            
            <div 
              className="w-full h-full p-8 pt-24 flex flex-col relative z-10"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <div className="space-y-6 flex-1 flex flex-col justify-center text-left">
                <h3 className="text-3xl font-bold text-[#FFFFFF] tracking-tight leading-tight">What's on your mind?</h3>
                <p className="text-[#A3A3A3] text-base leading-relaxed">
                  Dump everything — deadlines, ideas, tasks, worries. No structure needed.
                </p>
                
                <div className="bg-[#000000] border border-[#262626] rounded-3xl p-6 mt-4 relative shadow-sm">
                  <p className="text-[#A3A3A3] text-base leading-relaxed">
                    "I need to prepare for the YC interview, finish the landing page, and also buy groceries..."
                  </p>
                  <span className="inline-block w-[2px] h-5 bg-[#FFFFFF] ml-1 animate-pulse align-middle" />
                </div>

                <div className="mt-12 flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#FFFFFF] flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)] cursor-pointer hover:scale-105 transition-transform">
                    <Mic className="w-8 h-8 text-[#000000]" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-30 mix-blend-overlay" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
