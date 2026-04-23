import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Home from "./pages/Home.tsx";
import Product from "./pages/Product.tsx";

function getCurrentPath() {
  return window.location.pathname;
}

function App() {
  const pathname = getCurrentPath();

  const renderPage = () => {
    if (pathname === "/produits") {
      return <Product />;
    }

    return <Home />;
  };

  return (
    <>
      <Header />
      {renderPage()}
      <Footer />
    </>
  );
}

export default App;