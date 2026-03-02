import NavBar from "./NavBar.jsx";
import Footer from "./Footer.jsx";

export default function Layout({ children }) {
  return (
    <div className="app-root">
      <NavBar />
      <main className="app-main">{children}</main>
      <Footer />
    </div>
  );
}
