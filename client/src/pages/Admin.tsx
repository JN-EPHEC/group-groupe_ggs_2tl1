function Admin() {
  return (
    <main className="bg-white text-black min-h-[70vh] px-6 md:px-10 py-10">
      <section className="max-w-5xl mx-auto">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-500 mb-3">
          Administration
        </p>
        <h1 className="text-3xl md:text-4xl font-serif font-normal mb-8">
          Panneau d’administration
        </h1>
        <div className="border border-gray-200 rounded-sm p-6 md:p-8 bg-[#faf9f7]">
          <p className="text-sm text-gray-700">
            Page admin (accès restreint à ajouter).
          </p>
        </div>
      </section>
    </main>
  );
}

export default Admin;

