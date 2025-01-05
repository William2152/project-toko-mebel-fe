import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './component/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CatatStockPage from './pages/CatatStockPage';
import TambahProjectPage from './pages/Project/TambahProjectPage';
import TambahProductProjectPage from './pages/Project/TambahProductProjectPage';
import CatatBahanSisaPage from './pages/CatatBahanSisaPage';
import TambahUserPage from './pages/TambahUserPage';
import TambahCustomerSupplierPage from './pages/TambahCustomerSupplierPage';
import MasterBahanPage from './pages/MasterBahanPage';
import ListProjectPage from './pages/Project/ListProjectPage';
import LihatStockPage from './pages/LihatStockPage';
import TambahNotaPage from './pages/TambahNotaPage';
import LihatNotaPage from './pages/LihatNotaPage';
import TambahKaryawanPage from './pages/User/TambahKaryawanPage';
import ProjectDetailPage from './pages/Project/ProjectDetailPage';
import ProdukDetailPage from './pages/Project/ProdukDetailPage';
import ProfilePage from './pages/Profile/ProfilePage';
import InputPemakaianBahan from './pages/Stock/InputPemakaianBahan';
import HistoryPemakaianBahan from './pages/Stock/HistoryPemakaianBahan';
import ListPemakaianBahanDetailPage from './pages/Stock/ListPemakaianBahanDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<MainLayout />}>
          <Route index element={<ProfilePage />} />
        </Route>
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
        <Route path="/stock" element={<MainLayout />}>
          <Route path='master' index element={<MasterBahanPage />} />
          <Route path='catat' index element={<CatatStockPage />} />
          <Route path='lihat' index element={<LihatStockPage />} />
          <Route path='catatsisa' index element={<CatatBahanSisaPage />} />
          <Route path='pemakaian' index element={<InputPemakaianBahan />} />
          <Route path='history' index element={<HistoryPemakaianBahan />} />
          <Route path='detail/pemakaian/:id' index element={<ListPemakaianBahanDetailPage />} />
        </Route>
        <Route path="/nota" element={<MainLayout />}>
          <Route path='tambah' index element={<TambahNotaPage />} />
          <Route path='lihat' index element={<LihatNotaPage />} />
        </Route>
        <Route path="/project" element={<MainLayout />}>
          <Route path='tambah' index element={<TambahProjectPage />} />
          <Route path='product' index element={<TambahProductProjectPage />} />
          <Route path='list' index element={<ListProjectPage />} />
          <Route path='detail/:id' index element={<ProjectDetailPage />} />
          <Route path='product/detail/:id' index element={<ProdukDetailPage />} />
        </Route>
        <Route path="/user" element={<MainLayout />} >
          <Route path='tambah' index element={<TambahUserPage />} />
          <Route path='cust' index element={<TambahCustomerSupplierPage />} />
          <Route path='karyawan' index element={<TambahKaryawanPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
