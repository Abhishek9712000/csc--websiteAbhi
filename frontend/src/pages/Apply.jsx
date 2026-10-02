import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Apply() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    notes: "",
  });

  // files: { [docName]: File }
  const [files, setFiles] = useState({});

  useEffect(() => {
    api
      .getServices()
      .then((services) => {
        const foundService = services.find((s) => s.slug === slug);

        if (foundService) {
          setService(foundService);

          // Initialize files object with null for each required doc
          const initialFiles = {};
          (foundService.requiredDocuments || []).forEach((doc) => {
            initialFiles[doc] = null;
          });
          setFiles(initialFiles);
        } else {
          setError("Service not found");
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleFileChange(docName, file) {
    setFiles((prev) => ({
      ...prev,
      [docName]: file,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.customerName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^\d{10}$/.test(form.customerPhone)) {
      setError("Please enter a valid 10 digit phone number.");
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("serviceId", service._id);
      fd.append("customerName", form.customerName);
      fd.append("customerPhone", form.customerPhone);
      fd.append("customerEmail", form.customerEmail);
      fd.append("notes", form.notes);

      // Upload all selected files
      Object.values(files).forEach((file) => {
        if (file) {
          fd.append("documents", file);
        }
      });

      const result = await api.submitApplication(fd);

      localStorage.setItem(
        "currentApplication",
        JSON.stringify({
          applicationId: result.applicationId,
          referenceId: result.referenceId,
          customerName: form.customerName,
          service: service.name,
          amount: result.amount,
        })
      );

      navigate("/pay");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: 40 }}>
        Loading...
      </div>
    );
  }

  if (error && !service) {
    return (
      <div className="container" style={{ padding: 40, color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{ maxWidth: "700px", padding: "40px 20px" }}
    >
      <h1>{service.name}</h1>

      <p style={{ marginBottom: 20 }}>
        Service Fee: <strong>₹{service.price}</strong>
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        {/* Name */}
        <div style={{ marginBottom: 20 }}>
          <label>Full Name</label>
          <input
            type="text"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 12, marginTop: 8 }}
          />
        </div>

        {/* Phone */}
        <div style={{ marginBottom: 20 }}>
          <label>Phone Number</label>
          <input
            type="text"
            name="customerPhone"
            value={form.customerPhone}
            onChange={handleChange}
            maxLength={10}
            required
            style={{ width: "100%", padding: 12, marginTop: 8 }}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 20 }}>
          <label>Email Address (Optional)</label>
          <input
            type="email"
            name="customerEmail"
            value={form.customerEmail}
            onChange={handleChange}
            style={{ width: "100%", padding: 12, marginTop: 8 }}
          />
        </div>

        {/* Documents - DYNAMIC */}
        <div style={{ marginBottom: 20 }}>
          <h3>Upload Documents</h3>

          {(!service.requiredDocuments ||
            service.requiredDocuments.length === 0) && (
            <p style={{ color: "#666" }}>
              No documents required for this service.
            </p>
          )}

          {(service.requiredDocuments || []).map((docName) => (
            <div key={docName} style={{ marginBottom: 15 }}>
              <label>Upload {docName}</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) =>
                  handleFileChange(docName, e.target.files[0])
                }
                style={{ display: "block", marginTop: 10 }}
              />
              {files[docName] && (
                <p style={{ fontSize: 12, color: "green", marginTop: 4 }}>
                  ✓ {files[docName].name}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Notes */}
        <div style={{ marginBottom: 20 }}>
          <label>Additional Notes</label>
          <textarea
            name="notes"
            rows="4"
            value={form.notes}
            onChange={handleChange}
            style={{ width: "100%", padding: 12, marginTop: 8 }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
          style={{ width: "100%", padding: 14, fontSize: 16 }}
        >
          {submitting ? "Submitting..." : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
}