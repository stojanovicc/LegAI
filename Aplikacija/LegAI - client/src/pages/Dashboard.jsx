// src/pages/Dashboard.jsx

import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import client from "../api/client";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiPhone,
  FiFileText,
  FiClock,
  FiArrowRightCircle,
  FiAlertCircle,
  FiZap,
  FiShield,
} from "react-icons/fi";

const dashboardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  .dashboard-page {
    min-height: calc(100vh - 64px);
    padding: 1.6rem 2.1rem 2rem;
    background: radial-gradient(circle at top left, #e0f2fe 0, #eff6ff 45%, #f9fafb 100%);
    font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #0f172a;
    box-sizing: border-box;
  }

  .dashboard-inner {
    max-width: 1150px;
    margin: 0 auto;
  }

  /* GLAVNA KARTICA */

  .dash-card {
    background: #ffffff;
    border-radius: 1.2rem;
    border: 1px solid rgba(148, 163, 184, 0.55);
    box-shadow: 0 20px 50px rgba(15, 23, 42, 0.13);
    padding: 1.3rem 1.4rem 1.1rem;
  }

  .dash-header-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.6rem;
    margin-bottom: 1.05rem;
  }

  /* HERO LEVO */

  .dash-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.28rem 0.8rem;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.08);
    border: 1px solid rgba(37, 99, 235, 0.3);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #2563eb;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .dash-hero-title {
    font-size: 1.9rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    margin-bottom: 0.4rem;
  }

  .dash-hero-subtitle {
    font-size: 0.95rem;
    color: #4b5563;
    max-width: 480px;
    margin-bottom: 0.8rem;
    line-height: 1.45;
  }

  .dash-hero-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.84rem;
    color: #6b7280;
  }

  .dash-meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.28rem 0.7rem;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
  }

  .dash-meta-label {
    font-weight: 500;
    color: #111827;
  }

  /* PROFIL DESNO – VEĆA KARTICA */

  .dash-profile-card {
    width: 360px;
    max-width: 100%;
    border-radius: 1rem;
    background: #f9fafb;
    border: 1px solid rgba(209, 213, 219, 0.9);
    padding: 1rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .dash-profile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    margin-bottom: 0.3rem;
  }

  .dash-profile-user {
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }

  .dash-avatar {
    width: 2.7rem;
    height: 2.7rem;
    border-radius: 999px;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
    font-weight: 600;
    box-shadow: 0 10px 22px rgba(37, 99, 235, 0.4);
  }

  .dash-profile-title-group {
    display: flex;
    flex-direction: column;
    gap: 0.08rem;
  }

  .dash-profile-title {
    font-size: 1rem;
    font-weight: 600;
  }

  .dash-profile-subtitle {
    font-size: 0.8rem;
    color: #6b7280;
  }

  .dash-admin-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.22rem 0.6rem;
    border-radius: 999px;
    background: rgba(16, 185, 129, 0.09);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: #047857;
    font-size: 0.78rem;
  }

  .dash-edit-btn {
    border-radius: 999px;
    padding: 0.26rem 0.8rem;
    border: 1px solid #d1d5db;
    background: #ffffff;
    font-size: 0.8rem;
    cursor: pointer;
    color: #111827;
  }

  .dash-edit-btn:hover {
    background: #f3f4f6;
  }

  .dash-profile-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.45rem;
    font-size: 0.84rem;
  }

  .dash-profile-field {
    display: flex;
    flex-direction: column;
    gap: 0.12rem;
  }

  .dash-profile-label {
    display: inline-flex;
    align-items: center;
    gap: 0.28rem;
    color: #6b7280;
    font-size: 0.8rem;
  }

  .dash-profile-value {
    font-weight: 500;
    color: #111827;
  }

  .dash-profile-form .form-group {
    margin-bottom: 0.6rem;
  }

  .dash-profile-form label {
    display: block;
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
    color: #4b5563;
  }

  .dash-input-with-icon {
    position: relative;
  }

  .dash-input-with-icon input {
    width: 100%;
    padding: 0.4rem 0.8rem 0.4rem 1.9rem;
    border-radius: 0.6rem;
    border: 1px solid rgba(148, 163, 184, 0.9);
    font-size: 0.82rem;
    outline: none;
    background: white;
    box-sizing: border-box;
  }

  .dash-input-with-icon input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.12);
  }

  .dash-input-icon {
    position: absolute;
    left: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
  }

  .dash-profile-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .dash-btn-primary,
  .dash-btn-outline {
    font-size: 0.82rem;
    border-radius: 999px;
    padding: 0.35rem 0.9rem;
    cursor: pointer;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .dash-btn-primary {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    border-color: transparent;
    color: white;
  }

  .dash-btn-primary:disabled {
    opacity: 0.7;
    cursor: default;
  }

  .dash-btn-outline {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #111827;
  }

  .dash-btn-outline:hover {
    background: #e5e7eb;
  }

  .dash-alert-error {
    display: flex;
    align-items: flex-start;
    gap: 0.4rem;
    padding: 0.4rem 0.6rem;
    margin-bottom: 0.45rem;
    border-radius: 0.6rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    font-size: 0.8rem;
    color: #b91c1c;
  }

  .dash-alert-error-icon {
    margin-top: 0.05rem;
  }

  /* STATS + AKCIJE DOLE */

  .dash-footer-row {
    margin-top: 0.9rem;
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .dash-stats-row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .dash-stat-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.9rem;
    border-radius: 999px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    font-size: 0.84rem;
  }

  .dash-stat-icon {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 999px;
    background: #2563eb10;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dash-stat-label {
    color: #6b7280;
  }

  .dash-stat-value {
    font-weight: 600;
    color: #111827;
  }

  .dash-actions-row {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .dash-main-btn,
  .dash-secondary-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border-radius: 999px;
    padding: 0.45rem 1.1rem;
    font-size: 0.86rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    border: 1px solid transparent;
  }

  .dash-main-btn {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: white;
    box-shadow: 0 12px 28px rgba(37, 99, 235, 0.35);
  }

  .dash-secondary-btn {
    background: #ffffff;
    border-color: #d1d5db;
    color: #111827;
  }

  .dash-main-btn:hover {
    box-shadow: 0 16px 40px rgba(37, 99, 235, 0.45);
    transform: translateY(-1px);
  }

  .dash-secondary-btn:hover {
    background: #f3f4f6;
  }

  .dash-btn-icon {
    width: 1.1rem;
    height: 1.1rem;
  }

  /* RESPONSIVE */

  @media (max-width: 960px) {
    .dashboard-page {
      padding: 1.3rem 1.3rem 1.7rem;
    }

    .dash-header-row {
      flex-direction: column;
    }

    .dash-profile-card {
      width: 100%;
      order: 2;
    }

    .dash-footer-row {
      flex-direction: column;
      align-items: flex-start;
    }
  }
`;

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    address: "",
    phoneNumber: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await client.get("/Documents/my");
        setDocuments(res.data || []);
      } catch (err) {
        console.error("Greška pri učitavanju dokumenata:", err);
      } finally {
        setLoadingDocs(false);
      }
    };

    fetchDocs();
  }, []);

  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName || "",
        address: user.address || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await updateProfile(editForm);
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("Nije moguće sačuvati profil. Pokušaj kasnije.");
    } finally {
      setSaving(false);
    }
  };

  const firstName = user?.fullName?.trim().split(" ")[0] || "Korisniče";

  const initials = useMemo(() => {
    if (!user?.fullName) return "AP";
    const parts = user.fullName.trim().split(" ");
    const letters = parts.map((p) => p[0]).join("");
    return letters.slice(0, 2).toUpperCase();
  }, [user]);

  const lastGeneratedAt =
    documents.length > 0
      ? new Date(
          [...documents].sort(
            (a, b) =>
              new Date(b.generatedAt).getTime() -
              new Date(a.generatedAt).getTime()
          )[0].generatedAt
        ).toLocaleString()
      : null;

  return (
    <div className="dashboard-page">
      <style>{dashboardStyles}</style>

      <div className="dashboard-inner">
        <section className="dash-card">
          {/* Gornji red: hero levo + profil desno */}
          <div className="dash-header-row">
            <div>
              <div className="dash-hero-badge">
                <FiZap />
                <span>AI asistirani pravni dokumenti</span>
              </div>

              <h2 className="dash-hero-title">Zdravo, {firstName}</h2>

              <p className="dash-hero-subtitle">
                Dobrodošao/la u AppAI – centralno mesto za kreiranje i
                upravljanje tvojim pravnim dokumentima uz pomoć veštačke
                inteligencije.
              </p>
            </div>

            {/* Profil kartica */}
            <div className="dash-profile-card">
              <div className="dash-profile-header">
                <div className="dash-profile-user">
                  <div className="dash-avatar">{initials}</div>
                  <div className="dash-profile-title-group">
                    <span className="dash-profile-title">Moj profil</span>
                    <span className="dash-profile-subtitle">
                      lični podaci za popunjavanje dokumenata
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    alignItems: "flex-end",
                  }}
                >
                  {user?.isAdmin && (
                    <div className="dash-admin-badge">
                      <FiShield />
                      Admin
                    </div>
                  )}

                  {!editing && (
                    <button
                      type="button"
                      className="dash-edit-btn"
                      onClick={() => setEditing(true)}
                    >
                      Izmeni
                    </button>
                  )}
                </div>
              </div>

              {!editing ? (
                <div className="dash-profile-grid">
                  <div className="dash-profile-field">
                    <span className="dash-profile-label">
                      <FiUser />
                      Ime i prezime
                    </span>
                    <span className="dash-profile-value">
                      {user?.fullName || "—"}
                    </span>
                  </div>

                  <div className="dash-profile-field">
                    <span className="dash-profile-label">
                      <FiMail />
                      Email
                    </span>
                    <span className="dash-profile-value">
                      {user?.email}
                    </span>
                  </div>

                  <div className="dash-profile-field">
                    <span className="dash-profile-label">
                      <FiMapPin />
                      Adresa
                    </span>
                    <span className="dash-profile-value">
                      {user?.address || "Nije uneta"}
                    </span>
                  </div>

                  <div className="dash-profile-field">
                    <span className="dash-profile-label">
                      <FiPhone />
                      Telefon
                    </span>
                    <span className="dash-profile-value">
                      {user?.phoneNumber || "Nije unet"}
                    </span>
                  </div>
                </div>
              ) : (
                <form className="dash-profile-form" onSubmit={handleSave}>
                  {error && (
                    <div className="dash-alert-error">
                      <FiAlertCircle className="dash-alert-error-icon" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="fullName">Ime i prezime</label>
                    <div className="dash-input-with-icon">
                      <FiUser className="dash-input-icon" />
                      <input
                        id="fullName"
                        name="fullName"
                        value={editForm.fullName}
                        onChange={handleChange}
                        required
                        placeholder="npr. Marko Marković"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Adresa</label>
                    <div className="dash-input-with-icon">
                      <FiMapPin className="dash-input-icon" />
                      <input
                        id="address"
                        name="address"
                        value={editForm.address}
                        onChange={handleChange}
                        placeholder="Ulica i broj (opciono)"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phoneNumber">Telefon</label>
                    <div className="dash-input-with-icon">
                      <FiPhone className="dash-input-icon" />
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editForm.phoneNumber}
                        onChange={handleChange}
                        placeholder="+381 6x xxx xxxx"
                      />
                    </div>
                  </div>

                  <div className="dash-profile-actions">
                    <button
                      className="dash-btn-primary"
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? "Čuvanje..." : "Sačuvaj"}
                    </button>
                    <button
                      className="dash-btn-outline"
                      type="button"
                      onClick={() => setEditing(false)}
                    >
                      Otkaži
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Donji red: statistika + akcije */}
          <div className="dash-footer-row">
            <div className="dash-stats-row">
              <div className="dash-stat-pill">
                <div className="dash-stat-icon">
                  <FiFileText />
                </div>
                <div>
                  <div className="dash-stat-label">Ukupno dokumenata</div>
                  <div className="dash-stat-value">
                    {loadingDocs ? "..." : documents.length}
                  </div>
                </div>
              </div>

              {lastGeneratedAt && (
                <div className="dash-stat-pill">
                  <div className="dash-stat-icon">
                    <FiClock />
                  </div>
                  <div>
                    <div className="dash-stat-label">Poslednji dokument</div>
                    <div className="dash-stat-value">{lastGeneratedAt}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="dash-actions-row">
              <Link to="/templates" className="dash-main-btn">
                Kreiraj novi dokument
                <FiArrowRightCircle className="dash-btn-icon" />
              </Link>
              <Link to="/documents" className="dash-secondary-btn">
                <FiFileText className="dash-btn-icon" />
                <span>Otvori moje dokumente</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
