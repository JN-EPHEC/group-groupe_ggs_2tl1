import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { CART_UPDATED_EVENT, getCartCount } from "../services/cartService";
import { clearAuth, getStoredUser, isAdminUser, isAuthenticated } from "../utils/auth";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const authSnapshot = useMemo(() => {
    void location.pathname;
    const user = getStoredUser();
    const connected = isAuthenticated();
    const displayName = user?.username ?? user?.email ?? null;
    const admin = isAdminUser(user);
    return { connected, displayName, admin };
  }, [location.pathname]);

  useEffect(() => {
    const refreshCartCount = () => setCartCount(getCartCount());
    refreshCartCount();
    window.addEventListener(CART_UPDATED_EVENT, refreshCartCount);
    return () => window.removeEventListener(CART_UPDATED_EVENT, refreshCartCount);
  }, []);

  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `text-[11px] tracking-widest uppercase transition-opacity duration-200 ${
      isActive ? "text-black border-b border-black pb-0.5" : "text-black hover:opacity-40"
    }`;

  const logout = () => {
    clearAuth();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const cartLabel = cartCount > 0 ? `Panier (${cartCount})` : "Panier";

  return (
    <header>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 md:px-10 h-16">
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

          <div className="flex-1 text-center">
            <Link
              to="/"
              className="inline-block text-2xl tracking-[10px] uppercase font-light font-serif text-black"
            >
              GGS
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
            {authSnapshot.connected ? (
              <div className="flex items-center gap-6">
                <span className="text-[11px] tracking-widest uppercase text-gray-600">
                  {authSnapshot.displayName ?? "Utilisateur"}
                </span>
                <NavLink to="/compte" className={navLinkClassName}>
                  Mon compte
                </NavLink>
                {authSnapshot.admin && (
                  <NavLink to="/admin" className={navLinkClassName}>
                    Admin
                  </NavLink>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="text-[11px] tracking-widest uppercase text-black hover:opacity-40 transition-opacity duration-200"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <NavLink to="/connexion" className={navLinkClassName}>
                  Connexion
                </NavLink>
                <NavLink to="/inscription" className={navLinkClassName}>
                  Créer un compte
                </NavLink>
              </div>
            )}
            <NavLink to="/panier" className={navLinkClassName}>
              {cartLabel}
            </NavLink>
          </div>

          <div className="md:hidden flex-1" />
        </div>

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
                {cartLabel}
              </NavLink>
              {authSnapshot.connected ? (
                <div className="flex flex-col gap-3">
                  <span className="text-[11px] tracking-widest uppercase text-gray-600">
                    {authSnapshot.displayName ?? "Utilisateur"}
                  </span>
                  <NavLink
                    to="/compte"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={navLinkClassName}
                  >
                    Mon compte
                  </NavLink>
                  {authSnapshot.admin && (
                    <NavLink
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={navLinkClassName}
                    >
                      Admin
                    </NavLink>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    className="text-[11px] tracking-widest uppercase text-black hover:opacity-40 transition-opacity duration-200 text-left"
                  >
                    Déconnexion
                  </button>
                </div>
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
