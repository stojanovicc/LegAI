import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FiMessageCircle } from "react-icons/fi";
import {
  FiLayout,
  FiFileText,
  FiLayers,
  FiLogOut,
  FiUser,
  FiShield,
  FiFeather,
} from "react-icons/fi";

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link
          to="/"
          className="navbar-brand"
        >
          <div className="navbar-logo">
            <FiFeather className="navbar-logo-icon" />
          </div>
          <span className="logo-word">LegAI</span>
        </Link>
        <Link to="/" className="nav-link">
          Početna
        </Link>

        <Link
          className={isActive("/templates") ? "nav-link active" : "nav-link"}
          to="/templates"
        >
          <FiLayers className="nav-link-icon" />
          <span>Šabloni</span>
        </Link>

        {user && (
          <nav className="navbar-nav">
            <Link
              className={isActive("/dashboard") ? "nav-link active" : "nav-link"}
              to="/dashboard"
            >
              <FiLayout className="nav-link-icon" />
              <span>Profil</span>
            </Link>
            <Link
              className={isActive("/documents") ? "nav-link active" : "nav-link"}
              to="/documents"
            >
              <FiFileText className="nav-link-icon" />
              <span>Moji dokumenti</span>
            </Link>
            <Link
              className={isActive("/assistant") ? "nav-link active" : "nav-link"}
              to="/assistant"
            >
              <span className="nav-link-icon">
                <FiMessageCircle />
              </span>
              <span>AI asistent</span>
            </Link>
          </nav>
        )}

        {user?.isAdmin && (
          <Link
            className={isActive("/login") ? "nav-link active" : "nav-link"}
            to="/admin/users"
          >
            Admin panel
          </Link>
        )}
      </div>

      <div className="navbar-right">
        {!user && (
          <>
            <Link
              className={isActive("/login") ? "nav-link active" : "nav-link"}
              to="/login"
            >
              Prijava
            </Link>
            <Link
              className={isActive("/register") ? "nav-link active" : "nav-link"}
              to="/register"
            >
              Registracija
            </Link>
          </>
        )}

        {user && (
          <div className="navbar-user">
            <div className="navbar-user-meta">
              <div className="navbar-user-line">
                <FiUser className="navbar-user-icon" />
                <span className="user-name">{user.fullName}</span>
                {user.isAdmin && (
                  <span className="badge badge-admin">
                    <FiShield className="badge-icon" />
                    Admin
                  </span>
                )}
              </div>
              <div className="navbar-user-email">{user.email}</div>
            </div>
            <button className="btn btn-outline btn-small" onClick={handleLogout}>
              <FiLogOut />
              <span>Odjava</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
