import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { RootState } from '../../../app/storeRedux';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import { BahanData, BahanProdukData, DetailBahanProdukData, SatuanData } from '../../interface';

function ProdukDetailPage() {
    const { id } = useParams();
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [dataBahan, setDataBahan] = useState<BahanProdukData[]>([]);
    const [dataBahanDetail, setDataBahanDetail] = useState<DetailBahanProdukData[]>([]);
    const [dataNamaBahan, setDataNamaBahan] = useState<BahanData[]>([])
    const [dataSatuan, setDataSatuan] = useState<SatuanData[]>([])
    const { register, handleSubmit, reset, setValue } = useForm<DetailBahanProdukData>();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredNamaBahan, setFilteredNamaBahan] = useState<BahanData[]>([]);
    const [update, setUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(0);
    const [reload, setReload] = useState(false);

    // Handle page change
    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };

    const handleUpdate = (detail: DetailBahanProdukData) => {
        setValue('qty', detail.qty);
        setValue('keterangan', detail.keterangan);
        setValue('id_bahan', detail.id_bahan);
        setValue('id_satuan', detail.id_satuan);
        setUpdateId(detail.id_bahan);
        setUpdate(true);
    };

    const handleDelete = async (id: number) => {
        setDataBahanDetail(dataBahanDetail.filter((detail) => detail.id_bahan !== id));
    };

    const filterNamaBahan = () => {
        const filtered = dataNamaBahan.filter((bahan) => !dataBahanDetail.some((detail) => detail.id_bahan === bahan.id));
        if (update) {
            setFilteredNamaBahan(dataNamaBahan);
        } else {
            setFilteredNamaBahan(filtered);
        }
        console.log(filteredNamaBahan);
        console.log(update);

    }

    const fetchProduk = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:6347/api/bahan`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log(response);
            setDataNamaBahan(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching produk:', error);
            setLoading(false);
        }
    };

    const fetchSatuan = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:6347/api/satuan`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log(response);
            setDataSatuan(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching produk:', error);
            setLoading(false);
        }
    };

    const fetchBahan = async () => {
        try {
            const response = await axios.get(`http://localhost:6347/api/produk/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setDataBahan(response.data);
            setDataBahanDetail(response.data.detail);
        } catch (error) {
            console.error('Error fetching bahan:', error);
        }
    };

    const getNamaBahan = async (id: number) => {
        const response = await axios.get(`http://localhost:6347/api/bahan/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data.nama;
    }

    const getNamaSatuan = async (id: number) => {
        const response = await axios.get(`http://localhost:6347/api/satuan/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data.nama;
    }

    const handleSave = async () => {
        console.log(dataBahanDetail);

        const payload = {
            detail: dataBahanDetail,
        };
        console.log("payload : " + payload);

        try {
            const response = await axios.put(`http://localhost:6347/api/produk/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(response);
        } catch (error) {
            console.error('Error fetching bahan:', error);
        }
    }

    const onSubmit = async (data: DetailBahanProdukData) => {
        console.log(data);
        if (update) {
            dataBahanDetail.map((detail) => {
                if (detail.id_bahan === updateId) {
                    detail.qty = data.qty;
                    detail.keterangan = data.keterangan;
                }
            })
            setUpdate(false);
            reset();
            setReload(!reload);
        } else {
            const namaBahan = await getNamaBahan(data.id_bahan);
            const namaSatuan = await getNamaSatuan(data.id_satuan);
            setDataBahanDetail([
                ...dataBahanDetail,
                {
                    id_bahan: data.id_bahan,
                    nama_bahan: namaBahan,
                    id_satuan: data.id_satuan,
                    nama_satuan: namaSatuan,
                    qty: data.qty,
                    keterangan: data.keterangan
                }
            ]);
        }
        console.log(dataBahanDetail);
    };

    useEffect(() => {
        fetchBahan();
        fetchProduk();
        fetchSatuan();
    }, []);

    useEffect(() => {
        if (update) {
            filterNamaBahan();
            setReload(!reload);
        } else {
            filterNamaBahan();
        }
    }, [dataBahanDetail, update]);

    useEffect(() => {
        setValue('id_bahan', updateId);
    }, [reload]);

    return (
        <>
            <div className="mb-12 mt-6">
                <h2 className="text-5xl font-bold text-[#65558f] mb-6 mx-12">Detail Produk</h2>
            </div>
            <div className="border-2 rounded-lg shadow-2xl mx-12">
                <div className='container mx-auto px-12 py-12'>
                    <div className="flex justify-end">
                        <button
                            onClick={() => handleSave()}
                            className="px-6 py-2 text-white bg-[#65558f] rounded-lg hover:bg-green-500 mt-4"
                        >
                            Save Produk
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center">
                            <p className="text-2xl font-bold text-[#65558f]">Nama Produk:</p>
                            <p className="text-2xl ml-4">{dataBahan.nama}</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="bahan" className="block text-xl font-bold text-[#65558f]">Bahan</label>
                                <select
                                    id="bahan"
                                    {...register('id_bahan')}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#65558f]"
                                >
                                    <option hidden value="">Pilih Bahan</option>
                                    {filteredNamaBahan.map((bahan: BahanData) => (
                                        <option key={bahan.id} value={bahan.id} disabled={update}>
                                            {bahan.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="satuan" className="block text-xl font-bold text-[#65558f]">Satuan</label>
                                <select
                                    id="satuan"
                                    {...register('id_satuan')}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#65558f]"
                                >
                                    <option hidden value="">Pilih Satuan</option>
                                    {dataSatuan.map((satuan: SatuanData) => (
                                        <option key={satuan.id} value={satuan.id} disabled={update}>
                                            {satuan.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="quantity" className="block text-xl font-bold text-[#65558f]">Quantity</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    {...register('qty')}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#65558f]"
                                />
                            </div>

                            <div>
                                <label htmlFor="keterangan" className="block text-xl font-bold text-[#65558f]">Keterangan</label>
                                <input
                                    type="text"
                                    id="keterangan"
                                    {...register('keterangan')}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#65558f]"
                                />
                            </div>
                        </div>

                        {update ?
                            <>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-white bg-[#65558f] rounded-lg hover:bg-[#534474] me-5"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => { setUpdate(false); reset(); }}
                                    className="px-6 py-2 text-white bg-[#65558f] rounded-lg hover:bg-[#534474]"
                                >
                                    Batal
                                </button>
                            </>
                            :
                            <button
                                type="submit"
                                className="px-6 py-2 text-white bg-[#65558f] rounded-lg hover:bg-[#534474] me-5"
                            >
                                Tambah
                            </button>
                        }

                    </form>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        {/* Search Bar */}
                        <div className="px-4 py-2 flex justify-between items-center">
                            <TextField
                                label="Cari Produk"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <TableContainer sx={{ maxHeight: 300 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Nama Bahan</TableCell>
                                        <TableCell>Satuan</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Keterangan</TableCell>
                                        <TableCell>Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : dataBahanDetail.length > 0 ? (
                                        dataBahanDetail.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.nama_bahan}</TableCell>
                                                <TableCell>{row.nama_satuan}</TableCell>
                                                <TableCell>{row.qty}</TableCell>
                                                <TableCell>{row.keterangan}</TableCell>
                                                <TableCell>
                                                    <button onClick={() => { handleUpdate(row) }}
                                                        style={{
                                                            padding: '5px 10px',
                                                            marginRight: '10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}>Update</button>
                                                    <button onClick={() => handleDelete(row.id_bahan)}
                                                        style={{
                                                            padding: '5px 10px',
                                                            marginRight: '10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}>Delete</button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                Tidak ada data yang sesuai
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className="flex items-center justify-between px-4 py-2">
                            <span className="text-sm text-gray-600">
                                Page {page + 1} of {totalPages}
                            </span>
                            <TablePagination
                                rowsPerPageOptions={[10, 20, 50]}
                                component="div"
                                count={totalPages * rowsPerPage}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                    </Paper>
                </div>
            </div>
        </>
    );
}

export default ProdukDetailPage;
