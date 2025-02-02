import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./component/MainLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import CatatStockPage from "./pages/Stock/CatatStockPage";
import TambahProjectPage from "./pages/Project/TambahProjectPage";
import TambahProductProjectPage from "./pages/Project/TambahProductProjectPage";
import ListProjectPage from "./pages/Project/ListProjectPage";
import LihatStockPage from "./pages/Stock/LihatStockPage";
import TambahKaryawanPage from "./pages/User/TambahKaryawanPage";
import ProjectDetailPage from "./pages/Project/ProjectDetailPage";
import ProdukDetailPage from "./pages/Project/ProdukDetailPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import InputPemakaianBahan from "./pages/Stock/InputPemakaianBahan";
import HistoryPemakaianBahan from "./pages/Stock/HistoryPemakaianBahan";
import ListPemakaianBahanDetailPage from "./pages/Stock/ListPemakaianBahanDetailPage";
import DetailNotaPage from "./pages/Nota/DetailNotaPage";
import HistoryAllBahanMasuk from "./pages/Stock/HistoryAllBahanMasuk";
import HistoryAllBahanMasukDetailPage from "./pages/Stock/HistoryAllBahanMasukDetailPage";
import HistoryAllBahanKeluarPage from "./pages/Stock/HistoryAllBahanKeluarPage";
import ProtectedRoute from "./component/ProtectedRoute";
import HistoryAllBahanKeluarDetailPage from "./pages/Stock/HistoryAllBahanKeluarDetailPage";
import LihatBahanSisaPage from "./pages/Stock/LihatBahanSisaPage";
import GenerateLaporanHppPage from "./pages/Report/GenerateLaporanHppPage";
import GenerateLaporanBahanMasuk from "./pages/Report/GenerateLaporanBahanMasuk";
import GenerateLaporanBahanKeluar from "./pages/Report/GenerateLaporanBahanKeluar";
import GenerateLaporanNotaBySupplier from "./pages/Report/GenerateLaporanNotaBySupplier";
import GenerateLaporanNotaByTanggal from "./pages/Report/GenerateLaporanNotaByTanggal";
import MasterBahanPage from "./pages/Stock/MasterBahanPage";
import TambahNotaPage from "./pages/Nota/TambahNotaPage";
import LihatNotaPage from "./pages/Nota/LihatNotaPage";
import TambahUserPage from "./pages/User/TambahUserPage";
import TambahCustomerSupplierPage from "./pages/User/TambahCustomerSupplierPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<ProfilePage />} />
        </Route>

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
        </Route>

        <Route path="/stock" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="master" element={<MasterBahanPage />} />
          <Route path="catat" element={<CatatStockPage />} />
          <Route path="lihat" element={<LihatStockPage />} />
          <Route path="pemakaian" element={<InputPemakaianBahan />} />
          <Route path="history" element={<HistoryPemakaianBahan />} />
          <Route path="history/pemasukkan" element={<HistoryAllBahanMasuk />} />
          <Route path="history/pemasukkan/:id" element={<HistoryAllBahanMasukDetailPage />} />
          <Route path="history/keluar" element={<HistoryAllBahanKeluarPage />} />
          <Route path="history/keluar/:id" element={<HistoryAllBahanKeluarDetailPage />} />
          <Route path="detail/pemakaian/:id" element={<ListPemakaianBahanDetailPage />} />
          <Route path="bahansisa" element={<LihatBahanSisaPage />} />
        </Route>

        <Route path="/report" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="laporan/hpp" element={<GenerateLaporanHppPage />} />
          <Route path="laporan/bahan-masuk" element={<GenerateLaporanBahanMasuk />} />
          <Route path="laporan/bahan-keluar" element={<GenerateLaporanBahanKeluar />} />
          <Route path="laporan/nota-by-supplier" element={<GenerateLaporanNotaBySupplier />} />
          <Route path="laporan/nota-by-tanggal" element={<GenerateLaporanNotaByTanggal />} />
        </Route>

        <Route path="/nota" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="tambah" element={<TambahNotaPage />} />
          <Route path="lihat" element={<LihatNotaPage />} />
          <Route path="detail/:id" element={<DetailNotaPage />} />
        </Route>

        <Route path="/project" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="tambah" element={<TambahProjectPage />} />
          <Route path="product" element={<TambahProductProjectPage />} />
          <Route path="list" element={<ListProjectPage />} />
          <Route path="detail/:id" element={<ProjectDetailPage />} />
          <Route path="product/detail/:id" element={<ProdukDetailPage />} />
        </Route>

        <Route path="/user" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route path="tambah" element={<TambahUserPage />} />
          <Route path="cust" element={<TambahCustomerSupplierPage />} />
          <Route path="karyawan" element={<TambahKaryawanPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
