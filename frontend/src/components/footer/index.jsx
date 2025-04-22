import { useEffect, useState } from "react";
import "./index.css";
import API_BASE_URL from "../../config";

function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/me`, {
          credentials: "include",
        });
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
      window.location.href = "/"; // or window.location.reload();
    } catch (err) {
      console.error("Logout failed");
    }
  };

  return (
    <div className="footer">
      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="logout-link">
            Logout
          </button>
        ) : (
          <a href="/login">Part of the band?</a>
        )}
      </div>
    </div>
  );
}

export default Footer;