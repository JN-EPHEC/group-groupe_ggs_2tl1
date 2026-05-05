import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Product from "./pages/Product.tsx"
import Register from "./pages/Register.tsx"

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path= "/" element = {<Home/>} />
        <Route path="/login" element ={<Login/>} />
         <Route path="/produits" element={<Product/>} />
         <Route path="/register" element={<Register/>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;