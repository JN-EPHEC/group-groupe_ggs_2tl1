import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }


    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          addresses: [
            {
              street,
              city,
              state,
              postalCode,
              country,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Impossible de creer le compte.");
      }

      setSuccess("Compte cree avec succes.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } 
  };

  return (
    <main className="flex min-h-screen bg-[#f5f3f0]">
      <div className="hidden md:flex w-4/12 bg-[#e8e4df] flex-col justify-end p-14">
        <p className="text-[9px] tracking-[4px] uppercase text-gray-400 mb-6">
          Creation de compte
        </p>
        <h1 className="text-5xl font-serif font-light leading-[1.05] text-black">
          Rejoindre
          <br />
          GGS
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center px-10 py-20">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-[2px] uppercase text-gray-400">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Votre nom"
                required
                className="bg-transparent border-b border-gray-300 focus:border-black outline-none py-2.5 text-sm placeholder:text-gray-300 transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-[2px] uppercase text-gray-400">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                className="bg-transparent border-b border-gray-300 focus:border-black outline-none py-2.5 text-sm placeholder:text-gray-300 transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-[2px] uppercase text-gray-400">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                minLength={6}
                className="bg-transparent border-b border-gray-300 focus:border-black outline-none py-2.5 text-sm placeholder:text-gray-300 transition-colors duration-200"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-[2px] uppercase text-gray-400">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                required
                minLength={6}
                className="bg-transparent border-b border-gray-300 focus:border-black outline-none py-2.5 text-sm placeholder:text-gray-300 transition-colors duration-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-[9px] tracking-[2px] uppercase text-gray-400">
                  Rue
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Rue et numero"
                  required
                  className="bg-transparent border-b border-gray-300 focus:border-black outline-none py-2.5 text-sm placeholder:text-gray-300 transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] tracking-[2px] uppercase text-gray-400">
                  Ville
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bruxelles"
                  required
                  className="bg-transparent border-b border-gray-300 focus:border-black outline-none py-2.5 text-sm placeholder:text-gray-300 transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] tracking-[2px] uppercase text-gray-400">
                  Code postal
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="1000"
                  required
                  className="bg-transparent border-b border-gray-300 focus:border-black outline-none py-2.5 text-sm placeholder:text-gray-300 transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] tracking-[2px] uppercase text-gray-400">
                  Province / region
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Bruxelles"
                  required
                  className="bg-transparent border-b border-gray-300 focus:border-black outline-none py-2.5 text-sm placeholder:text-gray-300 transition-colors duration-200"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] tracking-[2px] uppercase text-gray-400">
                  Pays
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Belgique"
                  required
                  className="bg-transparent border-b border-gray-300 focus:border-black outline-none py-2.5 text-sm placeholder:text-gray-300 transition-colors duration-200"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-700">{success}</p>}

            <button
              type="submit"
              className="bg-black text-white text-[9px] tracking-[3px] uppercase py-4 hover:opacity-70 disabled:opacity-40 transition-opacity duration-200"
            >
           Inscription
            </button>
          </form>

          <p className="text-center text-[9px] tracking-[2px] uppercase text-gray-400">
            Deja un compte ?{" "}
            <a href="/login" className="text-black hover:opacity-40">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
