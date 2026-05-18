function Contact() {
  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-4xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          Aide
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-8">
          Contact
        </h1>

        <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
          <p className="text-sm text-gray-700 mb-8">
            Besoin d’aide ? Voici nos coordonnées.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-sm p-5">
              <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-2">
                Email
              </p>
              <a className="text-sm text-black hover:opacity-60" href="mailto:contact@ggs-exemple.be">
                contact@ggs-exemple.be
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-5">
              <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-2">
                Téléphone
              </p>
              <a className="text-sm text-black hover:opacity-60" href="tel:+32000000000">
                +32 0 00 00 00 00
              </a>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-5">
              <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-2">
                Adresse
              </p>
              <p className="text-sm text-gray-800">
                Rue de l’Exemple 12, 1000 Bruxelles, Belgique
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-5">
              <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-2">
                Horaires
              </p>
              <p className="text-sm text-gray-800">
                Lun–Ven : 9h–18h
                <br />
                Sam : 10h–14h
                <br />
                Dim : fermé
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              Délai de réponse moyen : 24–48h ouvrées.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;

