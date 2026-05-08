import { useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isConnected = useMemo(() => {
    void location.pathname; // trigger recompute on navigation
    return Boolean(localStorage.getItem("token"));
  }, [location.pathname]);

  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `text-[11px] tracking-widest uppercase transition-opacity duration-200 ${
      isActive ? "text-black border-b border-black pb-0.5" : "text-black hover:opacity-40"
    }`;

  return (
    <header>
      {/* Announcement bar */}
      {/*
      <div className="bg-black text-white text-center py-2 text-[10px] tracking-[3px] uppercase">
        Livraison gratuite dès 80€ d'achat
      </div> 
      */}

      {/* Main nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 md:px-10 h-16">
          {/* Left (desktop) */}
          <div className="hidden md:flex gap-8 flex-1">
            <NavLink to="/" className={navLinkClassName} end>
              Accueil
            </NavLink>
            <NavLink
              to="/produits"
              className={({ isActive }) =>
                navLinkClassName({ isActive: isActive || location.pathname.startsWith("/produits/") })
              }
            >
              Catalogue
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex-1">
            <button
              type="button"
              aria-label="Ouvrir le menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="inline-flex items-center justify-center w-10 h-10 border border-gray-200 hover:opacity-70 transition-opacity"
            >
              <span className="text-lg leading-none">☰</span>
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 text-center">
            <Link
              to="/"
              className="inline-block text-2xl tracking-[10px] uppercase font-light font-serif text-black"
            >
              GGS
            </Link>
          </div>

          {/* Right (desktop) */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
            {isConnected ? (
              <NavLink to="/compte" className={navLinkClassName}>
                Espace personnel
              </NavLink>
            ) : (
              <NavLink to="/connexion" className={navLinkClassName}>
                Connexion
              </NavLink>
            )}
            <NavLink to="/panier" className={navLinkClassName}>
              Panier
            </NavLink>
          </div>

          {/* Right spacer for mobile */}
          <div className="md:hidden flex-1" />
        </div>

        {/* Mobile menu panel */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-200 px-6 py-4">
            <div className="flex flex-col gap-4">
              <NavLink
                to="/"
                end
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClassName}
              >
                Accueil
              </NavLink>
              <NavLink
                to="/produits"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  navLinkClassName({ isActive: isActive || location.pathname.startsWith("/produits/") })
                }
              >
                Catalogue
              </NavLink>
              <NavLink
                to="/panier"
                onClick={() => setIsMobileMenuOpen(false)}
                className={navLinkClassName}
              >
                Panier
              </NavLink>
              {isConnected ? (
                <NavLink
                  to="/compte"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={navLinkClassName}
                >
                  Espace personnel
                </NavLink>
              ) : (
                <div className="flex flex-col gap-3">
                  <NavLink
                    to="/connexion"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={navLinkClassName}
                  >
                    Connexion
                  </NavLink>
                  <NavLink
                    to="/inscription"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={navLinkClassName}
                  >
                    Créer un compte
                  </NavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;

//padding = p-1 1 = 0.25 rem si jamais px ou py pour largeur hauteur. lrtb pour haut bas etc. margin cest just m
