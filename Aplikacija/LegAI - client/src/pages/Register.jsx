import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FiUser,
  FiMail,
  FiLock,
  FiMapPin,
  FiPhone,
  FiAlertCircle,
  FiArrowRightCircle,
} from "react-icons/fi";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    address: "",
    phoneNumber: "",
  });
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
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Registracija nije uspela. Proveri podatke ili email.");
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
            <h2>Registracija naloga</h2>
            <p className="auth-subtitle">
              Kreiraj novi AppAI Legal nalog za rad sa pravnim dokumentima.
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
            <label htmlFor="fullName">Ime i prezime</label>
            <div className="input-with-icon">
              <FiUser className="input-icon" />
              <input
                id="fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                placeholder="npr. Marko Marković"
              />
            </div>
          </div>

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
                minLength={6}
                placeholder="Minimalno 6 karaktera"
              />
            </div>
            <p className="field-hint">
              Preporuka: kombinacija velikih i malih slova, brojeva i simbola.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="address">Adresa</label>
            <div className="input-with-icon">
              <FiMapPin className="input-icon" />
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Ulica i broj (opciono)"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Telefon</label>
            <div className="input-with-icon">
              <FiPhone className="input-icon" />
              <input
                id="phoneNumber"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+381 6x xxx xxxx"
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
                Kreiranje naloga...
              </>
            ) : (
              <>
                Registruj se
                <FiArrowRightCircle className="btn-icon" />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Već imaš nalog?{" "}
          <Link to="/login" className="link-primary">
            Prijavi se
          </Link>
        </p>
      </div>
    </div>
  );
}
