// src/pages/Home.jsx

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FiFeather,
  FiFileText,
  FiMessageCircle,
  FiShield,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

const homeStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .home-page {
    min-height: calc(100vh - 64px);
    padding: 1.4rem 1.8rem 1.8rem;
    background:
      radial-gradient(circle at 20% 20%, rgba(191, 219, 254, 0.7), transparent 60%),
      radial-gradient(circle at 80% 80%, rgba(219, 234, 254, 0.7), transparent 60%),
      linear-gradient(135deg, #f7f9fc, #eef2f7);
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #0f172a;
    box-sizing: border-box;
  }

  .home-inner {
    max-width: 1150px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 2.1fr);
    gap: 1.6rem;
    align-items: stretch;
  }

  /* HERO LEFT */

  .home-hero {
    position: relative;
    padding: 1.2rem 1.4rem 1.3rem;
    border-radius: 1.3rem;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(209, 213, 219, 0.7);
    box-shadow:
      0 22px 52px rgba(15, 23, 42, 0.18),
      0 0 0 1px rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    overflow: hidden;
  }

  .home-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at top right, rgba(59, 130, 246, 0.16), transparent 55%),
      radial-gradient(circle at bottom left, rgba(79, 70, 229, 0.12), transparent 60%);
    opacity: 0.9;
    mix-blend-mode: soft-light;
  }

  .home-hero-inner {
    position: relative;
    z-index: 1;
  }

  .home-hero-kicker {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    gap: 0.32rem;
    padding: 0.18rem 0.7rem;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.08);
    border: 1px solid rgba(37, 99, 235, 0.22);
    margin-bottom: 0.4rem;
  }

  .home-hero-kicker svg {
    font-size: 0.9rem;
  }

  .home-title {
    font-size: 2rem;
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 0.6rem;
    letter-spacing: -0.03em;
  }

  .home-title .accent {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    -webkit-background-clip: text;
    color: transparent;
  }

  .home-subtitle {
    font-size: 0.9rem;
    color: #4b5563;
    max-width: 480px;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .home-hero-actions {
    display: flex;
    gap: 0.7rem;
    flex-wrap: wrap;
    margin-bottom: 0.8rem;
  }

  .home-btn-primary,
  .home-btn-secondary {
    padding: 0.55rem 1.25rem;
    font-size: 0.86rem;
    font-weight: 600;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    cursor: pointer;
    border: none;
    white-space: nowrap;
    transition:
      background 0.16s ease,
      box-shadow 0.16s ease,
      transform 0.08s ease;
  }

  .home-btn-primary {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: #ffffff;
    box-shadow: 0 14px 32px rgba(37, 99, 235, 0.55);
  }

  .home-btn-primary:hover {
    background: linear-gradient(135deg, #1d4ed8, #4338ca);
    box-shadow: 0 18px 40px rgba(37, 99, 235, 0.7);
    transform: translateY(-1px);
  }

  .home-btn-secondary {
    background: rgba(249, 250, 251, 0.96);
    border: 1px solid #d1d5db;
    color: #111827;
    box-shadow: 0 10px 26px rgba(148, 163, 184, 0.35);
  }

  .home-btn-secondary:hover {
    background: #f3f4f6;
    transform: translateY(-1px);
  }

  .home-hero-note {
    font-size: 0.78rem;
    color: #6b7280;
  }

  .home-hero-note span {
    font-weight: 600;
  }

  /* RIGHT GLASS PANEL */

  .home-hero-panel {
    position: relative;
    padding: 1rem 1rem 0.9rem;
    background: rgba(15, 23, 42, 0.9);
    border-radius: 1.3rem;
    border: 1px solid rgba(148, 163, 184, 0.55);
    box-shadow:
      0 22px 52px rgba(15, 23, 42, 0.7),
      0 0 0 1px rgba(15, 23, 42, 0.8);
    color: #e5e7eb;
    overflow: hidden;
  }

  .home-hero-panel::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 10% 0%, rgba(59, 130, 246, 0.35), transparent 55%),
      radial-gradient(circle at 90% 100%, rgba(56, 189, 248, 0.25), transparent 60%);
    opacity: 0.9;
    mix-blend-mode: soft-light;
    pointer-events: none;
  }

  .home-hero-panel > * {
    position: relative;
    z-index: 1;
  }

  .home-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.7rem;
    gap: 0.6rem;
  }

  .home-panel-title-main {
    display: flex;
    gap: 0.4rem;
    align-items: center;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .home-panel-title-main svg {
    color: #bfdbfe;
  }

  .home-panel-title-sub {
    font-size: 0.78rem;
    color: #9ca3af;
    margin-top: 0.16rem;
  }

  .home-panel-badge {
    padding: 0.22rem 0.7rem;
    border-radius: 999px;
    font-size: 0.74rem;
    background: rgba(22, 163, 74, 0.18);
    border: 1px solid rgba(34, 197, 94, 0.5);
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    color: #bbf7d0;
  }

  .home-panel-badge svg {
    font-size: 0.9rem;
  }

  .home-panel-steps {
    display: grid;
    gap: 0.55rem;
  }

  .home-panel-step {
    background: rgba(15, 23, 42, 0.9);
    padding: 0.5rem 0.6rem;
    border-radius: 0.8rem;
    border: 1px solid rgba(148, 163, 184, 0.7);
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;
  }

  .home-panel-step-icon {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 0%, #60a5fa, #2563eb);
    border: 1px solid rgba(191, 219, 254, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    color: #eff6ff;
    box-shadow: 0 10px 22px rgba(37, 99, 235, 0.7);
  }

  .home-panel-step-text-title {
    font-size: 0.8rem;
    font-weight: 600;
    color: #e5e7eb;
  }

  .home-panel-step-text-body {
    font-size: 0.76rem;
    color: #9ca3af;
    line-height: 1.35;
  }

  .home-panel-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.7rem;
    padding-top: 0.6rem;
    border-top: 1px dashed rgba(148, 163, 184, 0.7);
    font-size: 0.76rem;
    color: #9ca3af;
  }

  .home-panel-footer-text span {
    color: #e5e7eb;
    font-weight: 500;
  }

  .home-panel-footer-badge {
    font-size: 0.76rem;
    padding: 0.22rem 0.6rem;
    background: rgba(37, 99, 235, 0.18);
    color: #bfdbfe;
    border-radius: 999px;
    display: flex;
    gap: 0.3rem;
    align-items: center;
    border: 1px solid rgba(129, 140, 248, 0.7);
  }

  .home-panel-footer-badge svg {
    font-size: 0.9rem;
  }

  /* FEATURES */

  .home-features {
    max-width: 1150px;
    margin: 1.3rem auto 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }

  .home-feature-card {
    position: relative;
    padding: 0.95rem 1rem;
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(209, 213, 219, 0.85);
    border-radius: 1rem;
    box-shadow:
      0 16px 36px rgba(148, 163, 184, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.8);
    overflow: hidden;
  }

  .home-feature-card::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: radial-gradient(circle at top right, rgba(226, 232, 240, 0.8), transparent 60%);
    opacity: 0.7;
    mix-blend-mode: soft-light;
  }

  .home-feature-card > * {
    position: relative;
    z-index: 1;
  }

  .home-feature-icon {
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.35rem;
    font-size: 1.1rem;
  }

  .home-feature-icon.docs {
    background: rgba(37, 99, 235, 0.08);
    color: #2563eb;
  }
  .home-feature-icon.ai {
    background: rgba(236, 72, 153, 0.08);
    color: #db2777;
  }
  .home-feature-icon.admin {
    background: rgba(16, 185, 129, 0.08);
    color: #059669;
  }

  .home-feature-title {
    font-size: 0.92rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .home-feature-text {
    font-size: 0.78rem;
    color: #4b5563;
    margin-bottom: 0.45rem;
  }

  .home-feature-item {
    display: flex;
    gap: 0.28rem;
    align-items: center;
    font-size: 0.78rem;
    color: #374151;
  }

  .home-feature-item svg {
    color: #22c55e;
    width: 0.9rem;
    height: 0.9rem;
  }

  /* RESPONSIVE */

  @media (max-width: 900px) {
    .home-page {
      padding: 1.1rem 1.1rem 1.5rem;
    }

    .home-inner {
      grid-template-columns: 1fr;
    }

    .home-hero {
      order: 1;
    }

    .home-hero-panel {
      order: 2;
    }

    .home-features {
      grid-template-columns: 1fr;
      margin-top: 1.1rem;
    }
  }
`;

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePrimaryClick = () => {
    if (user) navigate("/dashboard");
    else navigate("/register");
  };

  const handleSecondaryClick = () => {
    if (user) navigate("/documents");
    else navigate("/login");
  };

  return (
    <div className="home-page">
      <style>{homeStyles}</style>

      <div className="home-inner">
        {/* LEFT HERO */}
        <section className="home-hero">
          <div className="home-hero-inner">
            <div className="home-hero-kicker">
              <FiFeather /> AI pravni asistent
            </div>

            <h1 className="home-title">
              Generiši <span className="accent">pravne dokumente</span> bez muke.
            </h1>

            <p className="home-subtitle">
              Kreiraj ugovore, punomoćja i druge pravne akte uz jednostavan čarobnjak.
              AI pomaže u izboru šablona i objašnjava klauzule.
            </p>

            <div className="home-hero-actions">
              <button className="home-btn-primary" onClick={handlePrimaryClick}>
                {user ? "Otvori kontrolnu tablu" : "Započni besplatno"}
                <FiArrowRight />
              </button>

              <button className="home-btn-secondary" onClick={handleSecondaryClick}>
                {user ? "Moji dokumenti" : "Prijava"}
              </button>
            </div>

            <div className="home-hero-note">
              <span>Bez pravnog saveta.</span> Aplikacija služi za automatizaciju
              izrade dokumenata.
            </div>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <aside className="home-hero-panel">
          <div className="home-panel-header">
            <div>
              <div className="home-panel-title-main">
                <FiShield /> Kako radi?
              </div>
              <div className="home-panel-title-sub">
                Generisanje dokumenta u 3 koraka
              </div>
            </div>
            <div className="home-panel-badge">
              <FiCheckCircle /> 3 koraka
            </div>
          </div>

          <div className="home-panel-steps">
            <div className="home-panel-step">
              <div className="home-panel-step-icon">1</div>
              <div>
                <div className="home-panel-step-text-title">Izaberi šablon</div>
                <div className="home-panel-step-text-body">
                  Pregledaj listu šablona ili zatraži AI preporuku.
                </div>
              </div>
            </div>

            <div className="home-panel-step">
              <div className="home-panel-step-icon">2</div>
              <div>
                <div className="home-panel-step-text-title">Popuni formu</div>
                <div className="home-panel-step-text-body">
                  Polja se automatski generišu iz šablona.
                </div>
              </div>
            </div>

            <div className="home-panel-step">
              <div className="home-panel-step-icon">3</div>
              <div>
                <div className="home-panel-step-text-title">
                  Preuzmi DOCX
                </div>
                <div className="home-panel-step-text-body">
                  Sistemski generisani dokumenti čuvaju se u tvojoj istoriji.
                </div>
              </div>
            </div>
          </div>

          <div className="home-panel-footer">
            <div className="home-panel-footer-text">
              AI objašnjava <span>nejasne pojmove</span>.
            </div>

            <div className="home-panel-footer-badge">
              <FiMessageCircle /> AI chat
            </div>
          </div>
        </aside>
      </div>

      {/* FEATURES BELOW */}
      <section className="home-features">
        <div className="home-feature-card">
          <div className="home-feature-icon docs">
            <FiFileText />
          </div>
          <div className="home-feature-title">Pametni šabloni</div>
          <div className="home-feature-text">
            Ugovori, punomoćja i drugi dokumenti sa automatskim poljima.
          </div>
          <div className="home-feature-item">
            <FiCheckCircle /> Placeholder polja
          </div>
          <div className="home-feature-item">
            <FiCheckCircle /> Automatska forma
          </div>
          <div className="home-feature-item">
            <FiCheckCircle /> DOCX generisanje
          </div>
        </div>

        <div className="home-feature-card">
          <div className="home-feature-icon ai">
            <FiMessageCircle />
          </div>
          <div className="home-feature-title">AI pravni asistent</div>
          <div className="home-feature-text">
            Objašnjava pojmove i predlaže odgovarajuće šablone.
          </div>
          <div className="home-feature-item">
            <FiCheckCircle /> Predlog šablona
          </div>
          <div className="home-feature-item">
            <FiCheckCircle /> Objašnjenje klauzula
          </div>
          <div className="home-feature-item">
            <FiCheckCircle /> Chat interfejs
          </div>
        </div>

        <div className="home-feature-card">
          <div className="home-feature-icon admin">
            <FiShield />
          </div>
          <div className="home-feature-title">Administratorska kontrola</div>
          <div className="home-feature-text">
            Pravnik uređuje šablone i prati korisnike.
          </div>
          <div className="home-feature-item">
            <FiCheckCircle /> Upravljanje šablonima
          </div>
          <div className="home-feature-item">
            <FiCheckCircle /> Pregled korisnika
          </div>
          <div className="home-feature-item">
            <FiCheckCircle /> Statistike sistema
          </div>
        </div>
      </section>
    </div>
  );
}
