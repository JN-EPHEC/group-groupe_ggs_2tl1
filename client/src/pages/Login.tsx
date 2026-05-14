import { useState } from "react";
import type { FormEvent } from "react";
import {useNavigate} from 'react-router-dom'


const API_URL = import.meta.env.VITE_API_URL

 export default function Login(){
  const [email,    setEmail]   = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]   = useState("")
  const [sucess,  setSuccess] = useState(false)
  const navigate = useNavigate()
    // 1. Lors de la connexion
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(true);
    try{
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers : {"Content-Type": "application/json"},
        body : JSON.stringify({
          email,
          password
        }),
        
        })
        console.log(email,password)
        const data = await response.json()
        if(!response.ok){
          throw new Error( 'Identifiants incorects')
        }
        localStorage.setItem("token", data.token)  
        console.log(data.token)  
      await fetchProfile() 
      navigate("/")  

      } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    } finally {
      setSuccess(false)
    }
  }
  // 2. Lors d'un appel protege
const fetchProfile = async () => {
const token = localStorage.getItem('token');

const response = await fetch(`/api/users/me`, {
headers: {
'Authorization': `Bearer ${token}`
}
});
if (response.status === 401) {
// Le token a expire ! Il faudrait appeler la route /refresh ici.
console.log("Token expire, veuillez vous reconnecter.");
}
};
  
    return(
 
      <>
      <main className="flex min-h-screen bg-[#f5f3f0]">
        <div className="hidden md:flex w-4/12 bg-[#e8e4df] flex-col justify-end p-14">
          <p className="text-[9px] tracking-[4px] uppercase text-gray-400 mb-6">
            Connection à votre compte
          </p>
          <h1 className="text-5xl font-serif font-light leading-[1.05] text-black">
            Bienvenue<br />de retour
          </h1>
          

        </div>
        {/* Formulaire d'authentification  + lien vers /register  style via tailwind; jai généré un style*/}
      <div className="flex-1 flex items-center justify-center px-10 py-20">
        <div className="w-full max-w-sm flex flex-col gap-8">
           <form onSubmit={handleSubmit} className="flex flex-col gap-8">
             <div className="flex flex-col gap-1">
              <label className="text-[9px] tracking-[2px] uppercase text-gray-400">
                Adresse email
              </label>
              <input
                type="email"
                value = {email}
                onChange ={(e)=> setEmail(e.target.value)}
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
                value = {password}
                onChange = {(e)=> setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-transparent border-b border-gray-300 focus:border-black outline-none py-2.5 text-sm placeholder:text-gray-300 transition-colors duration-200"
              />
            </div>
            {error && 
            ( <p className="text-red-500 text-[9px] tracking-[2px] uppercase">{error}</p>

            )}
             <button
              type="submit"
              disabled={sucess}
  
              
              className="bg-black text-white text-[9px] tracking-[3px] uppercase py-4 hover:opacity-70 disabled:opacity-40 transition-opacity duration-200"
            >
             {sucess ? "Connexion..." : "Se connecter"}
            </button>
           </form>
            <p className="text-center text-[9px] tracking-[2px] uppercase text-gray-400">
            Pas encore de compte ?
            <a href='/register'> Cliquez ici
            </a>
            </p>
        </div>
      </div>
      </main>
      </> 
    )
  }



