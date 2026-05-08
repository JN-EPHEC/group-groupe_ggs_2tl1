import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation()
  const [isConnected, setIsconnected] =useState(false)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsconnected(Boolean(token));

  }, [location.pathname]);
  const logout = ( ) =>{
    localStorage.removeItem("token");
      setIsconnected(false)
    

  }

  return (
    <header>
      {/* Announcement bar */}
      {/*
      <div className="bg-black text-white text-center py-2 text-[10px] tracking-[3px] uppercase">
        Livraison gratuite dès 80€ d'achat
      </div> 
      */}

      {/* Main nav */}
      <nav className="flex items-center justify-between px-10 h-16 bg-white border-b border-gray-200 sticky top-0 z-50">

        {/* Left links */}
        <div className="flex gap-8 flex-1">
          {[
            { label: "Accueil", href: "/" },
            { label: "Produits", href: "/produits" },
            { label: "Nouveautés", href: "/produits" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[11px] tracking-widest uppercase text-black hover:opacity-40 transition-opacity duration-200"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Logo - center */}
        <div className="flex-1 text-center">
          <span className="text-2xl tracking-[10px] uppercase font-light font-serif text-black">
            GGS
          </span>
        </div>

        {/* Right links */}
        <div className="flex items-center gap-6 flex-1 justify-end">
          {isConnected ? (
  <button
    type="button"
    onClick={logout}
    className="text-[11px] tracking-widest uppercase text-black hover:opacity-40 transition-opacity duration-200"
  >
    Deconnexion
  </button>
) : (
  <Link
    to="/login"
    className="text-[11px] tracking-widest uppercase text-black hover:opacity-40 transition-opacity duration-200"
  >
    Connection
  </Link>
)}
          <a
            href="/panier"
            className="text-[11px] tracking-widest uppercase text-black hover:opacity-40 transition-opacity duration-200"
          >
            Panier (0)
          </a>
        </div>
      </nav>
    </header>
  );
}

export default Header

//padding = p-1 1 = 0.25 rem si jamais px ou py pour largeur hauteur. lrtb pour haut bas etc. margin cest just m
