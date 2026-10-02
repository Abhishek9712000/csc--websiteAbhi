export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: "auto" }}>
      <div className="container" style={{ padding: "24px", fontSize: "0.85rem", color: "var(--ink-soft)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <span>Jan Seva Kendra &mdash; Common Service Centre</span>
        <span>Visit us in person for cash payments and urgent work.</span>
      </div>
    </footer>
  );
}
