import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import owner from "../assets/images/owner.jpg";
import heroBg from "../assets/images/hero-bg.jpg";
import { api } from "../api";

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getServices()
      .then((data) => {
        setServices(data);
      })
      .catch((err) => {
        console.error("Failed to load services:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0,0,0,0.65),
              rgba(0,0,0,0.65)
            ),
            url(${heroBg})
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "50px",
            alignItems: "center",
            padding: "60px 20px",
          }}
        >
          {/* Left Side */}
          <div>
            <p
              style={{
                color: "#ff9900",
                fontWeight: "bold",
                letterSpacing: "2px",
              }}
            >
              COMMON SERVICE CENTRE (CSC)
            </p>

            <h1
              style={{
                fontSize: "55px",
                color: "white",
                marginBottom: "20px",
                lineHeight: "1.2",
              }}
            >
              MAYANK DIGITAL <br /> STUDIO
            </h1>

            <h3
              style={{
                color: "white",
                marginBottom: "20px",
              }}
            >
              All Government & Online Services Under One Roof
            </h3>

            <p
              style={{
                color: "#f0f0f0",
                lineHeight: "30px",
                fontSize: "17px",
              }}
            >
              PAN Card, Aadhaar Card, Passport, Voter ID, Ration Card,
              Ayushman Card, PF, Pension, Railway Ticket, Online Form Filling,
              Colour Print, Xerox, Lamination and many more services.
            </p>

            <div style={{ marginTop: "30px" }}>
              <Link
                to="/services"
                className="btn btn-primary"
                style={{
                  marginRight: "15px",
                }}
              >
                Browse Services
              </Link>

              <Link
                to="/track"
                className="btn btn-outline"
                style={{
                  color: "white",
                  border: "2px solid white",
                  padding: "12px 25px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Track Application
              </Link>
            </div>
          </div>

          {/* Owner Card */}
          <div
            style={{
              background: "rgba(255,255,255,0.95)",
              padding: "30px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,.25)",
              backdropFilter: "blur(10px)",
            }}
          >
            <img
              src={owner}
              alt="Owner"
              style={{
                width: "180px",
                height: "180px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "5px solid #0b3d91",
              }}
            />

            <h2 style={{ color: "#0b3d91" }}>
              Ashish Kumar Singh
            </h2>

            <p style={{ color: "gray" }}>
              Owner - Mayank Digital Studio
            </p>

            <hr />

            <p>
              📍 Chandapur Market, Jayapur,
              <br />
              Varanasi, Uttar Pradesh
            </p>

            <p>📞 8574851039</p>

            <a
              href="https://wa.me/918574851039"
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#25D366",
                color: "white",
                padding: "12px 25px",
                display: "inline-block",
                borderRadius: "8px",
                textDecoration: "none",
                marginTop: "15px",
              }}
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* All Services */}
      <section
        className="container"
        style={{
          padding: "60px 24px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "2rem",
            marginBottom: "30px",
            color: "#0b3d91",
          }}
        >
          Our Services
        </h2>

        {loading && (
          <p style={{ textAlign: "center" }}>Loading services...</p>
        )}

        {!loading && services.length === 0 && (
          <p style={{ textAlign: "center", color: "#666" }}>
            No services available right now.
          </p>
        )}

        {!loading && services.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {services.map((s) => (
              <ServiceBox
                key={s._id}
                title={s.name}
                price={`₹${s.price}`}
                slug={s.slug}
              />
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section
        className="container"
        style={{
          padding: "20px 20px 70px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#0b3d91",
          }}
        >
          How it Works
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px,1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <Box
            no="1"
            title="Choose Service"
            text="Select the service you need."
          />

          <Box
            no="2"
            title="Upload Documents"
            text="Upload required documents."
          />

          <Box
            no="3"
            title="Pay Online"
            text="Pay securely using UPI."
          />

          <Box
            no="4"
            title="Collect Work"
            text="Receive completed service."
          />
        </div>
      </section>
    </div>
  );
}

function ServiceBox({ title, price, slug }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "15px",
        textAlign: "center",
        boxShadow: "0 5px 15px rgba(0,0,0,.1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h3 style={{ minHeight: "50px" }}>{title}</h3>

      <p
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#0b3d91",
        }}
      >
        {price}
      </p>

      <Link
        to={`/apply/${slug}`}
        className="btn btn-primary"
        style={{
          marginTop: "10px",
          display: "inline-block",
        }}
      >
        Apply Now
      </Link>
    </div>
  );
}

function Box({ no, title, text }) {
  return (
    <div
      style={{
        padding: "25px",
        background: "#fff",
        borderRadius: "15px",
        boxShadow: "0 5px 15px rgba(0,0,0,.1)",
        textAlign: "center",
      }}
    >
      <h1 style={{ color: "#ff6600" }}>{no}</h1>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}