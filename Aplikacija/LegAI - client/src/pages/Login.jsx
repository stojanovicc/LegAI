import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiLogIn,
  FiUser,
} from "react-icons/fi";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Pogrešan email ili lozinka.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-card-logo">
            <div className="auth-logo-orbit" />
            <div className="auth-logo-badge">
              <FiUser  />
            </div>
          </div>
          <div className="auth-card-header-texts">
            <h2>Prijava u sistem</h2>
            <p className="auth-subtitle">
              Unesi kredencijale za pristup AppAI Legal okruženju.
            </p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <FiAlertCircle className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email adresa</label>
            <div className="input-with-icon">
              <FiMail className="input-icon" />
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="ime.prezime@primer.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Lozinka</label>
            <div className="input-with-icon">
              <FiLock className="input-icon" />
              <input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Unesi lozinku"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="btn-loader" />
                Prijavljivanje...
              </>
            ) : (
              <>
                Prijavi se
                <FiLogIn className="btn-icon" />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Nemaš nalog?{" "}
          <Link to="/register" className="link-primary">
            Registruj se
          </Link>
        </p>
      </div>
    </div>
  );
}
