import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './component/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CatatStockPage from './pages/CatatStockPage';
import TambahProjectPage from './pages/TambahProjectPage';
import TambahProductProjectPage from './pages/TambahProductProjectPage';
import CatatBahanSisaPage from './pages/CatatBahanSisaPage';
import TambahUserPage from './pages/TambahUserPage';
import TambahCustomerSupplierPage from './pages/TambahCustomerSupplierPage';
import MasterBahanPage from './pages/MasterBahanPage';
import ListProjectPage from './pages/ListProjectPage';
import LihatStockPage from './pages/LihatStockPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="/stock" element={<MainLayout />}>
          <Route path='master' index element={<MasterBahanPage />} />
          <Route path='catat' index element={<CatatStockPage />} />
          <Route path='lihat' index element={<LihatStockPage />} />
          <Route path='catatsisa' index element={<CatatBahanSisaPage />} />
        </Route>
        <Route path="/nota" element={<MainLayout />}>
          <Route path='tambah' index element={<TambahProjectPage />} />
          <Route path='lihat' index element={<TambahProductProjectPage />} />
        </Route>
        <Route path="/project" element={<MainLayout />}>
          <Route path='tambah' index element={<TambahProjectPage />} />
          <Route path='product' index element={<TambahProductProjectPage />} />
          <Route path='list' index element={<ListProjectPage />} />
        </Route>
        <Route path="/user" element={<MainLayout />} >
          <Route path='tambah' index element={<TambahUserPage />} />
          <Route path='cust' index element={<TambahCustomerSupplierPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
