import { motion } from 'framer-motion';

const steps = [
  {
    number: "01",
    title: "Brain Dump.",
    description: "Hit record and talk about everything causing you stress. No structure, no order, just talk. We capture every detail flawlessly.",
  },
  {
    number: "02",
    title: "AI Analysis.",
    description: "Gemini AI instantly parses your unstructured audio into actionable context, linking related ideas and deadlines automatically.",
  },
  {
    number: "03",
    title: "One Next Move.",
    description: "We give you exactly ONE high-impact task to do right now. Do it, then get the next. Complete focus, zero fatigue.",
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-[#000000] px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-32">
        {steps.map((step, index) => {
          const isEven = index % 2 === 1;
          return (
            <div 
              key={step.number}
              className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}
            >
              <div className="flex-1 w-full flex justify-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-md aspect-square bg-[#0A0A0A] rounded-[48px] border border-[#171717] shadow-2xl relative overflow-hidden flex items-center justify-center"
                >
                  <span className="font-display text-8xl sm:text-[120px] font-bold text-[#FFFFFF] tracking-tighter opacity-10">
                    {step.number}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5" />
                </motion.div>
              </div>

              <div className="flex-1 w-full">
                <motion.div
                  initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-display text-2xl font-bold text-[#A3A3A3] tracking-tight mb-4 block">
                    Step {step.number}
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-bold text-[#FFFFFF] font-display tracking-tighter mb-6 leading-[1.1]">
                    {step.title}
                  </h3>
                  <p className="text-xl text-[#A3A3A3] leading-relaxed max-w-lg font-medium tracking-tight">
                    {step.description}
                  </p>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
