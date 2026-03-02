import "./SidePanel.css";
import { FiX } from "react-icons/fi";

export default function SidePanel({ open, onClose, title, children }) {
  return (
    <>
      <div
        className={`sidepanel-overlay ${open ? "sidepanel-overlay--open" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidepanel ${open ? "sidepanel--open" : ""}`}>
        <div className="sidepanel-header">
          <h2>{title}</h2>
          <button type="button" className="sidepanel-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="sidepanel-content">{children}</div>
      </aside>
    </>
  );
}
