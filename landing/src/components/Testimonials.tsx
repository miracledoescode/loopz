import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "Loopz is the first productivity app that doesn't feel like more work. I just rant into my phone and it tells me what to do.",
    author: "Sarah J.",
    role: "Product Manager"
  },
  {
    quote: "Decision fatigue was killing my weekends. Now I just brain dump on Friday afternoon and Monday morning is perfectly queued up.",
    author: "David Chen",
    role: "Founder"
  },
  {
    quote: "It's literally magic. The AI understands the context of my messy thoughts better than I do. Essential tool for ADHD.",
    author: "Elena R.",
    role: "Designer"
  },
  {
    quote: "I've deleted every other to-do app. Loopz forces me to do the one thing that matters instead of reorganizing lists.",
    author: "Marcus T.",
    role: "Engineer"
  },
  {
    quote: "This feels like how computing should work. I speak my intent, and the machine organizes it. Beautifully executed.",
    author: "Alex K.",
    role: "Director of Ops"
  },
  {
    quote: "The 15-second processing time is my new favorite ritual. It's the moment my brain officially offloads the stress.",
    author: "Samira W.",
    role: "Freelancer"
  }
];

export function Testimonials() {
  return (
    <section className="py-32 bg-background border-t border-border/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
            className="font-display text-4xl sm:text-5xl font-bold tracking-tighter text-foreground text-balance"
          >
            People who stopped drowning
          </motion.h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
              className="break-inside-avoid bg-card border border-border/50 rounded-3xl p-8 hover:bg-card/80 transition-colors"
            >
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-medium text-sm">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="text-foreground font-medium text-sm">{t.author}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
