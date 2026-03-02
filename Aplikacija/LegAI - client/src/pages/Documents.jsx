// src/pages/Documents.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import {
  FiFileText,
  FiSearch,
  FiDownload,
  FiClock,
  FiLayers,
  FiTrash2,
} from "react-icons/fi";

const documentsStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

  .documents-page {
    min-height: calc(100vh - 64px);
    padding: 1.3rem 1.8rem 1.7rem;
    background: radial-gradient(circle at top left, #eff6ff 0, #f9fafb 60%, #f3f4f6 100%);
    font-family: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #0f172a;
    box-sizing: border-box;
  }

  .documents-inner {
    max-width: 1150px;
    margin: 0 auto;
  }

  .docs-card {
    background: #ffffff;
    border-radius: 1rem;
    border: 1px solid rgba(148, 163, 184, 0.55);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.10);
    padding: 1.1rem 1.2rem 1rem;
  }

  .docs-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 0.9rem;
  }

  .docs-header-main-title {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .docs-header-icon {
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.1);
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .docs-header-subtitle {
    margin-top: 0.25rem;
    font-size: 0.8rem;
    color: #6b7280;
  }

  .docs-header-meta {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    font-size: 0.78rem;
    color: #6b7280;
  }

  .docs-header-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 0.74rem;
    font-weight: 500;
  }

  .docs-header-count {
    font-weight: 600;
    color: #111827;
  }

  /* FILTERI – JEDAN RED: SEARCH + FILTERI */

  .docs-filters {
    margin-bottom: 0.8rem;
    padding: 0.65rem 0.75rem;
    border-radius: 0.75rem;
    background: #f9fafb;
    border: 1px solid rgba(209, 213, 219, 0.9);
  }

  .docs-filters-row {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  /* SEARCH */

  .docs-search {
    flex: 0 0 20%;
    max-width: 430px;
    min-width: 260px;
  }

  .docs-input-with-icon {
    position: relative;
  }

  .docs-input-with-icon input {
    width: 100%;
    padding: 0.45rem 0.75rem 0.45rem 1.9rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.9);
    font-size: 0.8rem;
    outline: none;
    background: #ffffff;
  }

  .docs-input-with-icon input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.1);
  }

  .docs-input-icon {
    position: absolute;
    left: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
  }

  /* GRUPA FILTERA – desno */

  .docs-filter-group {
    flex: 1 1 auto;
    display: flex;
    justify-content: flex-end;
    gap: 0.6rem;
    flex-wrap: nowrap;
  }

  .docs-filter-label {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    font-size: 0.75rem;
    color: #4b5563;
    min-width: 150px;
  }

  .docs-select,
  .docs-date-input {
    padding: 0.35rem 0.65rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.9);
    background: #ffffff;
    font-size: 0.78rem;
    outline: none;
  }

  .docs-select:focus,
  .docs-date-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.08);
  }

  .docs-date-input {
    min-width: 150px;
  }

  /* TABELA */

  .docs-table-wrapper {
    border-radius: 0.8rem;
    border: 1px solid rgba(209, 213, 219, 0.9);
    overflow: hidden;
  }

  .docs-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
    background: #ffffff;
  }

  .docs-table thead {
    background: #f3f4f6;
  }

  .docs-table th,
  .docs-table td {
    padding: 0.55rem 0.75rem;
    border-bottom: 1px solid rgba(229, 231, 235, 0.9);
    text-align: left;
  }

  .docs-table th {
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #6b7280;
  }

  .docs-table tbody tr:hover {
    background: #f9fafb;
  }

  .docs-title-cell {
    font-weight: 500;
    color: #111827;
  }

  .docs-template-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 0.75rem;
  }

  .docs-date-cell {
    font-variant-numeric: tabular-nums;
    color: #4b5563;
  }

  .docs-download-links {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }

  .docs-download-link {
    border: none;
    background: none;
    padding: 0;
    font-size: 0.76rem;
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    cursor: pointer;
  }

  .docs-download-link:hover {
    text-decoration: underline;
  }

  .docs-download-icon {
    width: 0.9rem;
    height: 0.9rem;
  }

  .docs-download-separator {
    color: #9ca3af;
    font-size: 0.75rem;
  }

  .docs-actions {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .docs-reopen-btn {
    border-radius: 999px;
    padding: 0.25rem 0.7rem;
    border: 1px solid #d1d5db;
    background: #ffffff;
    font-size: 0.75rem;
    cursor: pointer;
    color: #111827;
  }

  .docs-reopen-btn:hover {
    background: #f9fafb;
  }

  .docs-delete-btn {
    border-radius: 999px;
    width: 1.8rem;
    height: 1.8rem;
    border: none;
    background: #fef2f2;
    color: #b91c1c;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .docs-delete-btn:hover {
    background: #fee2e2;
  }

  .docs-empty {
    padding: 1.4rem 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    color: #6b7280;
    font-size: 0.82rem;
  }

  .docs-empty-icon {
    width: 2.1rem;
    height: 2.1rem;
    color: #d1d5db;
  }

  .docs-empty-hint {
    font-size: 0.75rem;
    color: #9ca3af;
  }

  /* RESPONSIVE – kad je ekran uži, filteri idu ispod */

  @media (max-width: 1024px) {
    .docs-filters-row {
      flex-wrap: wrap;
    }

    .docs-search {
      flex: 1 1 100%;
      max-width: none;
      min-width: 0;
    }

    .docs-filter-group {
      flex: 1 1 100%;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .docs-filter-label {
      flex: 1 1 150px;
    }
  }

  @media (max-width: 768px) {
    .documents-page {
      padding: 1rem 1.2rem;
    }

    .docs-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .docs-header-meta {
      align-items: flex-start;
    }

    .docs-table-wrapper {
      overflow-x: auto;
    }

    .docs-table {
      min-width: 720px;
    }
  }

  /* DELETE MODAL */

  .delete-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.35);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9990;
  }

  .delete-modal {
    width: 360px;
    background: #ffffff;
    border-radius: 1rem;
    padding: 1.2rem 1.4rem;
    border: 1px solid rgba(148, 163, 184, 0.35);
    box-shadow: 0 12px 32px rgba(0,0,0,0.18);
    animation: modalFadeIn 0.16s ease-out;
    text-align: center;
    font-family: "Poppins", sans-serif;
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .delete-modal h3 {
    margin: 0 0 0.4rem;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .delete-modal p {
    margin: 0.2rem 0 1rem;
    font-size: 0.85rem;
    color: #4b5563;
  }

  .delete-modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 0.4rem;
  }

  .delete-btn-confirm {
    background: #dc2626;
    color: white;
    padding: 0.45rem 1rem;
    border-radius: 999px;
    border: none;
    font-size: 0.82rem;
    cursor: pointer;
    font-weight: 600;
  }

  .delete-btn-confirm:hover {
    background: #b91c1c;
  }

  .delete-btn-cancel {
    background: #f3f4f6;
    color: #374151;
    padding: 0.45rem 1rem;
    border-radius: 999px;
    border: 1px solid #d1d5db;
    font-size: 0.82rem;
    cursor: pointer;
  }

  .delete-btn-cancel:hover {
    background: #e5e7eb;
  }
`;

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [templateFilter, setTemplateFilter] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await client.get("/Documents/my");
        setDocs(res.data || []);
      } catch (err) {
        console.error("Greška:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const templateOptions = Array.from(
    new Set(docs.map((d) => d.templateName).filter(Boolean))
  );

  const downloadDocument = async (doc, type) => {
    try {
      const res = await client.get(`/Documents/${doc.id}/download/${type}`, {
        responseType: "blob",
      });

      const mimeType =
        type === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/pdf";

      const blob = new Blob([res.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${doc.title}.${type}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Greška pri preuzimanju fajla:", err);
      alert("Preuzimanje nije uspelo. Pokušaj ponovo.");
    }
  };

  const handleReopen = (doc) => {
    navigate(`/generate/${doc.templateId}?from=${doc.id}`);
  };

  const handleDeleteRequest = (doc) => {
    setDocToDelete(doc);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await client.delete(`/Documents/${docToDelete.id}`);
      setDocs((prev) => prev.filter((d) => d.id !== docToDelete.id));
    } catch (err) {
      console.error("Greška pri brisanju dokumenta:", err);
      alert("Nije moguće obrisati dokument. Pokušaj ponovo kasnije.");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const filteredDocs = docs.filter((doc) => {
    const titleMatch = doc.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    let dateMatch = true;
    const docDate = new Date(doc.generatedAt);

    if (dateFrom) {
      const from = new Date(dateFrom);
      if (docDate < from) dateMatch = false;
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setDate(to.getDate() + 1);
      if (docDate >= to) dateMatch = false;
    }

    const templateMatch =
      !templateFilter || doc.templateName === templateFilter;

    return titleMatch && dateMatch && templateMatch;
  });

  return (
    <div className="documents-page">
      <style>{documentsStyles}</style>

      <div className="documents-inner">
        <section className="docs-card">
          <div className="docs-header">
            <div>
              <div className="docs-header-main-title">
                <span className="docs-header-icon">
                  <FiFileText />
                </span>
                <span>Moji dokumenti</span>
              </div>
              <p className="docs-header-subtitle">
                Pregled svih generisanih pravnih dokumenata u AppAI sistemu.
              </p>
            </div>

            <div className="docs-header-meta">
              <div className="docs-header-pill">
                <FiClock />
                <span>Dokumenata:</span>
                <span className="docs-header-count">{docs.length}</span>
              </div>
            </div>
          </div>

          {/* FILTERI */}
          <div className="docs-filters">
            <div className="docs-filters-row">
              <div className="docs-search">
                <div className="docs-input-with-icon">
                  <FiSearch className="docs-input-icon" />
                  <input
                    type="text"
                    placeholder="Pretraga po nazivu dokumenta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="docs-filter-group">
                <label className="docs-filter-label">
                  <span>Šablon</span>
                  <select
                    value={templateFilter}
                    onChange={(e) => setTemplateFilter(e.target.value)}
                    className="docs-select"
                  >
                    <option value="">Svi šabloni</option>
                    {templateOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="docs-filter-label">
                  <span>Od datuma</span>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="docs-date-input"
                  />
                </label>

                <label className="docs-filter-label">
                  <span>Do datuma</span>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="docs-date-input"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* TABELA / EMPTY STATES */}
          {loading ? (
            <div className="docs-empty">
              <FiClock className="docs-empty-icon" />
              <p>Učitavanje dokumenata...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="docs-empty">
              <FiFileText className="docs-empty-icon" />
              <p>Ne postoje dokumenti koji odgovaraju kriterijumu.</p>
              <span className="docs-empty-hint">
                Proveri upisani naziv, šablon ili vremenski interval.
              </span>
            </div>
          ) : (
            <div className="docs-table-wrapper">
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Naziv</th>
                    <th>Šablon</th>
                    <th>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <FiClock />
                        Datum generisanja
                      </span>
                    </th>
                    <th>Preuzmi</th>
                    <th>Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id}>
                      <td className="docs-title-cell">{doc.title}</td>
                      <td>
                        <span className="docs-template-pill">
                          <FiLayers />
                          {doc.templateName}
                        </span>
                      </td>
                      <td className="docs-date-cell">
                        {new Date(doc.generatedAt).toLocaleString()}
                      </td>
                      <td>
                        <div className="docs-download-links">
                          <button
                            type="button"
                            className="docs-download-link"
                            onClick={() => downloadDocument(doc, "docx")}
                          >
                            <FiDownload className="docs-download-icon" />
                            DOCX
                          </button>
                        </div>
                      </td>
                      <td className="docs-actions">
                        <button
                          type="button"
                          className="docs-reopen-btn"
                          onClick={() => handleReopen(doc)}
                        >
                          Ponovo otvori
                        </button>
                        <button
                          type="button"
                          className="docs-delete-btn"
                          onClick={() => handleDeleteRequest(doc)}
                          title="Obriši dokument"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* DELETE MODAL */}
      {deleteModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Obrisati dokument?</h3>
            <p>
              Da li sigurno želiš da obrišeš dokument <br />
              <strong>"{docToDelete?.title}"</strong>?
            </p>

            <div className="delete-modal-actions">
              <button className="delete-btn-confirm" onClick={confirmDelete}>
                Obriši
              </button>
              <button
                className="delete-btn-cancel"
                onClick={() => setDeleteModalOpen(false)}
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
