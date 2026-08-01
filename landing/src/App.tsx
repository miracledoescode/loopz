import { motion } from 'framer-motion';
import { Mic, Zap, Target, LayoutGrid } from 'lucide-react';
import './index.css';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

function App() {
  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-logo">
          <div style={{ width: 16, height: 16, background: 'var(--accent)', borderRadius: '4px' }}></div>
          Loopz
        </div>
        <button className="cta-button">
          Get Early Access
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}
        >
          <motion.div variants={fadeUpVariant} style={{ marginBottom: '16px' }}>
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 600, 
              color: 'var(--accent)',
              background: 'rgba(241, 78, 28, 0.1)',
              padding: '6px 12px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Productivity, simplified
            </span>
          </motion.div>
          
          <motion.h1 className="headline-hero" variants={fadeUpVariant}>
            Overwhelmed?<br />Dump your brain.
          </motion.h1>
          
          <motion.p className="subheadline" variants={fadeUpVariant}>
            The minimalist utility for people with too much to do. Just speak your chaos, and Loopz extracts exactly one prioritized next step.
          </motion.p>

          <motion.div variants={fadeUpVariant} style={{ display: 'flex', gap: '12px' }}>
            <button className="cta-button accent" style={{ padding: '12px 24px', fontSize: '15px' }}>
              Download Loopz
            </button>
            <button className="cta-button" style={{ background: '#fff', color: '#111', border: '1px solid var(--border)', padding: '12px 24px', fontSize: '15px' }}>
              View Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Cron-Style Phone Mockup */}
        <motion.div 
          className="phone-wrapper"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="cron-phone">
            <div className="cron-phone-notch"></div>
            <div className="phone-ui">
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '4px' }}>Brain Dump</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Tap the mic and speak.</p>
              </div>

              <div className="ui-card ui-transcript">
                "I need to prepare for the board meeting, <span className="ai-highlight">email Sarah about the designs</span>, and I really need to cancel that subscription..."
              </div>

              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingLeft: '4px' }}>
                Prioritized Action
              </div>
              <div className="ui-card ui-action-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Target size={14} color="var(--accent)" />
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>Email Sarah</span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Blocks the Q3 design pipeline.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', margin: 'auto auto 0' }}>
                <div className="pulse-ring delay-1"></div>
                <div className="pulse-ring delay-2"></div>
                <div className="pulse-ring delay-3"></div>
                <div className="mic-btn-cron" style={{ position: 'relative', zIndex: 10 }}>
                  <Mic size={24} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Ticker / Marquee */}
      <section className="marquee-container">
        <div className="marquee-track">
          <div className="marquee-item">"Did I email investors back?"</div>
          <div className="marquee-item">"Buy dog food on the way home"</div>
          <div className="marquee-item">"Cancel that Netflix subscription"</div>
          <div className="marquee-item">"Follow up with Sarah on Q3 budget"</div>
          <div className="marquee-item">"What was that podcast recommendation?"</div>
          <div className="marquee-item">"Did I email investors back?"</div>
          <div className="marquee-item">"Buy dog food on the way home"</div>
          <div className="marquee-item">"Cancel that Netflix subscription"</div>
          <div className="marquee-item">"Follow up with Sarah on Q3 budget"</div>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="features-grid"
        >
          <motion.div className="cron-card" variants={fadeUpVariant}>
            <div className="cron-card-icon">
              <Mic size={20} />
            </div>
            <h3>Voice-First</h3>
            <p>Don't waste time typing. Our advanced voice AI captures your thoughts instantly, perfectly transcribing even the most chaotic rants.</p>
          </motion.div>

          <motion.div className="cron-card" variants={fadeUpVariant}>
            <div className="cron-card-icon">
              <Zap size={20} />
            </div>
            <h3>Zero Decisions</h3>
            <p>To-do lists create anxiety by forcing you to prioritize. Loopz uses Gemini AI to instantly calculate the highest leverage action for you.</p>
          </motion.div>

          <motion.div className="cron-card" style={{ gridColumn: '1 / -1', flexDirection: 'row', alignItems: 'center', gap: '48px' }} variants={fadeUpVariant}>
            <div style={{ flex: 1 }}>
              <div className="cron-card-icon">
                <LayoutGrid size={20} />
              </div>
              <h3>Radical Simplicity</h3>
              <p>No tags, no folders, no due dates, no complex settings. Built specifically for people who are too busy to manage a productivity system.</p>
            </div>
            <div style={{ flex: 1, background: '#f9f9f9', border: '1px solid var(--border)', borderRadius: '12px', padding: '32px', display: 'flex', justifyContent: 'center' }}>
               <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%', maxWidth: '250px' }}>
                 <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                   <div style={{ width: '16px', height: '16px', border: '2px solid var(--border)', borderRadius: '4px' }}></div>
                   <div style={{ height: '12px', width: '120px', background: 'var(--border)', borderRadius: '4px' }}></div>
                 </div>
                 <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                   <div style={{ width: '16px', height: '16px', background: 'var(--accent)', borderRadius: '4px' }}></div>
                   <div style={{ height: '12px', width: '80px', background: '#111', borderRadius: '4px' }}></div>
                 </div>
               </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Closing CTA Section */}
      <section style={{ padding: '120px 24px', textAlign: 'center', borderTop: '1px solid var(--border)', background: '#fff' }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          style={{ maxWidth: '600px', margin: '0 auto' }}
        >
          <motion.div variants={fadeUpVariant} style={{ width: '48px', height: '48px', background: 'var(--accent)', borderRadius: '12px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '16px', height: '16px', background: '#fff', borderRadius: '4px' }}></div>
          </motion.div>
          <motion.h2 variants={fadeUpVariant} style={{ fontSize: '48px', marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-0.04em' }}>
            Stop organizing.<br />Start doing.
          </motion.h2>
          <motion.p variants={fadeUpVariant} style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '40px' }}>
            Join thousands of overwhelmed people who rely on Loopz to find their next move.
          </motion.p>
          <motion.div variants={fadeUpVariant}>
            <button className="cta-button accent" style={{ padding: '16px 32px', fontSize: '16px' }}>
              Download Loopz
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 48px', background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '16px', height: '16px', background: 'var(--accent)', borderRadius: '4px' }}></div>
            <span style={{ fontWeight: 700, fontSize: '18px' }}>Loopz</span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>© 2026 Loopz Inc.<br/>Dump your brain, not your time.</p>
        </div>
        <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <strong style={{ fontSize: '14px', color: '#111' }}>Product</strong>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Download app</a>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Pricing</a>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Changelog</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <strong style={{ fontSize: '14px', color: '#111' }}>Legal</strong>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Terms of Service</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <strong style={{ fontSize: '14px', color: '#111' }}>Connect</strong>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Twitter / X</a>
            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '14px', textDecoration: 'none' }}>Contact support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
