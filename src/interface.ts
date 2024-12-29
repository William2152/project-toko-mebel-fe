export interface CredentialsLogin {
  valid : {type: string, message: string};
  username: string;
  password: string;
}
export interface KaryawanData {
  id: number;
  nama: string;
  role: string;
}

export interface ProjectData {
  id: number;
  id_customer: number;
  nama: string;
  start: Date;
  deadline: Date;
  alamat_pengiriman: string;
}

export interface ProyekProdukData {
  id: number;
  id_proyek: number;
  id_penanggung_jawab: number;
  id_karyawan1: number;
  id_karyawan2: number;
  nama_produk: string;
  qty: number;
  tipe: string;
  nama_penanggung_jawab: string;
  nama_karyawan1: string;
  nama_karyawan2: string;
}

export interface CustomerData {
  id: number
  no: number;
  nama: string;
  no_rekening?: number;
  nama_bank?: string;
  no_telepon: number;
  alamat: string;
}

export interface BahanProdukData {
  nama: string;
  detail: Array<{
    id_bahan: number;
    nama_bahan: string;
    id_satuan: number;
    nama_satuan: string;
    qty: number;
    keterangan: string | null;
  }>;
}


export interface DetailBahanProdukData {
  id_bahan: number;
  nama_bahan: string;
  id_satuan: number;
  nama_satuan: string;
  qty: number;
  keterangan: string;
}

export interface BahanData {
  id: number;
  nama: string;
}

export interface SatuanData {
  id: number;
  nama: string;
  konversi: number;
  satuan_terkecil: string;
}