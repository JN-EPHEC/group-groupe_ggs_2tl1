function Footer() {
  return (
    <footer className="bg-black text-white px-10 pt-14 pb-8">
      <div className="grid grid-cols-3 gap-10 mb-14">

        {/* Col 1 - Aide */}
        <div>
          <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-5">Aide</p>
          {["Contact", "FAQ", "Livraison", "Retours"].map((link) => (
            <a
              key={link}
              href="#"
              className="block text-sm text-white/60 hover:text-white mb-2.5 transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Col 2 - Informations */}
        <div>
          <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-5">Informations</p>
          {["Qui sommes-nous", "Mentions légales", "CGV", "Confidentialité"].map((link) => (
            <a
              key={link}
              href="#"
              className="block text-sm text-white/60 hover:text-white mb-2.5 transition-colors duration-200"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Col 3 - Brand */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-3xl tracking-[10px] uppercase font-light font-serif">
              GGS
            </span>
            <p className="text-xs text-gray-600 mt-3 leading-relaxed">
              Mode & style, éthique et accessible.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 pt-6 flex justify-between items-center">
        <p className="text-[11px] text-gray-600 tracking-wide">
          © {new Date().getFullYear()} Groupe GGS 2TL1. Tous droits réservés.
        </p>
        <p className="text-[11px] text-gray-600 tracking-wide">
          BE • FR • EN
        </p>
      </div>
    </footer>
  );
}

export default Footer