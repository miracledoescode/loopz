import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CtaBanner() {
  return (
    <section id="cta" className="py-32 px-6 lg:px-8 relative overflow-hidden bg-[#000000]">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <h2 className="font-display text-5xl sm:text-6xl lg:text-[80px] font-bold tracking-tighter text-[#FFFFFF] mb-8 text-balance leading-[0.95]">
            Ready to get out<br />of the weeds?
          </h2>
          <p className="text-xl text-[#A3A3A3] mb-12 max-w-2xl mx-auto text-balance font-medium tracking-tight">
            Stop organizing your work and start actually doing it. Join the waitlist today.
          </p>
          <button className="group inline-flex items-center justify-center gap-2 bg-[#FFFFFF] text-[#000000] hover:bg-[#E5E5E5] rounded-full px-10 py-5 text-lg font-bold transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]">
            Join the Waitlist
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
