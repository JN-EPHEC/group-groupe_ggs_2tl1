import { NavLink, Outlet } from "react-router-dom";

const adminNavClassName = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-3 text-[10px] tracking-[2px] uppercase transition-opacity duration-200 ${
    isActive
      ? "bg-black text-white"
      : "text-gray-700 hover:bg-[#f0eeeb] hover:text-black"
  }`;

const adminLinks = [
  { to: "/admin", label: "Tableau de bord", end: true as const },
  { to: "/admin/utilisateurs", label: "Utilisateurs" },
  { to: "/admin/stocks", label: "Stocks" },
  { to: "/admin/commandes", label: "Commandes" },
  { to: "/admin/categories", label: "Catégories" },
];

export default function AdminLayout() {
  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-6xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          Administration
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-8">
          Panneau d&apos;administration
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-56 shrink-0 border border-gray-200 rounded-sm overflow-hidden bg-[#faf9f7]">
            <nav className="flex flex-col">
              {adminLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end ?? false}
                  className={adminNavClassName}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <div className="flex-1 border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7] min-h-[280px]">
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
}
