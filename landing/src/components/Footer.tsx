export function Footer() {
  return (
    <footer className="border-t border-[#171717] py-16 px-6 lg:px-8 bg-[#000000]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-5 h-5 rounded-full bg-[#FFFFFF]" />
          <span className="font-display font-bold text-lg text-[#FFFFFF] tracking-tight cursor-pointer">Loopz</span>
        </div>
        
        <div className="flex gap-8 text-sm font-medium text-[#A3A3A3]">
          <a href="#" className="hover:text-[#FFFFFF] transition-colors">Twitter</a>
          <a href="#" className="hover:text-[#FFFFFF] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#FFFFFF] transition-colors">Terms</a>
        </div>
        
        <div className="text-sm text-[#A3A3A3]/60 font-medium">
          © {new Date().getFullYear()} Loopz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
