import { Link } from "react-router-dom";

export default function ServiceCard({ service }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--marigold-deep)" }}>
            {service.category}
          </span>
          <h3 style={{ fontSize: "1.1rem", marginTop: 4 }}>{service.name}</h3>
        </div>
        <span className="mono" style={{ fontWeight: 700, fontSize: "1.05rem", whiteSpace: "nowrap" }}>
          ₹{service.price}
        </span>
      </div>
      {service.description && (
        <p style={{ color: "var(--ink-soft)", fontSize: "0.92rem", margin: 0 }}>{service.description}</p>
      )}
      {service.requiredDocuments?.length > 0 && (
        <div style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
          <strong style={{ color: "var(--ink)" }}>Documents needed: </strong>
          {service.requiredDocuments.join(", ")}
        </div>
      )}
      <Link to={`/apply/${service.slug}`} className="btn btn-primary" style={{ marginTop: 8, alignSelf: "flex-start" }}>
        Apply now
      </Link>
    </div>
  );
}
