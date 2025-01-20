import { RoutePermission } from '../types/auth.types';

export const routePermissions: RoutePermission[] = [
  // Dashboard
  { path: '/dashboard', allowedRoles: ['superadmin', 'adminkantor', 'adminworkshop', 'karyawankantor', 'karyawanworkshop'] },
  
  // Project routes
  { path: '/project/tambah', allowedRoles: ['superadmin', 'adminworkshop'] },
  { path: '/project/product', allowedRoles: ['superadmin', 'adminworkshop'] },
  { path: '/project/list', allowedRoles: ['superadmin', 'adminworkshop'] },
  
  // Stock routes
  { path: '/stock/master', allowedRoles: ['superadmin', 'adminworkshop'] },
  { path: '/stock/catat', allowedRoles: ['superadmin', 'adminworkshop'] },
  { path: '/stock/lihat', allowedRoles: ['superadmin', 'adminworkshop'] },
  { path: '/stock/pemakaian', allowedRoles: ['superadmin', 'adminworkshop'] },
  { path: '/stock/history', allowedRoles: ['superadmin', 'adminworkshop'] },
  { path: '/stock/history/pemasukkan', allowedRoles: ['superadmin', 'adminworkshop'] },
  { path: '/stock/history/keluar', allowedRoles: ['superadmin', 'adminworkshop'] },
  { path: '/stock/bahansisa', allowedRoles: ['superadmin', 'adminworkshop'] },
  
  // Nota routes
  { path: '/nota/tambah', allowedRoles: ['superadmin', 'adminkantor'] },
  { path: '/nota/lihat', allowedRoles: ['superadmin', 'adminkantor'] },
  
  // Report routes
  { path: '/report/laporan/hpp', allowedRoles: ['superadmin', 'adminkantor', 'adminworkshop', 'karyawankantor', 'karyawanworkshop'] },
  { path: '/report/laporan/nota-by-supplier', allowedRoles: ['superadmin', 'adminkantor', 'karyawankantor'] },
  { path: '/report/laporan/nota-by-tanggal', allowedRoles: ['superadmin', 'adminkantor', 'karyawankantor'] },
  { path: '/report/laporan/bahan-masuk', allowedRoles: ['superadmin', 'adminworkshop', 'karyawanworkshop'] },
  { path: '/report/laporan/bahan-keluar', allowedRoles: ['superadmin', 'adminworkshop', 'karyawanworkshop'] },
  
  // User routes
  { path: '/user/tambah', allowedRoles: ['superadmin'] },
  { path: '/user/cust', allowedRoles: ['superadmin', 'adminworkshop'] },
  { path: '/user/karyawan', allowedRoles: ['superadmin', 'adminworkshop'] },
  
  // Profile route - accessible by all roles
  { path: '/profile', allowedRoles: ['superadmin', 'adminkantor', 'adminworkshop', 'karyawankantor', 'karyawanworkshop'] },
];