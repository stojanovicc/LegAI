// src/pages/TemplateCreate.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FiFileText,
  FiLayers,
  FiArrowLeftCircle,
  FiAlertCircle,
  FiUploadCloud,
} from "react-icons/fi";

const templateCreateStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  .template-create-page {
    min-height: calc(100vh - 64px);
    padding: 1.6rem 2.1rem 2rem;
    background: radial-gradient(circle at top left, #e0f2fe 0, #eff6ff 40%, #f9fafb 100%);
    font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #0f172a;
    box-sizing: border-box;
  }

  .template-create-inner {
    max-width: 920px;
    margin: 0 auto;
  }

  .template-create-card {
    background: #ffffff;
    border-radius: 1.1rem;
    border: 1px solid rgba(148, 163, 184, 0.55);
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
    padding: 1.2rem 1.4rem 1.2rem;
  }

  .template-create-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .template-create-title-row {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }

  .template-create-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.1);
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .template-create-title-text {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .template-create-title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .template-create-subtitle {
    font-size: 0.85rem;
    color: #4b5563;
  }

  .template-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    border-radius: 999px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    padding: 0.35rem 0.85rem;
    font-size: 0.82rem;
    cursor: pointer;
    color: #111827;
  }

  .template-back-btn:hover {
    background: #f3f4f6;
  }

  .template-back-btn .btn-icon {
    width: 1rem;
    height: 1rem;
  }

  /* FORM */

  .template-create-form {
    margin-top: 0.4rem;
  }

  .template-create-form .form-row {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 0.9rem;
  }

  .template-create-form .form-group {
    margin-bottom: 0.8rem;
  }

  .template-create-form label {
    display: block;
    font-size: 0.82rem;
    margin-bottom: 0.25rem;
    color: #4b5563;
    font-weight: 500;
  }

  .template-input-with-icon {
    position: relative;
  }

  .template-input-with-icon input {
    width: 100%;
    padding: 0.4rem 0.75rem 0.4rem 1.9rem;
    border-radius: 0.6rem;
    border: 1px solid rgba(148, 163, 184, 0.9);
    font-size: 0.84rem;
    outline: none;
    background: #ffffff;
    box-sizing: border-box;
  }

  .template-input-with-icon input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.12);
  }

  .template-input-icon {
    position: absolute;
    left: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
  }

  .template-textarea-group label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .template-placeholder-hint {
    font-size: 0.72rem;
    color: #6b7280;
  }

  .template-textarea {
    width: 100%;
    margin-top: 0.25rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(148, 163, 184, 0.9);
    padding: 0.6rem 0.8rem;
    font-size: 0.84rem;
    min-height: 180px;
    resize: vertical;
    outline: none;
    box-sizing: border-box;
  }

  .template-textarea:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.12);
  }

  .template-file-group {
    margin-top: 0.3rem;
  }

  .template-file-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-radius: 0.75rem;
    border: 1px dashed rgba(148, 163, 184, 0.9);
    padding: 0.55rem 0.7rem;
    background: #f9fafb;
    cursor: pointer;
  }

  .template-file-input-icon {
    width: 1.2rem;
    height: 1.2rem;
    color: #2563eb;
  }

  .template-file-input span {
    font-size: 0.8rem;
    color: #4b5563;
  }

  .template-file-input small {
    font-size: 0.72rem;
    color: #6b7280;
  }

  .template-file-input input {
    display: none;
  }

  .template-file-name {
    margin-top: 0.2rem;
    font-size: 0.78rem;
    color: #111827;
  }

  .template-file-error {
    margin-top: 0.15rem;
    font-size: 0.78rem;
    color: #b91c1c;
  }

  .template-alert-error {
    display: flex;
    align-items: flex-start;
    gap: 0.35rem;
    padding: 0.4rem 0.6rem;
    border-radius: 0.6rem;
    border: 1px solid #fecaca;
    background: #fef2f2;
    color: #b91c1c;
    margin-bottom: 0.6rem;
    font-size: 0.8rem;
  }

  .template-alert-error-icon {
    margin-top: 0.05rem;
  }

  .template-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.4rem;
  }

  .template-btn-primary,
  .template-btn-outline {
    border-radius: 999px;
    padding: 0.4rem 1rem;
    font-size: 0.84rem;
    border: 1px solid transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .template-btn-primary {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: #ffffff;
    box-shadow: 0 12px 28px rgba(37, 99, 235, 0.35);
  }

  .template-btn-primary:disabled {
    opacity: 0.7;
    box-shadow: none;
    cursor: default;
  }

  .template-btn-outline {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #111827;
  }

  .template-btn-outline:hover {
    background: #e5e7eb;
  }

  /* unauthorized */

  .template-unauth-card {
    max-width: 640px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 1rem;
    padding: 1.1rem 1.3rem;
    border: 1px solid rgba(148, 163, 184, 0.5);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.1);
    font-size: 0.9rem;
  }

  .template-unauth-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .template-unauth-text {
    color: #4b5563;
    font-size: 0.86rem;
  }

  @media (max-width: 900px) {
    .template-create-page {
      padding: 1.3rem 1.3rem 1.7rem;
    }

    .template-create-form .form-row {
      grid-template-columns: 1fr;
    }
  }
