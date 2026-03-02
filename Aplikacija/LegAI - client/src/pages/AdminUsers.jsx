// src/pages/AdminUsers.jsx

import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FiUsers,
  FiBarChart2,
  FiFileText,
  FiShield,
  FiSearch,
  FiAlertTriangle,
} from "react-icons/fi";

const adminStyles = `
  /* ============ ADMIN PANEL PAGE STYLES ============ */

  .admin-page {
    min-height: 100vh;
    padding: 2rem 2.5rem;
    background: radial-gradient(circle at top left, #f5f7ff 0, #f3f4f7 35%, #eef1f5 100%);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #111827;
  }

  .admin-page-inner {
    max-width: 1200px;
    margin: 0 auto;
  }

  .admin-page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1.5rem;
    margin-bottom: 1.75rem;
  }

  .admin-page-title-block {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .admin-page-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #111827;
  }

  .admin-page-title-icon {
    width: 1.7rem;
    height: 1.7rem;
    padding: 0.25rem;
    border-radius: 999px;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: white;
  }

  .admin-page-subtitle {
    font-size: 0.95rem;
    color: #6b7280;
    max-width: 520px;
  }

  .badge-admin-main {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    font-size: 0.75rem;
    background: rgba(16, 185, 129, 0.12);
    color: #047857;
    border: 1px solid rgba(16, 185, 129, 0.35);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .badge-admin-main svg {
    width: 0.9rem;
    height: 0.9rem;
  }

  /* STATS CARDS */

  .admin-stats-row {
    display: flex;
    gap: 1rem;
    align-items: stretch;
  }

  .admin-stat-card {
    flex: 1;
    padding: 1rem 1.1rem;
    border-radius: 0.9rem;
    background: white;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
    display: flex;
    align-items: center;
    gap: 0.9rem;
    border: 1px solid rgba(148, 163, 184, 0.25);
  }

  .admin-stat-icon-wrap {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .admin-stat-icon-wrap.users {
    background: rgba(37, 99, 235, 0.08);
    color: #2563eb;
  }

  .admin-stat-icon-wrap.docs {
    background: rgba(234, 88, 12, 0.08);
    color: #ea580c;
  }

  .admin-stat-icon-wrap.templates {
    background: rgba(6, 95, 70, 0.08);
    color: #059669;
  }

  .admin-stat-icon-wrap svg {
    width: 1.3rem;
    height: 1.3rem;
  }

  .admin-stat-label {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9ca3af;
    margin-bottom: 0.15rem;
  }

  .admin-stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
  }

  .admin-stat-caption {
    font-size: 0.8rem;
    color: #6b7280;
    margin-top: 0.1rem;
  }

  /* CARD WRAPPER */

  .admin-card {
    margin-top: 1.5rem;
    padding: 1.4rem 1.5rem 1.1rem;
    border-radius: 1rem;
    background: white;
    border: 1px solid rgba(148, 163, 184, 0.35);
    box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
  }

  .admin-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .admin-card-title-block {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .admin-card-title {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-weight: 600;
    font-size: 1.1rem;
    color: #111827;
  }

  .admin-card-title svg {
    color: #2563eb;
  }

  .admin-card-subtitle {
    font-size: 0.85rem;
    color: #6b7280;
  }

  /* FILTERS */

  .admin-filters {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .admin-search {
    position: relative;
  }

  .admin-search input {
    padding: 0.45rem 0.8rem 0.45rem 1.9rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.7);
    font-size: 0.85rem;
    min-width: 220px;
    outline: none;
    background: #f9fafb;
  }

  .admin-search input:focus {
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.1);
  }

  .admin-search-icon {
    position: absolute;
    left: 0.65rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    width: 1rem;
    height: 1rem;
  }

  .admin-select {
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.7);
    font-size: 0.82rem;
    background: #f9fafb;
    color: #374151;
    outline: none;
  }

  .admin-select:focus {
    border-color: #2563eb;
    background: white;
  }

  /* TABLE */

  .admin-table-wrapper {
    margin-top: 0.8rem;
    border-radius: 0.8rem;
    border: 1px solid rgba(148, 163, 184, 0.4);
    overflow: hidden;
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.86rem;
    background: white;
  }

  .admin-table thead {
    background: #f3f4f6;
  }

  .admin-table th,
  .admin-table td {
    padding: 0.6rem 0.9rem;
    text-align: left;
    border-bottom: 1px solid rgba(229, 231, 235, 0.85);
  }

  .admin-table th {
    font-weight: 600;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #6b7280;
    white-space: nowrap;
  }

  .admin-table tbody tr:nth-child(every) {
    background: #fff;
  }

  .admin-table tbody tr:hover {
    background: #f9fafb;
  }

  .admin-user-name-cell {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .admin-user-name-main {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-weight: 500;
    color: #111827;
  }

  .admin-user-email {
    font-size: 0.78rem;
    color: #6b7280;
  }

  .badge-admin {
    display: inline-flex;
    align-items: center;
    gap: 0.2rem;
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    font-size: 0.7rem;
    background: rgba(37, 99, 235, 0.08);
    color: #1d4ed8;
  }

  .badge-admin svg {
    width: 0.8rem;
    height: 0.8rem;
  }

  .admin-doc-count {
    font-weight: 600;
    color: #111827;
  }

  .admin-doc-count-muted {
    color: #9ca3af;
    font-weight: 400;
  }

  .admin-date {
    font-variant-numeric: tabular-nums;
    color: #4b5563;
  }

  .admin-role-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.2rem 0.7rem;
    border-radius: 999px;
    font-size: 0.75rem;
    border: 1px solid rgba(148, 163, 184, 0.6);
    background: #f9fafb;
    color: #374151;
  }

  .admin-role-pill.admin {
    background: rgba(16, 185, 129, 0.08);
    border-color: rgba(16, 185, 129, 0.45);
    color: #047857;
  }

  /* EMPTY / ERROR STATES */

  .admin-message-card {
    margin-top: 2rem;
    padding: 1.5rem 1.5rem;
    border-radius: 0.9rem;
    border: 1px solid rgba(248, 113, 113, 0.4);
    background: #fef2f2;
    color: #7f1d1d;
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .admin-message-card svg {
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
  }

  .admin-message-title {
    font-weight: 600;
    margin-bottom: 0.2rem;
  }

  .admin-message-text {
    font-size: 0.85rem;
  }

  .admin-loading {
    margin-top: 2rem;
    font-size: 0.9rem;
    color: #4b5563;
  }

  /* RESPONSIVE */

  @media (max-width: 900px) {
    .admin-page {
      padding: 1.2rem 1.2rem 2rem;
    }

    .admin-page-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .admin-stats-row {
      flex-direction: column;
    }

    .admin-filters {
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    .admin-search input {
      width: 100%;
      min-width: 0;
    }

    .admin-card {
      padding: 1.1rem 1rem;
    }

    .admin-table-wrapper {
      overflow-x: auto;
    }

    .admin-table {
      min-width: 760px;
    }
  }
`;

