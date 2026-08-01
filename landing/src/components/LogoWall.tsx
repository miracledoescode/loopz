import { motion } from 'framer-motion';

const logos = [
  {
    name: "Acme Corp",
    svg: (
      <svg className="h-6 w-auto opacity-50 hover:opacity-100 transition-opacity" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 25L20 5L30 25M25 15H15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="40" y="22" fill="currentColor" fontFamily="monospace" fontSize="18" fontWeight="bold">ACME</text>
      </svg>
    )
  },
  {
    name: "Nexus",
    svg: (
      <svg className="h-6 w-auto opacity-50 hover:opacity-100 transition-opacity" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15" cy="15" r="10" stroke="currentColor" strokeWidth="3"/>
        <circle cx="15" cy="15" r="4" fill="currentColor"/>
        <text x="35" y="22" fill="currentColor" fontFamily="monospace" fontSize="18" fontWeight="bold">NEXUS</text>
      </svg>
    )
  },
  {
    name: "Vertex",
    svg: (
      <svg className="h-6 w-auto opacity-50 hover:opacity-100 transition-opacity" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 5L15 25L25 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="35" y="22" fill="currentColor" fontFamily="monospace" fontSize="18" fontWeight="bold">VERTEX</text>
      </svg>
    )
  },
  {
    name: "Pulse",
    svg: (
      <svg className="h-6 w-auto opacity-50 hover:opacity-100 transition-opacity" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 15H10L15 5L20 25L25 15H30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="40" y="22" fill="currentColor" fontFamily="monospace" fontSize="18" fontWeight="bold">PULSE</text>
      </svg>
    )
  }
];

export function LogoWall() {
  return (
    <section className="py-12 border-b border-border/50 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Used by fast-moving teams
        </p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-12 lg:gap-24 items-center text-muted-foreground"
        >
          {logos.map((logo) => (
            <div key={logo.name} className="flex justify-center items-center">
              {logo.svg}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
