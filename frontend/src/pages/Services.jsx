import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";
import { api } from "../api";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    api
      .getServices()
      .then((data) => {
        setServices(data);
        setError("");
      })
      .catch((err) => {
        console.error("Failed to load services:", err);
        setError(err.message || "Failed to load services");
      })
      .finally(() => setLoading(false));
  }, []);

  // Build categories from actual service data
  const categories = [
    "All",
    ...new Set(services.map((s) => s.category).filter(Boolean)),
  ];

  const filtered =
    category === "All"
      ? services
      : services.filter((s) => s.category === category);

  return (
    <div className="container" style={{ padding: "40px 24px 64px" }}>
      <h1 className="display" style={{ fontSize: "1.8rem", marginBottom: 8 }}>
        Our Services
      </h1>

      <p style={{ color: "var(--ink-soft)", marginBottom: 24 }}>
        Pick a service to apply and upload your documents.
      </p>

      {loading && <p>Loading services...</p>}

      {error && (
        <p style={{ color: "red" }}>
          Couldn't load services: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className="btn"
                style={{
                  background:
                    category === c ? "var(--ink)" : "var(--paper-raised)",
                  color: category === c ? "var(--paper)" : "var(--ink)",
                  border: "1px solid var(--line)",
                  padding: "8px 16px",
                  fontSize: "0.85rem",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p>No services available.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 18,
              }}
            >
              {filtered.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}