`;

export default function TemplateCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
  });


  const [docxFile, setDocxFile] = useState(null);
  const [docxError, setDocxError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!user?.isAdmin) {
    return (
      <div className="template-create-page">
        <style>{templateCreateStyles}</style>
        <div className="template-create-inner">
          <div className="template-unauth-card">
            <div className="template-unauth-title">Pristup ograničen</div>
            <p className="template-unauth-text">
              Stranica za kreiranje šablona dostupna je samo administratoru
              sistema. Ako smatraš da je ovo greška, obrati se vlasniku sistema.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setDocxFile(null);
      setDocxError(null);
      return;
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith(".docx")) {
      setDocxError("Dozvoljen je samo .docx fajl.");
      setDocxFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setDocxError("Fajl je preveliki (maksimum 5 MB).");
      setDocxFile(null);
      return;
    }

    setDocxError(null);
    setDocxFile(file);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // 1) prvo kreiramo šablon u bazi
      const res = await client.post("/Templates", form);
      const { id } = res.data;

      // 2) ako admin doda DOCX fajl – šaljemo ga na /Templates/{id}/upload-docx
      if (docxFile) {
        const formData = new FormData();
        formData.append("file", docxFile);

        await client.post(`/Templates/${id}/upload-docx`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/templates");
    } catch (err) {
      console.error(err);
      setError(
        "Nije moguće sačuvati šablon. Proveri podatke i pokušaj ponovo."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="template-create-page">
      <style>{templateCreateStyles}</style>

      <div className="template-create-inner">
        <section className="template-create-card">
          <div className="template-create-header">
            <div className="template-create-title-row">
              <span className="template-create-icon">
                <FiFileText />
              </span>
              <div className="template-create-title-text">
                <span className="template-create-title">
                  Novi šablon dokumenta
                </span>
                <span className="template-create-subtitle">
                  Definiši naziv, kategoriju, opis i sadržaj šablona, a po
                  želji dodaj i DOCX šablon sa već podešenim izgledom
                  dokumenta.
                </span>
              </div>
            </div>

            <button
              type="button"
              className="template-back-btn"
              onClick={() => navigate("/templates")}
            >
              <FiArrowLeftCircle className="btn-icon" />
              Nazad na šablone
            </button>
          </div>

          <form className="template-create-form" onSubmit={handleCreate}>
            <div className="form-row">
              <div className="form-group">
                <label>Naziv šablona</label>
                <div className="template-input-with-icon">
                  <FiFileText className="template-input-icon" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="npr. Ugovor o zakupu stana"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Kategorija</label>
                <div className="template-input-with-icon">
                  <FiLayers className="template-input-icon" />
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    placeholder="npr. Ugovori, Punomoćja, Ostalo..."
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Kratak opis</label>
              <div className="template-input-with-icon">
                <FiFileText className="template-input-icon" />
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder="Opis svrhe šablona"
                />
              </div>
            </div>
            <div className="form-group template-file-group">
              <label>
                DOCX šablon
              </label>
              <label className="template-file-input">
                <FiUploadCloud className="template-file-input-icon" />
                <div>
                  <span>Dodaj Word (.docx) fajl koji je spreman za štampu</span>
                  <br />
                  <small>
                    Šablon mora da koristi iste placeholdere: {"{{Ime}}"}, {"{{Adresa}}"}...
                  </small>
                </div>
                <input
                  type="file"
                  accept=".docx"
                  onChange={handleFileChange}
                />
              </label>

              {docxFile && !docxError && (
                <div className="template-file-name">
                  Odabrani fajl: <strong>{docxFile.name}</strong>
                </div>
              )}

              {docxError && (
                <div className="template-file-error">{docxError}</div>
              )}
            </div>

            {error && (
              <div className="template-alert-error">
                <FiAlertCircle className="template-alert-error-icon" />
                <span>{error}</span>
              </div>
            )}

            <div className="template-actions">
              <button
                type="button"
                className="template-btn-outline"
                onClick={() => navigate("/templates")}
                disabled={saving}
              >
                Otkaži
              </button>
              <button
                className="template-btn-primary"
                type="submit"
                disabled={saving}
              >
                {saving ? "Čuvanje..." : "Sačuvaj šablon"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
