function LegalNotice() {
  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-4xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          Informations
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-8">
          Mentions légales
        </h1>
        <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
          <div className="text-sm text-gray-800 leading-relaxed space-y-3">
            <p><span className="font-medium">Éditeur</span> : GGS Shop — Rue de l’Exemple 12, 1000 Bruxelles (BE).</p>
            <p><span className="font-medium">Contact</span> : contact@ggs-exemple.be — +32 0 00 00 00 00.</p>
            <p><span className="font-medium">Responsable</span> : Direction GGS (exemple).</p>
            <p><span className="font-medium">Hébergement</span> : Fournisseur Cloud (exemple) — UE.</p>
            <p><span className="font-medium">Propriété intellectuelle</span> : contenus, marques et visuels protégés.</p>
            <p><span className="font-medium">Données personnelles</span> : utilisées pour le compte et les commandes.</p>
            <p><span className="font-medium">Cookies</span> : nécessaires au fonctionnement et aux mesures d’audience.</p>
            <p><span className="font-medium">Responsabilité</span> : informations fournies “en l’état”, sous réserve d’erreurs.</p>
            <p><span className="font-medium">Liens externes</span> : GGS n’est pas responsable des sites tiers.</p>
            <p><span className="font-medium">Droit applicable</span> : Belgique. Litiges : tentative amiable prioritaire.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LegalNotice;

