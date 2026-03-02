// src/pages/Generate.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import {
  FiFileText,
  FiSliders,
  FiAlertCircle,
  FiDownload,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";

const generateStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --wizard-blue: #2563eb;
    --wizard-blue-dark: #1d4ed8;
    --wizard-indigo: #4f46e5;
    --wizard-bg-soft: #eff6ff;
    --wizard-surface: rgba(255, 255, 255, 0.92);
    --wizard-border-soft: rgba(148, 163, 184, 0.55);
    --wizard-radius-lg: 1.25rem;
    --wizard-radius-md: 0.9rem;
  }

  .generate-page {
    min-height: calc(100vh - 64px);
    padding: 1.8rem 2.2rem 2.2rem;
    background:
      radial-gradient(circle at top left, #bfdbfe 0, transparent 55%),
      radial-gradient(circle at bottom right, #e0f2fe 0, transparent 50%),
      linear-gradient(135deg, #f3f4f6, #e5e7eb);
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #0f172a;
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
  }

  .generate-inner {
    max-width: 1180px;
    margin: 0 auto;
    width: 100%;
  }

  .generate-card {
    position: relative;
    background: var(--wizard-surface);
    border-radius: var(--wizard-radius-lg);
    border: 1px solid var(--wizard-border-soft);
    box-shadow:
      0 24px 60px rgba(15, 23, 42, 0.18),
      0 0 0 1px rgba(255, 255, 255, 0.4);
    padding: 1.4rem 1.6rem 1.4rem;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    overflow: hidden;
  }

  .generate-card::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      radial-gradient(circle at top right, rgba(59, 130, 246, 0.12), transparent 55%),
      radial-gradient(circle at bottom left, rgba(79, 70, 229, 0.10), transparent 55%);
    opacity: 0.9;
    mix-blend-mode: soft-light;
  }

  .generate-card-inner {
    position: relative;
    z-index: 1;
  }

  /* HEADER */

  .generate-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1.1rem;
  }

  .generate-header-main {
    display: flex;
    gap: 0.8rem;
    align-items: center;
  }

  .generate-header-icon-wrap {
    position: relative;
  }

  .generate-header-orbit {
    position: absolute;
    inset: -0.3rem;
    border-radius: 999px;
    border: 1px dashed rgba(37, 99, 235, 0.3);
    animation: orbitSpin 7s linear infinite;
  }

  .generate-header-icon {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 999px;
    background: radial-gradient(circle at 30% 0%, #60a5fa, var(--wizard-blue));
    color: #eff6ff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 0 0 1px rgba(191, 219, 254, 0.4),
      0 14px 30px rgba(37, 99, 235, 0.5);
    animation: glowPulse 4s ease-in-out infinite;
  }

  .generate-header-texts {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .generate-eyebrow {
    font-size: 0.74rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .generate-eyebrow-pill {
    padding: 0.12rem 0.6rem;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.08);
    color: var(--wizard-blue);
    font-weight: 500;
    font-size: 0.72rem;
  }

  .generate-title {
    font-size: 1.35rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .generate-title span.magic {
    font-size: 1.1rem;
  }

  .generate-subtitle {
    font-size: 0.86rem;
    color: #4b5563;
    max-width: 540px;
  }

  .generate-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    border-radius: 999px;
    border: 1px solid rgba(209, 213, 219, 0.9);
    background: rgba(249, 250, 251, 0.96);
    padding: 0.4rem 0.95rem;
    font-size: 0.8rem;
    cursor: pointer;
    color: #111827;
    box-shadow: 0 8px 18px rgba(148, 163, 184, 0.35);
    transition: all 180ms ease-out;
    backdrop-filter: blur(14px);
  }

  .generate-back-btn:hover {
    background: #f3f4f6;
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(148, 163, 184, 0.45);
  }

  .generate-back-btn svg {
    width: 1rem;
    height: 1rem;
  }

  /* STEPS */

  .generate-steps-wrapper {
    margin-bottom: 1rem;
    margin-top: 0.2rem;
  }

  .generate-steps-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.45rem;
    font-size: 0.78rem;
    color: #6b7280;
  }

  .generate-steps-label-row span:last-child {
    font-weight: 500;
    color: #111827;
  }

  .generate-progress-track {
    position: relative;
    height: 0.28rem;
    border-radius: 999px;
    background: rgba(209, 213, 219, 0.7);
    overflow: hidden;
  }

  .generate-progress-bar {
    position: absolute;
    inset: 0;
    width: 0;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--wizard-blue), var(--wizard-indigo));
    box-shadow: 0 0 0 1px rgba(191, 219, 254, 0.4);
    transition: width 260ms ease-out;
  }

  .generate-steps {
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    margin-top: 0.9rem;
  }

  .generate-step {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    min-width: 0;
    flex: 1;
    position: relative;
  }

  .generate-step:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 0.9rem;
    left: 2.05rem;
    right: -50%;
    height: 2px;
    background: linear-gradient(90deg, rgba(209, 213, 219, 0.8), rgba(209, 213, 219, 0.1));
    z-index: 0;
  }

  .generate-step-circle {
    position: relative;
    z-index: 1;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 999px;
    border: 2px solid rgba(209, 213, 219, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    color: #6b7280;
    background: #f9fafb;
    box-shadow: 0 6px 12px rgba(148, 163, 184, 0.35);
    transition: all 180ms ease-out;
  }

  .generate-step-label {
    font-size: 0.76rem;
    color: #6b7280;
    max-width: 140px;
  }

  .generate-step--active .generate-step-circle {
    border-color: transparent;
    background: radial-gradient(circle at 30% 0%, #93c5fd, var(--wizard-blue));
    color: #ffffff;
    box-shadow:
      0 0 0 1px rgba(191, 219, 254, 0.8),
      0 10px 22px rgba(37, 99, 235, 0.55);
    transform: translateY(-1px) scale(1.02);
  }

  .generate-step--active .generate-step-label {
    color: #111827;
    font-weight: 500;
  }

  .generate-step--done .generate-step-circle {
    border-color: transparent;
    background: linear-gradient(135deg, #16a34a, #22c55e);
    color: #ffffff;
    box-shadow:
      0 0 0 1px rgba(187, 247, 208, 0.9),
      0 10px 22px rgba(22, 163, 74, 0.55);
  }

  .generate-step--done .generate-step-label {
    color: #15803d;
    font-weight: 500;
  }

  /* CONTENT WRAP */

  .generate-content {
    padding-top: 0.9rem;
    margin-top: 0.4rem;
    border-top: 1px solid rgba(229, 231, 235, 0.85);
    display: grid;
    grid-template-columns: minmax(0, 1.8fr) minmax(0, 1.1fr);
    gap: 1.4rem;
  }

  .generate-step-section {
    animation: fadeInUp 220ms ease-out;
  }

  .generate-aside {
    border-radius: var(--wizard-radius-md);
    border: 1px solid rgba(209, 213, 219, 0.85);
    background: linear-gradient(145deg, rgba(239, 246, 255, 0.95), rgba(248, 250, 252, 0.95));
    padding: 0.85rem 0.95rem;
    font-size: 0.8rem;
    color: #4b5563;
    box-shadow:
      0 10px 28px rgba(148, 163, 184, 0.35),
      0 0 0 1px rgba(255, 255, 255, 0.7);
  }

  .generate-aside-title {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #6b7280;
    margin-bottom: 0.35rem;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .generate-aside-title span.dot {
    width: 0.28rem;
    height: 0.28rem;
    border-radius: 999px;
    background: var(--wizard-blue);
  }

  .generate-aside-list {
    margin: 0.2rem 0 0.4rem;
    padding-left: 1rem;
  }

  .generate-aside-list li {
    margin-bottom: 0.18rem;
  }

  .generate-aside-footnote {
    font-size: 0.76rem;
    color: #6b7280;
    margin-top: 0.3rem;
  }

  /* TEMPLATE INFO */

  .generate-template-meta {
    border-radius: var(--wizard-radius-md);
    border: 1px solid rgba(209, 213, 219, 0.9);
    background: linear-gradient(145deg, rgba(248, 250, 252, 0.96), rgba(239, 246, 255, 0.98));
    padding: 0.75rem 0.85rem 0.7rem;
    margin-bottom: 0.7rem;
    box-shadow: 0 10px 24px rgba(148, 163, 184, 0.28);
  }

  .generate-template-name {
    display: flex;
    flex-direction: column;
    gap: 0.18rem;
  }

  .generate-template-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #6b7280;
  }

  .generate-template-name span:last-child {
    font-weight: 600;
    font-size: 1.02rem;
  }

  .generate-template-description {
    margin-top: 0.4rem;
    font-size: 0.83rem;
    color: #4b5563;
  }

  .generate-info-list {
    padding-left: 1.1rem;
    margin: 0.35rem 0 0.5rem;
    font-size: 0.83rem;
    color: #4b5563;
  }

  .generate-info-list li {
    margin-bottom: 0.22rem;
  }

  .generate-info-footnote {
    font-size: 0.78rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  /* STEP DESCRIPTION */

  .generate-step-description {
    font-size: 0.84rem;
    color: #4b5563;
    margin-bottom: 0.7rem;
  }

  /* FORM (STEP 2) */

  .generate-form {
    margin-top: 0.1rem;
  }

  .generate-form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem 1.05rem;
  }

  .generate-form .form-group {
    margin-bottom: 0;
  }

  .generate-form label {
    display: block;
    font-size: 0.8rem;
    margin-bottom: 0.23rem;
    color: #4b5563;
    font-weight: 500;
  }

  .generate-input-with-icon {
    position: relative;
  }

  .generate-input-with-icon input {
    width: 100%;
    padding: 0.48rem 0.85rem 0.48rem 2.0rem;
    border-radius: 0.7rem;
    border: 1px solid rgba(148, 163, 184, 0.95);
    font-size: 0.84rem;
    outline: none;
    background: rgba(255, 255, 255, 0.98);
    box-sizing: border-box;
    box-shadow:
      0 8px 18px rgba(148, 163, 184, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.8);
    transition: all 170ms ease-out;
  }

  .generate-input-with-icon input:focus {
    border-color: var(--wizard-blue);
    box-shadow:
      0 0 0 1px rgba(37, 99, 235, 0.18),
      0 12px 26px rgba(37, 99, 235, 0.32);
    background: #ffffff;
  }

  .generate-input-icon {
    position: absolute;
    left: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: #9ca3af;
  }

  /* REVIEW (STEP 3) */

  .generate-review-grid {
    margin-top: 0.3rem;
    border-radius: var(--wizard-radius-md);
    border: 1px solid rgba(229, 231, 235, 0.9);
    padding: 0.75rem 0.85rem;
    background: linear-gradient(145deg, rgba(249, 250, 251, 0.96), rgba(239, 246, 255, 0.97));
    max-height: 260px;
    overflow-y: auto;
    box-shadow: 0 10px 24px rgba(148, 163, 184, 0.28);
  }

  .generate-review-grid dl {
    margin: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.45rem 1.1rem;
    font-size: 0.82rem;
  }

  .generate-review-item dt {
    font-weight: 600;
    color: #111827;
  }

  .generate-review-item dd {
    margin-left: 0;
    color: #4b5563;
  }

  .generate-review-empty {
    font-size: 0.84rem;
    color: #4b5563;
  }

  /* RESULT (STEP 4) */

  .generate-result {
    margin-top: 0.3rem;
  }

  .generate-result-header {
    display: flex;
    gap: 0.8rem;
    align-items: center;
    margin-bottom: 0.8rem;
  }

  .generate-result-icon {
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 999px;
    background: #dcfce7;
    color: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
      0 0 0 1px rgba(187, 247, 208, 0.8),
      0 12px 26px rgba(22, 163, 74, 0.45);
  }

  .generate-result-title {
    font-size: 1.06rem;
    font-weight: 600;
  }

  .generate-result-subtitle {
    font-size: 0.84rem;
    color: #4b5563;
  }

  .generate-result-meta {
    border-radius: var(--wizard-radius-md);
    border: 1px solid rgba(229, 231, 235, 0.9);
    background: linear-gradient(145deg, rgba(249, 250, 251, 0.98), rgba(239, 246, 255, 0.98));
    padding: 0.75rem 0.85rem;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.6rem;
    font-size: 0.82rem;
    box-shadow: 0 10px 24px rgba(148, 163, 184, 0.28);
  }

  .generate-result-meta > div {
    display: flex;
    flex-direction: column;
    gap: 0.16rem;
  }

  .generate-result-meta span:last-child {
    font-weight: 500;
    color: #111827;
  }

  .generate-result-downloads {
    display: inline-flex;
    gap: 0.45rem;
    flex-wrap: wrap;
  }

  .generate-result-downloads button {
    border-radius: 999px;
    border: 1px solid var(--wizard-blue);
    background: linear-gradient(135deg, var(--wizard-blue), var(--wizard-blue-dark));
    color: #ffffff;
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    cursor: pointer;
    box-shadow: 0 12px 28px rgba(37, 99, 235, 0.45);
    transition: all 170ms ease-out;
  }

  .generate-result-downloads button svg {
    width: 0.95rem;
    height: 0.95rem;
  }

  .generate-result-downloads button:hover {
    background: linear-gradient(135deg, var(--wizard-blue-dark), var(--wizard-indigo));
    transform: translateY(-1px);
  }

  /* ACTIONS */

  .generate-actions {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.6rem;
    flex-wrap: wrap;
  }

  .generate-btn-primary,
  .generate-btn-outline {
    border-radius: 999px;
    padding: 0.46rem 1.1rem;
    font-size: 0.84rem;
    border: 1px solid transparent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    transition: all 170ms ease-out;
    white-space: nowrap;
  }

  .generate-btn-primary {
    background: linear-gradient(135deg, var(--wizard-blue), var(--wizard-indigo));
    color: #ffffff;
    box-shadow: 0 14px 34px rgba(37, 99, 235, 0.55);
  }

  .generate-btn-primary:disabled {
    opacity: 0.75;
    box-shadow: none;
    cursor: default;
  }

  .generate-btn-primary:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 40px rgba(37, 99, 235, 0.65);
  }

  .generate-btn-outline {
    background: rgba(249, 250, 251, 0.98);
    border-color: rgba(209, 213, 219, 0.9);
    color: #111827;
    box-shadow: 0 10px 24px rgba(148, 163, 184, 0.35);
  }

  .generate-btn-outline:hover {
    background: #e5e7eb;
    transform: translateY(-1px);
  }

  /* ALERT */

  .generate-alert-error {
    margin-top: 0.6rem;
    display: flex;
    align-items: flex-start;
    gap: 0.4rem;
    padding: 0.5rem 0.7rem;
    border-radius: 0.7rem;
    background: #fef2f2;
    border: 1px solid #fecaca;
    font-size: 0.8rem;
    color: #b91c1c;
  }

  .generate-alert-error svg {
    margin-top: 0.06rem;
  }

  /* LOADING / EMPTY */

  .generate-loading,
  .generate-empty {
    padding: 2.3rem 1.8rem;
    text-align: center;
    font-size: 0.9rem;
    color: #4b5563;
  }

  /* ANIMATIONS */

  @keyframes glowPulse {
    0%, 100% {
      box-shadow:
        0 0 0 0 rgba(59, 130, 246, 0.45),
        0 18px 40px rgba(37, 99, 235, 0.65);
    }
    50% {
      box-shadow:
        0 0 0 6px rgba(191, 219, 254, 0.0),
        0 24px 52px rgba(37, 99, 235, 0.85);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes orbitSpin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* RESPONSIVE */

  @media (max-width: 960px) {
    .generate-page {
      padding: 1.4rem 1.2rem 1.8rem;
    }

    .generate-card {
      padding: 1.2rem 1.25rem 1.3rem;
    }

    .generate-content {
      grid-template-columns: minmax(0, 1fr);
      gap: 1.1rem;
    }

    .generate-aside {
      order: -1;
    }

    .generate-result-meta {
      grid-template-columns: 1fr;
    }

    .generate-form-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .generate-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8rem;
    }

    .generate-back-btn {
      align-self: stretch;
      justify-content: center;
    }

    .generate-steps {
      flex-direction: column;
      gap: 0.6rem;
    }

    .generate-step:not(:last-child)::after {
      display: none;
    }
  }
`;

export default function Generate() {
  const { templateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [template, setTemplate] = useState(null);
  const [fields, setFields] = useState({});
  const [loadingTemplate, setLoadingTemplate] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [prefillFromDocDone, setPrefillFromDocDone] = useState(false);

  const [step, setStep] = useState(1); // 1: uvod, 2: unos, 3: pregled, 4: rezultat

  const searchParams = new URLSearchParams(location.search);
  const fromDocId = searchParams.get("from");

  // Učitavanje šablona
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const res = await client.get(`/Templates/${templateId}`);
        setTemplate(res.data);
      } catch (err) {
        console.error(err);
        setError("Greška pri učitavanju šablona.");
      } finally {
        setLoadingTemplate(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  const downloadResult = async (type) => {
    if (!result) return;
    try {
      const res = await client.get(
        `/Documents/${result.id}/download/${type}`,
        { responseType: "blob" }
      );

      const mimeType =
        type === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/pdf";

      const blob = new Blob([res.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${result.title}.${type}`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Greška pri preuzimanju fajla:", err);
      alert("Preuzimanje dokumenta nije uspelo.");
    }
  };

  // Izdvajanje placeholdera {{NazivPolja}}
  const placeholders = useMemo(() => {
    if (!template?.content) return [];
    const regex = /\{\{(.*?)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(template.content)) !== null) {
      const name = match[1].trim();
      if (name && !matches.includes(name)) {
        matches.push(name);
      }
    }
    return matches;
  }, [template]);

  // Auto-popuna iz profila
  useEffect(() => {
    if (placeholders.length === 0) return;

    const initial = {};

    if (user) {
      placeholders.forEach((name) => {
        const keyLower = name.toLowerCase();
        if (
          keyLower === "fullname" ||
          keyLower === "ime" ||
          keyLower === "imeiprezime"
        ) {
          initial[name] = user.fullName;
        } else if (keyLower === "email") {
          initial[name] = user.email;
        } else if (keyLower === "address" || keyLower === "adresa") {
          initial[name] = user.address || "";
        } else if (
          keyLower === "phone" ||
          keyLower === "phonenumber" ||
          keyLower === "telefon"
        ) {
          initial[name] = user.phoneNumber || "";
        }
      });
    }

    setFields((prev) => ({ ...initial, ...prev }));
  }, [placeholders, user]);

  // Prefill iz postojećeg dokumenta (Ponovo otvori)
  useEffect(() => {
    const prefillFromDoc = async () => {
      if (!fromDocId || prefillFromDocDone) return;

      try {
        const res = await client.get(`/Documents/${fromDocId}`);
        const doc = res.data;

        if (doc.templateId.toString() !== templateId.toString()) {
          console.warn("Dokument i šablon se ne poklapaju.");
          return;
        }

        setFields((prev) => ({
          ...prev,
          ...doc.fields,
        }));
      } catch (err) {
        console.error("Greška pri učitavanju postojećeg dokumenta:", err);
      } finally {
        setPrefillFromDocDone(true);
      }
    };

    prefillFromDoc();
  }, [fromDocId, templateId, prefillFromDocDone]);

  const handleChange = (e, name) => {
    const value = e.target.value;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handler za WIZARD:
  const handleWizardSubmit = async (e) => {
    e.preventDefault();

    // sa koraka 2 prelazimo na pregled (3)
    if (step === 2) {
      setStep(3);
      return;
    }

    // sa koraka 3 zaista generišemo dokument
    if (step === 3) {
      setSubmitting(true);
      setError(null);
      setResult(null);

      try {
        const payload = {
          templateId: parseInt(templateId, 10),
          fields: fields,
        };
        const res = await client.post("/Documents/generate", payload);
        setResult(res.data);
        setStep(4);
      } catch (err) {
        console.error(err);
        setError("Greška pri generisanju dokumenta.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loadingTemplate) {
    return (
      <div className="generate-page">
        <style>{generateStyles}</style>
        <div className="generate-inner">
          <section className="generate-card">
            <div className="generate-card-inner">
              <div className="generate-loading">Učitavanje šablona...</div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="generate-page">
        <style>{generateStyles}</style>
        <div className="generate-inner">
          <section className="generate-card">
            <div className="generate-card-inner">
              <div className="generate-empty">Šablon nije pronađen.</div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, label: "Pregled šablona" },
    { id: 2, label: "Popunjavanje podataka" },
    { id: 3, label: "Pregled unetih podataka" },
    { id: 4, label: "Generisani dokument" },
  ];

  const progressPercent = (step / steps.length) * 100;

  return (
    <div className="generate-page">
      <style>{generateStyles}</style>

      <div className="generate-inner">
        <section className="generate-card">
          <div className="generate-card-inner">
            <div className="generate-header">
              <div className="generate-header-main">
                <div className="generate-header-icon-wrap">
                  <div className="generate-header-orbit" />
                  <div className="generate-header-icon">
                    <FiFileText />
                  </div>
                </div>
                <div className="generate-header-texts">
                  <div className="generate-eyebrow">
                    Čarobnjak za dokumente
                    <span className="generate-eyebrow-pill">AI šablon</span>
                  </div>
                  <div className="generate-title">
                    Generisanje pravnog dokumenta
                    <span className="magic">✨</span>
                  </div>
                  <div className="generate-subtitle">
                    Čarobnjak te vodi kroz popunjavanje podataka i generisanje
                    gotovog dokumenta, korak po korak – bez propuštenih polja.
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="generate-back-btn"
                onClick={() => navigate(-1)}
              >
                <FiArrowLeft />
                Nazad
              </button>
            </div>

            {/* STEP INFO + PROGRESS */}
            <div className="generate-steps-wrapper">
              <div className="generate-steps-label-row">
                <span>
                  Korak {step} od {steps.length}
                </span>
                <span>{steps.find((s) => s.id === step)?.label}</span>
              </div>
              <div className="generate-progress-track">
                <div
                  className="generate-progress-bar"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="generate-steps">
                {steps.map((s) => {
                  const isActive = s.id === step;
                  const isDone = s.id < step;
                  return (
                    <div
                      key={s.id}
                      className={
                        "generate-step " +
                        (isActive ? "generate-step--active " : "") +
                        (isDone ? "generate-step--done" : "")
                      }
                    >
                      <div className="generate-step-circle">
                        {isDone ? <FiCheckCircle /> : s.id}
                      </div>
                      <div className="generate-step-label">{s.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="generate-alert-error">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}

            {/* MAIN CONTENT + ASIDE */}
            <div className="generate-content">
              <div>
                {/* STEP 1 */}
                {step === 1 && (
                  <div className="generate-step-section">
                    <div className="generate-template-meta">
                      <div className="generate-template-name">
                        <span className="generate-template-label">Šablon</span>
                        <span>{template.name}</span>
                      </div>
                      {template.description && (
                        <p className="generate-template-description">
                          {template.description}
                        </p>
                      )}
                    </div>

                    <ul className="generate-info-list">
                      <li>
                        Sistem će prema ovom šablonu automatski kreirati pravni
                        dokument na osnovu unetih podataka.
                      </li>
                      <li>
                        Podaci iz profila (ime, adresa, telefon) se predlažu
                        automatski, ali ih možeš izmeniti.
                      </li>
                      <li>
                        Pre samog generisanja imaćeš pregled svih unetih polja.
                      </li>
                    </ul>

                    {placeholders.length > 0 ? (
                      <p className="generate-info-footnote">
                        Ovaj šablon sadrži{" "}
                        <strong>{placeholders.length}</strong> polja za
                        popunjavanje.
                      </p>
                    ) : (
                      <p className="generate-info-footnote">
                        Ovaj šablon nema dodatna polja – dokument će biti
                        generisan odmah.
                      </p>
                    )}

                    <div className="generate-actions">
                      <button
                        type="button"
                        className="generate-btn-primary"
                        onClick={() =>
                          setStep(placeholders.length > 0 ? 2 : 3)
                        }
                      >
                        Započni popunjavanje
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <div className="generate-step-section">
                    <p className="generate-step-description">
                      Korak 2 od 4 – popuni tražena polja. Polja su definisana
                      na osnovu izabranog šablona.
                    </p>

                    <form className="generate-form" onSubmit={handleWizardSubmit}>
                      <div className="generate-form-grid">
                        {placeholders.map((name) => (
                          <div className="form-group" key={name}>
                            <label htmlFor={`field-${name}`}>{name}</label>
                            <div className="generate-input-with-icon">
                              <FiSliders className="generate-input-icon" />
                              <input
                                id={`field-${name}`}
                                value={fields[name] || ""}
                                onChange={(e) => handleChange(e, name)}
                                required
                                placeholder={`Unesi vrednost za "${name}"`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="generate-actions">
                        <button
                          type="button"
                          className="generate-btn-outline"
                          onClick={() => setStep(1)}
                        >
                          Nazad
                        </button>
                        <button
                          className="generate-btn-primary"
                          type="submit"
                          disabled={placeholders.length === 0}
                        >
                          Nastavi na pregled
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                  <div className="generate-step-section">
                    <p className="generate-step-description">
                      Korak 3 od 4 – proveri unete podatke pre generisanja
                      dokumenta. Ako je potrebno, vrati se nazad i izmeni polja.
                    </p>

                    {placeholders.length === 0 ? (
                      <div className="generate-review-empty">
                        Ovaj šablon nema polja za prikaz. Možeš odmah da
                        generišeš dokument.
                      </div>
                    ) : (
                      <div className="generate-review-grid">
                        <dl>
                          {placeholders.map((name) => (
                            <div key={name} className="generate-review-item">
                              <dt>{name}</dt>
                              <dd>
                                {fields[name] || <em>(nije uneseno)</em>}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}

                    <form onSubmit={handleWizardSubmit}>
                      <div className="generate-actions">
                        <button
                          type="button"
                          className="generate-btn-outline"
                          onClick={() => setStep(2)}
                        >
                          Nazad na izmenu
                        </button>
                        <button
                          className="generate-btn-primary"
                          type="submit"
                          disabled={submitting}
                        >
                          {submitting ? "Generisanje..." : "Generiši dokument"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* STEP 4 */}
                {step === 4 && result && (
                  <div className="generate-step-section">
                    <div className="generate-result">
                      <div className="generate-result-header">
                        <div className="generate-result-icon">
                          <FiCheckCircle />
                        </div>
                        <div>
                          <div className="generate-result-title">
                            Dokument je uspešno generisan
                          </div>
                          <div className="generate-result-subtitle">
                            Sačuvan je u listi tvojih dokumenata i možeš ga
                            preuzeti u DOCX formatu.
                          </div>
                        </div>
                      </div>

                      <div className="generate-result-meta">
                        <div>
                          <span className="generate-template-label">Naziv</span>
                          <span>{result.title}</span>
                        </div>
                        <div>
                          <span className="generate-template-label">Datum</span>
                          <span>
                            {new Date(result.generatedAt).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="generate-template-label">
                            Preuzimanje
                          </span>
                          <span className="generate-result-downloads">
                            <button
                              type="button"
                              onClick={() => downloadResult("docx")}
                            >
                              <FiDownload />
                              DOCX
                            </button>
                          </span>
                        </div>
                      </div>

                      <div className="generate-actions">
                        <button
                          className="generate-btn-primary"
                          type="button"
                          onClick={() => navigate("/documents")}
                        >
                          Moji dokumenti
                        </button>
                        <button
                          className="generate-btn-outline"
                          type="button"
                          onClick={() => {
                            setResult(null);
                            setStep(1);
                          }}
                        >
                          Novi dokument iz istog šablona
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ASIDE – kontekst i saveti */}
              <aside className="generate-aside">
                <div className="generate-aside-title">
                  <span className="dot" />
                  Vodič kroz čarobnjak
                </div>
                <ul className="generate-aside-list">
                  <li>
                    Pažljivo pročitaj opis šablona pre nego što kreneš sa
                    popunjavanjem.
                  </li>
                  <li>
                    Ako koristiš podatke iz profila, proveri da li su ažurni
                    (adresa, telefon, email).
                  </li>
                  <li>
                    Pre generisanja dokumenta, obavezno pregledaj sva polja na
                    trećem koraku.
                  </li>
                  <li>
                    Gotov dokument možeš kasnije ponovo otvoriti i prilagoditi.
                  </li>
                </ul>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
