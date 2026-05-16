function TermsOfSale() {
  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-4xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          Informations
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-8">
          Conditions générales de vente (CGV)
        </h1>
        <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
          <div className="text-sm text-gray-800 leading-relaxed space-y-3">
            <p>Les prix affichés sont en EUR TTC (hors livraison) et peuvent évoluer.</p>
            <p>La commande est confirmée après paiement et email de confirmation envoyé.</p>
            <p>Livraison indicative sous 2–5 jours ouvrés (selon transporteur).</p>
            <p>Rétractation possible sous 14 jours après réception (hors exceptions légales).</p>
            <p>Retours acceptés si produit non porté, avec étiquettes et emballage d’origine.</p>
            <p>Remboursement sous 5–10 jours ouvrés après contrôle du retour.</p>
            <p>Le service client est joignable via la page Contact ou par email.</p>
            <p>Les visuels produits sont non contractuels, description la plus fidèle possible.</p>
            <p>Les données sont traitées uniquement pour la gestion de la commande et du compte.</p>
            <p>Droit applicable : Belgique. Litige : recherche d’une solution amiable prioritaire.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TermsOfSale;

