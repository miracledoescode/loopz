import { motion } from 'framer-motion';
import './index.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

function App() {
  return (
    <div>
      {/* ─── Nav ─── */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-dot"></div>
          Loopz
        </div>
        <div className="nav-right">
          <a href="#how" className="nav-link">How it works</a>
          <button className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '14px' }}>
            Get the App
          </button>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="hero">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <motion.h1 className="hero-headline" variants={fadeUp}>
            Your brain is full.<br />
            <em>Loopz empties it.</em>
          </motion.h1>

          <motion.p className="hero-sub" variants={fadeUp}>
            Speak your chaos. AI extracts the one thing you should do right now. No lists, no decisions, no guilt.
          </motion.p>

          <motion.div className="hero-actions" variants={fadeUp}>
            <button className="btn btn-accent">
              Download for Android
            </button>
            <a href="#how" className="btn btn-ghost">
              See how it works
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── App Demo ─── */}
      <motion.section
        className="demo-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <img
          src="/hero-phone.jpg"
          alt="Loopz app showing a prioritized task on a smartphone"
          className="demo-image"
        />
      </motion.section>

      {/* ─── How It Works ─── */}
      <section className="how-section" id="how">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.p className="how-label" variants={fadeUp}>How it works</motion.p>
          <motion.h2 className="how-title" variants={fadeUp}>
            From overwhelm to action<br />in under 30 seconds
          </motion.h2>

          <motion.div className="how-steps" variants={fadeUp}>
            <div className="step">
              <div className="step-number">1</div>
              <h3>Brain dump</h3>
              <p>Hit the mic and ramble. Every thought, errand, worry — just let it out. No structure needed.</p>
            </div>
            <div className="step">
              <div className="step-number active">2</div>
              <h3>AI prioritizes</h3>
              <p>Gemini AI analyzes urgency, dependencies, and impact to surface the single highest-leverage task.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Sprint it</h3>
              <p>A focused timer breaks the task into micro-steps. You finish before your brain can resist.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Quote ─── */}
      <motion.section
        className="quote-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={stagger}
      >
        <motion.p className="quote-text" variants={fadeUp}>
          "I used to spend more time organizing my tasks than actually doing them. Now I just talk to my phone and start working."
        </motion.p>
        <motion.p className="quote-attr" variants={fadeUp}>
          <strong>Early beta tester</strong> · Lagos, Nigeria
        </motion.p>
      </motion.section>

      {/* ─── Closing CTA ─── */}
      <section className="cta-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          style={{ maxWidth: '560px', margin: '0 auto' }}
        >
          <motion.h2 className="cta-headline" variants={fadeUp}>
            Stop thinking.<br />Start doing.
          </motion.h2>
          <motion.p className="cta-sub" variants={fadeUp}>
            Your next task is already decided. You just need to hear it.
          </motion.p>
          <motion.div variants={fadeUp}>
            <button className="btn btn-accent" style={{ padding: '14px 32px', fontSize: '16px' }}>
              Download Loopz
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="nav-logo">
            <div className="nav-logo-dot"></div>
            Loopz
          </div>
          <p>© 2026 Loopz. All rights reserved.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <strong>Product</strong>
            <a href="#">Download</a>
            <a href="#">Pricing</a>
          </div>
          <div className="footer-col">
            <strong>Legal</strong>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
          <div className="footer-col">
            <strong>Connect</strong>
            <a href="#">Twitter / X</a>
            <a href="#">TikTok</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
