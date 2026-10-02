import whatsapp from "../assets/images/whatsapp.png";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/918574851039"
      target="_blank"
      rel="noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      <img
        src={whatsapp}
        alt="WhatsApp"
        style={{
          width: "65px",
          height: "65px",
          borderRadius: "50%",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          cursor: "pointer",
        }}
      />
    </a>
  );
}