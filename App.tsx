
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CMSProvider } from './store/CMSContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { CustomQuote } from './pages/CustomQuote';
import { AdminDashboard } from './pages/Admin';
import { DesignHub } from './pages/DesignHub';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';

const App: React.FC = () => {
  return (
    <CMSProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/designs" element={<DesignHub />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/quote" element={<CustomQuote />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Layout>
      </Router>
    </CMSProvider>
  );
};

export default App;
