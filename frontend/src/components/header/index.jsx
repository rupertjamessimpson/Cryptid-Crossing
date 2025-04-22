import { useLocation } from "react-router-dom";
import "./index.css";

function Header() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="header">
      <img src="/images/Logo.png" alt="Cryptid Crossing Logo" />
      <nav className="folder-tabs">
        <a
          href="/shows"
          className={`tab ${path.startsWith("/shows") ? "" : "active"}`}
        >
          Shows
        </a>
        <a
          href="/development"
          className={`tab ${path.startsWith("/development") ? "" : "active"}`}
        >
          Development
        </a>
      </nav>
    </div>
  );
}

export default Header;
