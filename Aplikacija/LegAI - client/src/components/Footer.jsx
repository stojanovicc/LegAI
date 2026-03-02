export default function Footer() {
  const styles = `
    .app-footer {
      width: 100%;
      margin-top: 2rem;
      padding: 1rem 0;
      text-align: center;
      font-family: "Poppins", sans-serif;
      font-size: 0.85rem;
      color: #6b7280;
      background: #f9fafb;
      border-top: 1px solid #e5e7eb;
    }

    @media (max-width: 600px) {
      .app-footer {
        font-size: 0.8rem;
        padding: 0.8rem 0;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>

      <footer className="app-footer">
        LegAI © 2025 — All rights reserved
      </footer>
    </>
  );
}
