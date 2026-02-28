import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { useEffect, useState } from "react";
// Définition d'une interface pour le typage
// Sera couvert plus en profondeur en TH
interface User {
  id: number;
  name: string;
}
function App() {
  // 1. Définition de l'état
  const [data, setData] = useState<User[]>([]);
  // 2. Appel API au montage du composant
  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then(res => res.json())
      .then(result => setData(result))
      .catch(err => console.error(err));
  }, []);
  // 3. Rendu (JSX)
  return (
    <div>
      <ul>
        <h1>Liste des utilisateurs</h1>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
export default App;
