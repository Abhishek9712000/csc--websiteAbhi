const PDFDocument = require("pdfkit");

function generateReceipt(res, application) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  // Pipe PDF to response
  doc.pipe(res);

  // ===== HEADER =====
  doc
    .fillColor("#0b3d91")
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("MAYANK DIGITAL STUDIO", { align: "center" });

  doc
    .fillColor("#666")
    .fontSize(11)
    .font("Helvetica")
    .text("Common Service Centre (CSC)", { align: "center" });

  doc
    .text("Chandapur Market, Jayapur, Varanasi, UP", { align: "center" })
    .text("Phone: 8574851039 | WhatsApp: 8574851039", { align: "center" });

  doc.moveDown(0.5);

  // Line
  doc
    .strokeColor("#0b3d91")
    .lineWidth(2)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke();

  doc.moveDown(1);

  // ===== TITLE =====
  doc
    .fillColor("#0b3d91")
    .fontSize(18)
    .font("Helvetica-Bold")
    .text("PAYMENT RECEIPT", { align: "center" });

  doc.moveDown(1.5);

  // ===== PAID STAMP =====
  doc
    .fillColor("#22aa22")
    .fontSize(28)
    .font("Helvetica-Bold")
    .text("✓ PAID", { align: "right" });

  doc.moveDown(0.5);

  // ===== APPLICATION DETAILS =====
  const details = [
    ["Application Number", application.referenceId || "—"],
    ["Service", application.serviceName || "—"],
    ["Customer Name", application.customerName || "—"],
    ["Mobile Number", application.customerPhone || "—"],
    ["Email", application.customerEmail || "—"],
    ["Amount Paid", `Rs. ${application.amount || 0}`],
    ["Payment Date", new Date(application.updatedAt || Date.now()).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })],
    ["Payment ID", application.razorpayPaymentId || application.paymentUtr || "—"],
    ["Payment Status", (application.paymentStatus || "pending").toUpperCase()],
    ["Work Status", (application.status || "received").replace("_", " ").toUpperCase()],
  ];

  const startY = doc.y;
  const labelX = 50;
  const valueX = 230;
  const rowHeight = 28;

  details.forEach(([label, value], index) => {
    const y = startY + index * rowHeight;

    // Label
    doc
      .fillColor("#444")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(label + ":", labelX, y, { width: 170 });

    // Value
    doc
      .fillColor("#000")
      .font("Helvetica")
      .text(String(value), valueX, y, { width: 320 });
  });

  // ===== FOOTER =====
  doc.moveDown(4);

  doc
    .strokeColor("#ccc")
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke();

  doc.moveDown(1);

  doc
    .fillColor("#666")
    .fontSize(10)
    .font("Helvetica-Oblique")
    .text(
      "Thank you for choosing Mayank Digital Studio!",
      { align: "center" }
    )
    .text(
      "Track your application at: http://localhost:5173/track",
      { align: "center" }
    )
    .text(
      "For any queries, contact us at 8574851039",
      { align: "center" }
    );

  doc.moveDown(0.5);

  doc
    .fillColor("#999")
    .fontSize(8)
    .text(
      "This is a computer-generated receipt. No signature required.",
      { align: "center" }
    );

  // End PDF
  doc.end();
}

module.exports = { generateReceipt };