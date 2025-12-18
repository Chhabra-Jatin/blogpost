import { Link, NavLink } from "react-router-dom";
import { auth, provider } from "../firebase/config";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Header = () => {
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(
    JSON.parse(localStorage.getItem("isAuth")) || false
  );

  function handleLogin() {
    signInWithPopup(auth, provider).then((result) => {
      setIsAuth(true);
      localStorage.setItem("isAuth", true);
    });
  }

  function handleLogout() {
    signOut(auth);
    setIsAuth(false);
    localStorage.setItem("isAuth", false);
    navigate("/");
  }

  return (
    <header>
      <Link to="/" className="logo">
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <i
            className="bi bi-chat-square-text-fill"
            style={{ fontSize: "2.2rem", color: "#1C59AE", marginTop: "7px" }}
          ></i>
          <span>BlogPost</span>
        </h2>
      </Link>

      <nav className="nav">
        <NavLink to="/" className="link" end>
          Home
        </NavLink>
        {isAuth ? (
          <>
            
            <NavLink to="/create" className="link">
              Create
            </NavLink>
            <button onClick={handleLogout} className="auth">
              <i className="bi bi-box-arrow-right"></i>
              <span style={{ fontWeight: "bold", marginLeft: "7px" }}>
                Logout
              </span>
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="auth">
            <i className="bi bi-google"></i>
            <span style={{ fontWeight: "bold", marginLeft: "7px" }}>Login</span>
          </button>
        )}
      </nav>
    </header>
  );
};
