import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './component/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CatatStockPage from './pages/CatatStockPage';
import TambahProjectPage from './pages/TambahProjectPage';
import TambahProductProjectPage from './pages/TambahProductProjectPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="/stock" element={<MainLayout />}>
          <Route path='catat' index element={<CatatStockPage />} />
        </Route>
        <Route path="/project" element={<MainLayout />}>
          <Route path='tambah' index element={<TambahProjectPage />} />
          <Route path='product' index element={<TambahProductProjectPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
