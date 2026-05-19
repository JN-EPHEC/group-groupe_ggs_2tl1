import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import Account from "./pages/Account.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminCategories from "./pages/admin/AdminCategories.tsx";
import AdminOrders from "./pages/admin/AdminOrders.tsx";
import AdminProductForm from "./pages/admin/AdminProductForm.tsx";
import AdminStockList from "./pages/admin/AdminStockList.tsx";
import AdminUserDetail from "./pages/admin/AdminUserDetail.tsx";
import AdminUserList from "./pages/admin/AdminUserList.tsx";
import Cart from "./pages/Cart.tsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.tsx";
import Contact from "./pages/Contact.tsx";
import Home from "./pages/Home.tsx";
import LegalNotice from "./pages/LegalNotice.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import Product from "./pages/Product.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Register from "./pages/Register.tsx";
import TermsOfSale from "./pages/TermsOfSale.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/connexion"
          element={
            <ProtectedRoute access="guest">
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inscription"
          element={
            <ProtectedRoute access="guest">
              <Register />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Navigate to="/connexion" replace />} />
        <Route path="/register" element={<Navigate to="/inscription" replace />} />
        <Route path="/produits" element={<Product />} />
        <Route path="/produits/:id" element={<ProductDetail />} />
        <Route path="/panier" element={<Cart />} />
        <Route path="/success" element={<CheckoutSuccess />} />
        <Route
          path="/compte"
          element={
            <ProtectedRoute access="user">
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute access="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="utilisateurs" element={<AdminUserList />} />
          <Route path="utilisateurs/:id" element={<AdminUserDetail />} />
          <Route path="stocks" element={<AdminStockList />} />
          <Route path="produits/:id" element={<AdminProductForm />} />
          <Route path="commandes" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>
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
