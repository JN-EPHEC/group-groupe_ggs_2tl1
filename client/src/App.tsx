import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Product from "./pages/Product.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Register from "./pages/Register.tsx";
import Cart from "./pages/Cart.tsx";
import Account from "./pages/Account.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import LegalNotice from "./pages/LegalNotice.tsx";
import TermsOfSale from "./pages/TermsOfSale.tsx";
import Contact from "./pages/Contact.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/connexion" element={<Login />} />
        <Route path="/inscription" element={<Register />} />
        {/* Aliases to avoid breaking existing links */}
        <Route path="/login" element={<Navigate to="/connexion" replace />} />
        <Route path="/register" element={<Navigate to="/inscription" replace />} />
        <Route path="/produits" element={<Product />} />
        <Route path="/produits/:id" element={<ProductDetail />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/compte" element={<Account />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mentions-legales" element={<LegalNotice />} />
        <Route path="/cgv" element={<TermsOfSale />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;