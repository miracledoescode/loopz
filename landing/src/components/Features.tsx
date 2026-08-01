import { motion } from 'framer-motion';
import { Mic, Zap, CheckCircle2 } from 'lucide-react';

const features = [
  {
    title: "Speak Your Chaos",
    description: "No typing, no formatting. Just tap record and rant about everything you need to do.",
    icon: Mic,
    className: "md:col-span-2 md:row-span-1",
  },
  {
    title: "AI Analysis",
    description: "Instantly parses your unstructured audio into context.",
    icon: Zap,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "One Clear Action",
    description: "Instead of a massive to-do list, get exactly ONE prioritized next step to eliminate decision paralysis.",
    icon: CheckCircle2,
    className: "md:col-span-3 md:row-span-1",
  }
];

export function Features() {
  return (
    <section id="features" className="py-32 relative overflow-hidden bg-[#000000] px-6 lg:px-8 border-t border-[#171717]">
      <div className="max-w-5xl mx-auto relative z-10">
        
        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-6xl font-bold tracking-tighter text-[#FFFFFF] text-balance"
          >
            A brain dump that actually works.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-xl text-[#A3A3A3] max-w-2xl text-balance leading-relaxed mx-auto tracking-tight font-medium"
          >
            Designed specifically for people with too much to do and too little time to organize it.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
               <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative bg-[#0A0A0A] border border-[#171717] rounded-[40px] p-10 transition-colors hover:bg-[#121212] overflow-hidden flex flex-col justify-between ${feature.className}`}
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-[20px] bg-[#000000] border border-[#171717] flex items-center justify-center mb-8 transition-transform group-hover:scale-105 text-[#FFFFFF] shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>
                
                <div className="relative z-10 mt-auto">
                  <h3 className="text-3xl font-bold text-[#FFFFFF] mb-3 font-display tracking-tight">{feature.title}</h3>
                  <p className="text-[#A3A3A3] leading-relaxed text-lg max-w-md font-medium">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
