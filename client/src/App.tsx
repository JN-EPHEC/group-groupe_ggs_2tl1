import './App.css'
import { useEffect, useState } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

function App() {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users`)
      .then(res => res.json())
      .then(result => {
        console.log(result);
        setData(result);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <ul>
        <h1>Liste des utilisateurs</h1>
        {data.map((item) => (
          <li key={item.id}>{item.firstName} {item.lastName}</li>
        ))}
        <h2>Total: {data.length}</h2>
        <p>LE CD FONCTIONNE OOUUUUUU</p>
      </ul>
    </div>
  );
}

export default App;