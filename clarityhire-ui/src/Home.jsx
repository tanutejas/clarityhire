import { useState } from "react";

export default function Home() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.page}>

      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.logo}>ClarityHire</div>
        <div style={styles.navLinks}>
          <a style={styles.link}>Features</a>
          <a style={styles.link}>Pricing</a>
          <a style={styles.link}>Demo</a>
        </div>
      </nav>


      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.title}>
          Hire 10x Faster with
          <span style={styles.highlight}> AI Resume Screening</span>
        </h1>

        <p style={styles.subtitle}>
          Automatically analyze, score, and shortlist candidates in seconds.
        </p>

        <button style={styles.button}>Try Demo</button>
      </section>


      {/* STEPS */}
      <section style={styles.grid}>
        <Card id={1} hovered={hovered} setHovered={setHovered} number="01" title="Upload resumes" text="Bulk upload or paste instantly." />
        <Card id={2} hovered={hovered} setHovered={setHovered} number="02" title="AI analyzes" text="Skills, experience and job fit scored automatically." />
        <Card id={3} hovered={hovered} setHovered={setHovered} number="03" title="Get ranked list" text="See top candidates first and shortlist fast." />
      </section>


      {/* FEATURES */}
      <section style={styles.features}>
        <Feature>Smart Match Score</Feature>
        <Feature>Missing Skills Detection</Feature>
        <Feature>Auto Shortlisting</Feature>
        <Feature>Interview Questions AI</Feature>
        <Feature>Bulk Screening</Feature>
        <Feature>Export Reports</Feature>
      </section>


      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Stop reading resumes manually.</h2>
        <p style={styles.ctaText}>
          Let AI screen candidates while you focus on hiring the best.
        </p>
        <button style={styles.ctaButton}>Analyze Now</button>
      </section>

    </div>
  );
}


/* ================= COMPONENTS ================= */

function Card({ id, hovered, setHovered, number, title, text }) {
  const isHover = hovered === id;

  return (
    <div
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
      style={{
        ...styles.card,
        transform: isHover ? "translateY(-6px)" : "translateY(0px)"
      }}
    >
      <div style={styles.cardNumber}>{number}</div>
      <h3>{title}</h3>
      <p style={styles.cardText}>{text}</p>
    </div>
  );
}

function Feature({ children }) {
  return (
    <div style={styles.featureCard}>
      {children}
    </div>
  );
}


/* ================= STYLES ================= */

const styles = {

  /* PAGE */
  page: {
    minHeight: "100vh",
    padding: "40px 24px",
    fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
    color: "white",
    animation: "fadeIn 0.7s ease",
    background:
      "radial-gradient(circle at 20% 20%, #1b1d2b, transparent 40%), radial-gradient(circle at 80% 80%, #151625, transparent 40%), linear-gradient(180deg,#0a0b10,#0f1016)"
  },


  /* NAV */
  nav: {
    maxWidth: 1100,
    margin: "0 auto 100px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  logo: {
    fontWeight: 700,
    fontSize: 20
  },

  navLinks: {
    display: "flex",
    gap: 28
  },

  link: {
    color: "#9ca3af",
    cursor: "pointer",
    transition: "0.2s"
  },


  /* HERO */
  hero: {
    textAlign: "center",
    maxWidth: 800,
    margin: "0 auto 120px"
  },

  title: {
    fontSize: 56,
    fontWeight: 700,
    marginBottom: 16
  },

  highlight: {
    color: "#7c5cff"
  },

  subtitle: {
    color: "#9ca3af",
    marginBottom: 28
  },

  button: {
    padding: "16px 36px",
    borderRadius: 40,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    color: "white",
    background: "linear-gradient(135deg,#5b8cff,#7c5cff)",
    boxShadow: "0 20px 50px rgba(92,130,255,0.3)",
    transition: "all 0.25s ease"
  },


  /* GRID */
  grid: {
    maxWidth: 1100,
    margin: "0 auto 120px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: 26
  },

  features: {
    maxWidth: 1100,
    margin: "0 auto 120px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 22
  },


  /* CARDS */
  card: {
    padding: 28,
    borderRadius: 20,
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(25px)",
    boxShadow: "0 25px 60px rgba(0,0,0,0.45)",
    transition: "all 0.3s ease"
  },

  featureCard: {
    padding: 20,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    textAlign: "center"
  },

  cardNumber: {
    color: "#7c5cff",
    fontWeight: 700,
    marginBottom: 10
  },

  cardText: {
    color: "#9ca3af"
  },


  /* CTA */
  cta: {
    textAlign: "center",
    marginBottom: 80
  },

  ctaTitle: {
    fontSize: 34,
    marginBottom: 10
  },

  ctaText: {
    color: "#9ca3af",
    marginBottom: 22
  },

  ctaButton: {
    padding: "18px 42px",
    borderRadius: 40,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    color: "white",
    background: "linear-gradient(135deg,#5b8cff,#7c5cff)",
    boxShadow: "0 20px 60px rgba(92,130,255,0.35)"
  }

};