export default function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, statsRes] = await Promise.all([
          client.get("/Admin/users"),
          client.get("/Admin/stats"),
        ]);
        setUsers(usersRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Greška pri učitavanju admin podataka:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) {
      load();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user?.isAdmin) {
    return (
      <div className="admin-page">
        <style>{adminStyles}</style>
        <div className="admin-page-inner">
          <div className="admin-message-card">
            <FiAlertTriangle />
            <div>
              <div className="admin-message-title">Pristup zabranjen</div>
              <div className="admin-message-text">
                Ova stranica je dostupna samo administratorima sistema.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !searchTerm ||
      (u.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchRole =
      roleFilter === "all"
        ? true
        : roleFilter === "admin"
        ? u.isAdmin
        : !u.isAdmin;

    return matchSearch && matchRole;
  });

  return (
    <div className="admin-page">
      <style>{adminStyles}</style>

      <div className="admin-page-inner">
        {/* HEADER + STATS */}
        <div className="admin-page-header">
          <div className="admin-page-title-block">
            <div className="admin-page-title">
              <span className="admin-page-title-icon">
                <FiShield />
              </span>
              <span>Admin panel</span>
            </div>
            <p className="admin-page-subtitle">
              Pregled registrovanih korisnika, njihovih dokumenata i osnovnih
              statistika sistema.
            </p>
          </div>

          {stats && (
            <div className="admin-stats-row">
              <div className="admin-stat-card">
                <div className="admin-stat-icon-wrap users">
                  <FiUsers />
                </div>
                <div>
                  <div className="admin-stat-label">Korisnici</div>
                  <div className="admin-stat-value">{stats.totalUsers}</div>
                  <div className="admin-stat-caption">
                    Ukupan broj registrovanih korisnika
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon-wrap docs">
                  <FiFileText />
                </div>
                <div>
                  <div className="admin-stat-label">Dokumenta</div>
                  <div className="admin-stat-value">{stats.totalDocs}</div>
                  <div className="admin-stat-caption">
                    Generisanih dokumenata u sistemu
                  </div>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon-wrap templates">
                  <FiBarChart2 />
                </div>
                <div>
                  <div className="admin-stat-label">Šabloni</div>
                  <div className="admin-stat-value">
                    {stats.totalTemplates}
                  </div>
                  <div className="admin-stat-caption">
                    Aktivnih šablona dostupnih korisnicima
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* USERS TABLE */}
        <section className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title-block">
              <div className="admin-card-title">
                <FiUsers />
                <span>Korisnici sistema</span>
              </div>
              <p className="admin-card-subtitle">
                Detaljan pregled korisnika sa osnovnim podacima i brojem
                generisanih dokumenata.
              </p>
            </div>

            <div className="admin-filters">
              <div className="admin-search">
                <FiSearch className="admin-search-icon" />
                <input
                  type="text"
                  placeholder="Pretraga po imenu ili emailu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="admin-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Svi korisnici</option>
                <option value="admin">Samo administratori</option>
                <option value="user">Samo obični korisnici</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading">Učitavanje podataka...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-loading">
              Nema korisnika koji odgovaraju zadatim filterima.
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Korisnik</th>
                    <th>Uloga</th>
                    <th>Adresa</th>
                    <th>Telefon</th>
                    <th>Dokumenta</th>
                    <th>Registrovan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="admin-user-name-cell">
                          <div className="admin-user-name-main">
                            <span>{u.fullName || "Bez imena"}</span>
                            {u.isAdmin && (
                              <span className="badge-admin">
                                <FiShield />
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="admin-user-email">{u.email}</div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={
                            "admin-role-pill " +
                            (u.isAdmin ? "admin" : "user")
                          }
                        >
                          {u.isAdmin ? "Administrator" : "Korisnik"}
                        </span>
                      </td>
                      <td>{u.address || "-"}</td>
                      <td>{u.phoneNumber || "-"}</td>
                      <td className="admin-doc-count">
                        {u.documentsCount > 0 ? (
                          <>
                            {u.documentsCount}
                            <span className="admin-doc-count-muted">
                              {" "}
                              dok.
                            </span>
                          </>
                        ) : (
                          <span className="admin-doc-count-muted">0</span>
                        )}
                      </td>
                      <td className="admin-date">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("sr-RS")
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
