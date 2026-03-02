import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./components/Layout.jsx";
import Documents from "./pages/Documents.jsx";
import Templates from "./pages/Templates.jsx";
import TemplateCreate from "./pages/TemplateCreate.jsx";
import Generate from "./pages/Generate.jsx";
import AiAssistant from "./pages/AiAssistant.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-center">
        <p>Učitavanje...</p>
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/documents"
          element={user ? <Documents /> : <Navigate to="/login" />}
        />
        <Route path="/templates" element={<Templates />}/>
        <Route
          path="/templates/new"
          element={user ? <TemplateCreate /> : <Navigate to="/login" />}
        />
        <Route
          path="/generate/:templateId"
          element={user ? <Generate /> : <Navigate to="/login" />}
        />
        <Route
          path="/assistant"
          element={user ? <AiAssistant /> : <Navigate to="/login" />}
        />
        <Route 
          path="/admin/users" 
          element={<AdminUsers />}
        />
      </Routes>
    </Layout>
  );
}