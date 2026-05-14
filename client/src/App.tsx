import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Cart from "./pages/Cart.tsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Product from "./pages/Product.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Register from "./pages/Register.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/produits" element={<Product />} />
        <Route path="/produits/:id" element={<ProductDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/success" element={<CheckoutSuccess />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
