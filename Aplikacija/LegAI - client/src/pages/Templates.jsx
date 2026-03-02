// src/pages/Templates.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FiFileText,
  FiSearch,
  FiFilter,
  FiLayers,
  FiZap,
  FiAlertCircle,
  FiCheckCircle,
  FiPlusCircle,
  FiStar,
  FiTrash2,
} from "react-icons/fi";
import SidePanel from "../components/SidePanel";

const templatesStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  .templates-page {
    min-height: calc(100vh - 64px);
    padding: 1.5rem 2rem 1.9rem;
    background: radial-gradient(circle at top left, #eff6ff 0, #f9fafb 60%, #f3f4f6 100%);
    font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #0f172a;
    box-sizing: border-box;
  }

  .templates-inner {
    max-width: 1150px;
    margin: 0 auto;
  }

  .templates-card {
    background: #ffffff;
    border-radius: 1.1rem;
    border: 1px solid rgba(148, 163, 184, 0.55);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.1);
    padding: 1.1rem 1.3rem;
  }

  /* HEADER */

  .templates-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.9rem;
  }

  .templates-header-main {
    display: flex;
    gap: 0.55rem;
    align-items: center;
  }

  .templates-header-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.1);
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .templates-header-texts {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .templates-title {
    font-size: 1.2rem;
    font-weight: 600;
  }

  .templates-subtitle {
    font-size: 0.84rem;
    color: #4b5563;
  }

  .templates-header-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .templates-ai-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border-radius: 999px;
    padding: 0.4rem 0.9rem;
    border: 1px solid rgba(59, 130, 246, 0.4);
    background: rgba(37, 99, 235, 0.06);
    color: #1d4ed8;
    font-size: 0.82rem;
    cursor: pointer;
  }

  .templates-ai-btn:hover {
    background: rgba(37, 99, 235, 0.12);
  }

  .templates-ai-btn-icon {
    width: 1rem;
    height: 1rem;
  }

  .templates-new-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    border-radius: 999px;
    padding: 0.4rem 0.95rem;
    font-size: 0.82rem;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: #ffffff;
    border: none;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
  }

  .templates-new-btn .btn-icon {
    width: 1rem;
    height: 1rem;
  }

  /* FILTERS */

  .templates-filters {
    margin-top: 0.6rem;
    padding: 0.6rem 0.8rem;
    border-radius: 0.8rem;
    background: #f9fafb;
    border: 1px solid rgba(209, 213, 219, 0.9);
    display: flex;
    align-items: center;
    gap: 0.9rem;
    flex-wrap: wrap;
  }

  .templates-search-block {
    flex: 1 1 260px;
    min-width: 230px;
  }

  .templates-search-label {
    font-size: 0.76rem;
    color: #6b7280;
    margin-bottom: 0.2rem;
  }

  .templates-input-with-icon {
    position: relative;
  }

  .templates-input-with-icon input {
    width: 100%;
    padding: 0.4rem 0.75rem 0.4rem 1.9rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.9);
    font-size: 0.82rem;
    outline: none;
    background: #ffffff;
    box-sizing: border-box;
  }

  .templates-input-with-icon input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.12);
  }

  .templates-input-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
  }

  .templates-filter-select {
    flex: 0 0 220px;
    min-width: 180px;
  }

  .templates-filter-label {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.76rem;
    color: #6b7280;
    margin-bottom: 0.2rem;
  }

  .templates-select {
    width: 100%;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.9);
    background: #ffffff;
    font-size: 0.82rem;
    outline: none;
  }

  .templates-select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.12);
  }

  /* TABLE */

  .templates-table-wrapper {
    margin-top: 0.9rem;
    border-radius: 0.9rem;
    border: 1px solid rgba(209, 213, 219, 0.9);
    overflow: hidden;
    background: #ffffff;
  }

  .templates-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
  }

  .templates-table thead {
    background: #f3f4f6;
  }

  .templates-table th,
  .templates-table td {
    padding: 0.55rem 0.75rem;
    border-bottom: 1px solid rgba(229, 231, 235, 0.9);
  }

  .templates-table th {
    text-align: left;
    font-size: 0.74rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7280;
  }

  .templates-table tbody tr:hover {
    background: #f9fafb;
  }

  .templates-name-cell {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 500;
    color: #111827;
  }

  .templates-name-icon {
    width: 1rem;
    height: 1rem;
    color: #2563eb;
  }

  .templates-description {
    color: #4b5563;
    font-size: 0.8rem;
  }

  .templates-category-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.28rem;
    border-radius: 999px;
    padding: 0.2rem 0.6rem;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 0.76rem;
  }

  .templates-actions-cell {
    text-align: right;
  }

  .templates-actions {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }

  .templates-generate-btn {
    border-radius: 999px;
    padding: 0.3rem 0.85rem;
    font-size: 0.8rem;
    border: 1px solid #2563eb;
    background: #2563eb;
    color: #ffffff;
    cursor: pointer;
  }

  .templates-generate-btn:hover {
    background: #1d4ed8;
  }

  .templates-delete-btn {
    border-radius: 999px;
    width: 1.9rem;
    height: 1.9rem;
    border: none;
    background: #fef2f2;
    color: #b91c1c;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .templates-delete-btn:hover {
    background: #fee2e2;
  }

  /* AI TAG */

  .templates-ai-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.18rem 0.55rem;
    border-radius: 999px;
    background: #bbf7d0;
    color: #166534;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-right: 0.25rem;
  }

  .templates-ai-tag svg {
    width: 0.9rem;
    height: 0.9rem;
  }

  /* EMPTY / ERROR */

  .templates-empty {
    padding: 1.3rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    color: #6b7280;
    font-size: 0.84rem;
  }

  .templates-empty-icon {
    width: 2.1rem;
    height: 2.1rem;
    color: #d1d5db;
  }

  .templates-error {
    margin-top: 0.6rem;
    display: flex;
    align-items: flex-start;
    gap: 0.35rem;
    padding: 0.4rem 0.6rem;
    border-radius: 0.6rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    font-size: 0.8rem;
    color: #b91c1c;
  }

  .templates-error-icon {
    margin-top: 0.05rem;
  }

  .templates-note {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.5rem;
  }

  /* DELETE MODAL */

  .template-delete-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9990;
  }

  .template-delete-modal {
    width: 360px;
    max-width: 90%;
    background: #ffffff;
    border-radius: 1rem;
    padding: 1.2rem 1.4rem;
    border: 1px solid rgba(148, 163, 184, 0.35);
    box-shadow: 0 12px 32px rgba(0,0,0,0.18);
    animation: templateModalFadeIn 0.16s ease-out;
    text-align: center;
  }

  @keyframes templateModalFadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .template-delete-modal h3 {
    margin: 0 0 0.4rem;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .template-delete-modal p {
    margin: 0.25rem 0 0.9rem;
    font-size: 0.86rem;
    color: #4b5563;
  }

  .template-delete-modal span {
    font-weight: 500;
  }

  .template-delete-modal-actions {
    display: flex;
    justify-content: center;
    gap: 0.6rem;
  }

  .template-delete-btn-confirm,
  .template-delete-btn-cancel {
    border-radius: 999px;
    padding: 0.4rem 1rem;
    font-size: 0.82rem;
    border: 1px solid transparent;
    cursor: pointer;
  }

  .template-delete-btn-confirm {
    background: #dc2626;
    color: white;
  }

  .template-delete-btn-confirm:hover {
    background: #b91c1c;
  }

  .template-delete-btn-cancel {
    background: #f3f4f6;
    border-color: #d1d5db;
    color: #374151;
  }

  .template-delete-btn-cancel:hover {
    background: #e5e7eb;
  }

  /* AI HINT U PANELU */

  .templates-ai-hint {
    display: flex;
    align-items: flex-start;
    gap: 0.35rem;
    margin-top: 0.6rem;
    font-size: 0.8rem;
    color: #166534;
    background: #ecfdf5;
    border-radius: 0.75rem;
    padding: 0.45rem 0.6rem;
  }

  .templates-ai-hint svg {
    margin-top: 2px;
  }

  @media (max-width: 960px) {
    .templates-page {
      padding: 1.3rem 1.3rem 1.7rem;
    }

    .templates-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .templates-header-actions {
      align-items: flex-start;
    }
  }
`;

export default function Templates() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // AI
  const [aiDescription, setAiDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [suggestedIds, setSuggestedIds] = useState([]);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  // pretraga / filter
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await client.get("/Templates");
      setTemplates(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Greška pri učitavanju šablona.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const goToGenerate = (id) => {
    if (!user) {
      navigate("/login");
      return;
    }

    navigate(`/generate/${id}`);
  };


  const handleDeleteTemplateRequest = (template) => {
    setTemplateToDelete(template);
    setDeleteModalOpen(true);
  };

  const confirmDeleteTemplate = async () => {
    if (!templateToDelete) return;

    try {
      await client.delete(`/Templates/${templateToDelete.id}`);
      setTemplates((prev) => prev.filter((t) => t.id !== templateToDelete.id));
    } catch (err) {
      console.error(err);
      alert("Nije moguće obrisati šablon. Pokušaj ponovo kasnije.");
    } finally {
      setDeleteModalOpen(false);
      setTemplateToDelete(null);
    }
  };

  const cancelDeleteTemplate = () => {
    setDeleteModalOpen(false);
    setTemplateToDelete(null);
  };

  const handleSuggest = async () => {
    if (!aiDescription.trim()) return;

    setAiLoading(true);
    setAiError(null);
    setSuggestedIds([]);

    try {
      const res = await client.post("/AI/suggest-template", {
        description: aiDescription,
      });

      const ids = res.data.suggestions || [];
      setSuggestedIds(ids);

      if (ids.length) {
        setAiPanelOpen(false);
      } else {
        setAiError("AI trenutno nije predložio nijedan specifičan šablon.");
      }
    } catch (err) {
      console.error(err);
      setAiError(
        "Nije moguće dobiti preporuke od AI asistenta. Pokušaj kasnije."
      );
    } finally {
      setAiLoading(false);
    }
  };

  const isSuggested = (id) => suggestedIds.includes(id);

  const categories = Array.from(
    new Set(templates.map((t) => t.category).filter(Boolean))
  );

  const filteredTemplates = templates.filter((t) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);

    const matchesCategory = !categoryFilter || t.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const templatesForDisplay = [...filteredTemplates].sort((a, b) => {
    const aSug = isSuggested(a.id);
    const bSug = isSuggested(b.id);
    if (aSug === bSug) return 0;
    return aSug ? -1 : 1;
  });

  return (
    <div className="templates-page">
      <style>{templatesStyles}</style>

      <div className="templates-inner">
        <section className="templates-card">
          <div className="templates-header">
            <div className="templates-header-main">
              <div className="templates-header-icon">
                <FiFileText />
              </div>
              <div className="templates-header-texts">
                <div className="templates-title">Šabloni dokumenata</div>
                <div className="templates-subtitle">
                  Izaberi šablon i nastavi na generisanje pravnog dokumenta.
                </div>
              </div>
            </div>

            <div className="templates-header-actions">
              {user && (
                <button
                  type="button"
                  className="templates-ai-btn"
                  onClick={() => setAiPanelOpen(true)}
                >
                  <FiZap className="templates-ai-btn-icon" />
                  AI preporuka šablona
                </button>
              )}

              {user?.isAdmin && (
                <button
                  type="button"
                  className="templates-new-btn"
                  onClick={() => navigate("/templates/new")}
                >
                  <FiPlusCircle className="btn-icon" />
                  Novi šablon
                </button>
              )}
            </div>
          </div>

          {/* FILTERI */}
          <div className="templates-filters">
            <div className="templates-search-block">
              <div className="templates-search-label">Pretraga</div>
              <div className="templates-input-with-icon">
                <FiSearch className="templates-input-icon" />
                <input
                  type="text"
                  placeholder="Pretraga po nazivu ili opisu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="templates-filter-select">
              <div className="templates-filter-label">
                <FiFilter />
                <span>Kategorija</span>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="templates-select"
              >
                <option value="">Sve kategorije</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LISTA ŠABLONA */}
          {loading ? (
            <div className="templates-empty">
              <FiFileText className="templates-empty-icon" />
              <p>Učitavanje šablona...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="templates-empty">
              <FiLayers className="templates-empty-icon" />
              <p>Ne postoje šabloni koji odgovaraju kriterijumu.</p>
            </div>
          ) : (
            <div className="templates-table-wrapper">
              <table className="templates-table">
                <thead>
                  <tr>
                    <th>Naziv</th>
                    <th>Kategorija</th>
                    <th>Opis</th>
                    <th style={{ textAlign: "right" }}>Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {templatesForDisplay.map((t) => {
                    const suggested = isSuggested(t.id);

                    return (
                      <tr
                        key={t.id}
                        style={
                          suggested
                            ? { backgroundColor: "#ecfdf5" }
                            : undefined
                        }
                      >
                        <td>
                          <div className="templates-name-cell">
                            {suggested && (
                              <span className="templates-ai-tag">
                                <FiStar />
                                AI predlog
                              </span>
                            )}
                            <FiFileText className="templates-name-icon" />
                            {t.name}
                          </div>
                        </td>
                        <td>
                          <span className="templates-category-pill">
                            {t.category}
                          </span>
                        </td>
                        <td className="templates-description">
                          {t.description}
                        </td>
                        <td className="templates-actions-cell">
                          <div className="templates-actions">
                            <button
                              className="templates-generate-btn"
                              onClick={() => goToGenerate(t.id)}
                            >
                              Generiši
                            </button>
                            {user?.isAdmin && (
                              <button
                                type="button"
                                className="templates-delete-btn"
                                onClick={() => handleDeleteTemplateRequest(t)}
                                title="Obriši šablon"
                              >
                                <FiTrash2 />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {error && (
            <div className="templates-error">
              <FiAlertCircle className="templates-error-icon" />
              <span>{error}</span>
            </div>
          )}

          {!user?.isAdmin && (
            <p className="templates-note">
              Napomena: samo administrator može da dodaje ili briše šablone.
            </p>
          )}
        </section>
      </div>

      {/* AI SIDE PANEL */}
      {user && (
        <SidePanel
          open={aiPanelOpen}
          onClose={() => setAiPanelOpen(false)}
          title="AI pomoć pri izboru šablona"
        >
        <p className="card-subtitle" style={{ marginBottom: 10 }}>
          Ukratko opiši svoju situaciju, a AI će označiti preporučene šablone
          oznakom <strong>AI predlog</strong>.
        </p>

        <textarea
          value={aiDescription}
          onChange={(e) => setAiDescription(e.target.value)}
          className="ai-textarea"
          placeholder='npr. "izdajem stan fizičkom licu na godinu dana"'
        />

        <div className="card-actions card-actions--ai">
          <button
            className="btn btn-primary btn-small"
            type="button"
            onClick={handleSuggest}
            disabled={aiLoading || !aiDescription.trim()}
          >
            {aiLoading ? "Analiziranje..." : "Predloži šablone"}
          </button>
          <button
            className="btn btn-outline btn-small"
            type="button"
            onClick={() => {
              setAiDescription("");
              setAiError(null);
              setSuggestedIds([]);
            }}
            disabled={
              !aiDescription.trim() && !aiError && !suggestedIds.length
            }
          >
            Očisti
          </button>
        </div>

        {aiError && (
          <div className="alert alert-error" style={{ marginTop: 10 }}>
            <FiAlertCircle className="alert-icon" />
            <span>{aiError}</span>
          </div>
        )}

        {suggestedIds.length > 0 && !aiError && (
          <div className="templates-ai-hint">
            <FiCheckCircle />
            <span>
              AI je označio preporučene šablone oznakom{" "}
              <strong>AI predlog</strong> u tabeli šablona.
            </span>
          </div>
        )}
      </SidePanel>
      )}

      {/* DELETE MODAL */}
      {deleteModalOpen && (
        <div className="template-delete-modal-overlay">
          <div className="template-delete-modal">
            <h3>Obrisati šablon?</h3>
            <p>
              Da li sigurno želiš da obrišeš šablon{" "}
              <span>"{templateToDelete?.name}"</span>?
            </p>

            <div className="template-delete-modal-actions">
              <button
                className="template-delete-btn-confirm"
                type="button"
                onClick={confirmDeleteTemplate}
              >
                Obriši
              </button>
              <button
                className="template-delete-btn-cancel"
                type="button"
                onClick={cancelDeleteTemplate}
              >
                Otkaži
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
