import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  logout,
} from "../utils/auth";

import "./NavBar.css";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };


  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}

        <NavLink
          to="/"
          className="navbar-logo"
          onClick={() => {
            closeMenu();

            window.history.replaceState(
              null,
              "",
              "/",
            );

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          Project<span>Pilot</span>
        </NavLink>

        {/* Mobile */}

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}

        <ul
          className={`navbar-links ${menuOpen ? "navbar-links--open" : ""
            }`}
        >
          <li>
            <NavLink
              to="/"
              className="nav-link"
              onClick={() => {
                closeMenu();

                window.history.replaceState(
                  null,
                  "",
                  "/"
                );

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/#features"
              className="nav-link"
              onClick={closeMenu}>
              Features
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/#about"
              className="nav-link"
              onClick={closeMenu}>
              About
            </NavLink>
          </li>

          {isAuthenticated() ? (

            <>

              <li>
                <NavLink
                  to="/saved"
                  className="nav-link"
                  onClick={closeMenu}
                >
                  Saved Projects
                </NavLink>
              </li>

              <li>
                <button
                  className="nav-link nav-link--accent"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>

            </>

          ) : (

            <>

              <li>

                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  onClick={closeMenu}
                >
                  Login
                </NavLink>

              </li>

              <li>

                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive
                      ? "nav-link nav-link--accent active-signup"
                      : "nav-link nav-link--accent"
                  }
                  onClick={closeMenu}
                >
                  Sign Up
                </NavLink>

              </li>

            </>

          )}
        </ul>

      </div>
    </nav>
  );
}

export default NavBar;