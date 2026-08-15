import { motion } from 'framer-motion';
import './index.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function App() {
  return (
    <div>
      {/* --- Nav --- */}
      <nav className="nav nav-scrolled">
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon"></div>
          Loopz
        </a>
        <div className="nav-links">
          <a href="#product" className="nav-link">Product</a>
          <a href="#how" className="nav-link">How it works</a>
          <button className="btn btn-primary" style={{ padding: '8px 16px' }}>Get the App</button>
        </div>
      </nav>

      {/* --- Hero --- */}
      <section className="hero">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* Anti-positioning statement */}
          <motion.div variants={fadeUp} className="hero-badge">
            Not a to-do list. The opposite.
          </motion.div>

          <motion.h1 className="hero-title" variants={fadeUp}>
            <span className="serif">Your brain is full.</span><br />
            <span className="serif muted">Stop managing it. Offload it.</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUp}>
            To-do lists bring anxiety, overwhelm, and decision paralysis. Loopz does the opposite — speak your chaos, get one clear next step. No lists. No decisions. No guilt.
          </motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" style={{ fontSize: '15px', padding: '12px 28px' }}>
              Download for Android
            </button>
            <a href="#product" className="btn btn-secondary" style={{ fontSize: '15px', padding: '12px 28px' }}>
              See how it works
            </a>
          </motion.div>

          <motion.div className="hero-tags" variants={fadeUp}>
            <div className="tag">
              <div className="tag-dot"></div>
              Voice-first
            </div>
            <div className="tag">AI-prioritized</div>
            <div className="tag">Zero friction</div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Media --- */}
      <div className="hero-media-container">
        <motion.div
          className="hero-media"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src="/hero-phone.jpg" alt="Loopz app — voice task capture on a smartphone" />
        </motion.div>
      </div>

      {/* --- The real quote / social proof --- */}
      <motion.section
        className="quote-belt"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
      >
        <div className="quote-belt-inner">
          <div className="quote-mark">"</div>
          <p className="quote-belt-text">
            I don't want another to-do list. It just brings more anxiety, overwhelm, and decision paralysis.
            But from what I'm hearing — you're building the <em>opposite.</em>
          </p>
          <p className="quote-belt-attr">— Ms. Uche, CMO · E-barclays MFB <span style={{ opacity: 0.3, margin: '0 8px' }}>·</span> Mr. David, Comms · E-barclays MFB <em style={{ opacity: 0.5, fontSize: '11px' }}>also agrees</em></p>
        </div>
      </motion.section>

      {/* --- Statement --- */}
      <section className="statement-section">
        <motion.p
          className="statement-text serif"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          Loopz captures the operational reality of your mind.{' '}
          <span className="muted">Then it turns that chaos into one single action.</span>
        </motion.p>
      </section>

      {/* --- Features Bento --- */}
      <section className="bento-section" id="product">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title serif">How it Works</h2>
          <p className="section-subtitle">The brain dump holds the record. The AI holds the judgment.</p>
        </motion.div>

        <div className="bento-grid">
          {/* Card 1 — large */}
          <motion.div
            className="bento-card large"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </div>
            <div>
              <h3 className="card-title">Brain Dump</h3>
              <p className="card-text" style={{ maxWidth: '380px' }}>
                Hit the mic and ramble. Every thought, errand, worry — just let it out. No structure needed. Loopz ingests it all.
              </p>
            </div>
            <div className="card-demo">
              <div className="demo-waveform">
                {[4, 8, 6, 12, 9, 5, 14, 10, 7, 11, 6, 9, 13, 8, 5].map((h, i) => (
                  <div key={i} className="demo-bar" style={{ height: `${h}px` }} />
                ))}
              </div>
              <p className="demo-transcript">"I need to follow up with Marcus, finish the slide deck, book a dentist appointment, respond to those three Slack threads and figure out what to cook this week..."</p>
            </div>
          </motion.div>

          {/* Card 2 — small */}
          <motion.div
            className="bento-card small"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div>
              <h3 className="card-title">AI Prioritizes</h3>
              <p className="card-text">
                Gemini AI analyzes urgency, dependencies, and impact — then surfaces the single highest-leverage task.
              </p>
            </div>
            <div className="priority-card-demo">
              <div className="priority-item priority-item-active">
                <span className="priority-num">1</span>
                <span>Follow up with Marcus</span>
              </div>
              <div className="priority-item">
                <span className="priority-num muted">2</span>
                <span className="muted">Finish slide deck</span>
              </div>
              <div className="priority-item">
                <span className="priority-num muted">3</span>
                <span className="muted">Book dentist</span>
              </div>
            </div>
          </motion.div>

          {/* Card 3 — wide */}
          <motion.div
            className="bento-card wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <h3 className="card-title">Sprint It</h3>
              <p className="card-text">
                A focused timer breaks the task into micro-steps. You finish before your brain can resist.
              </p>
            </div>
          </motion.div>

          {/* Card 4 — wide */}
          <motion.div
            className="bento-card wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <h3 className="card-title">Continuous Memory</h3>
              <p className="card-text">
                Loopz remembers across sessions. Your context compounds. The more you use it, the sharper its judgment becomes.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Closing CTA --- */}
      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="serif cta-title">Stop managing your tasks.<br/>Start doing them.</h2>
          <p className="cta-sub">Your next move is already decided. You just need to hear it.</p>
          <button className="btn btn-primary" style={{ fontSize: '16px', padding: '14px 32px' }}>
            Download Loopz — it's free to start
          </button>
        </motion.div>
      </section>

      {/* --- Footer --- */}
      <footer className="footer">
        <div className="footer-left">
          <a href="/" className="nav-logo">
            <div className="nav-logo-icon"></div>
            Loopz
          </a>
          <p>© 2026 Loopz. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <span className="footer-col-title">Product</span>
            <a href="#">Download</a>
            <a href="#">Pricing</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Legal</span>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Connect</span>
            <a href="#">Twitter / X</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
