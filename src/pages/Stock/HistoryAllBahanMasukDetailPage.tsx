import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../../app/storeRedux';
import { CircularProgress, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

function HistoryAllBahanMasukDetailPage() {
    const { id } = useParams();
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [headerData, setHeaderData] = useState([]);
    const [data, setData] = useState([]);
    const [supplier, setSupplier] = useState("");

    const getNamaSupplier = async (id: number) => {
        const response = await axios.get(`http://localhost:6347/api/supplier/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setSupplier(response.data.nama)
    }

    useEffect(() => {
        const fetchHistoryPemakaianBahan = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:6347/api/history-bahan-masuk/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHeaderData(response.data);
                setData(response.data.detail);
                await getNamaSupplier(response.data.id_supplier)
            } catch (error: any) {
                console.error('Error fetching history pemakaian bahan:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistoryPemakaianBahan();
    }, [])

    return (
        <>
            <div>
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError('')}
                    message={error}
                    action={
                        <Fragment>
                            <IconButton
                                size="small"
                                aria-label="close"
                                color="inherit"
                                onClick={() => setError('')}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Fragment>
                    }
                />
            </div>
            <div className="mb-12 mt-6">
                <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">
                    Detail History Pemasukkan Bahan
                </h2>
            </div>
            {/* Informasi Proyek, Produk, dan Karyawan */}
            <div className="border-2 rounded-lg shadow-md bg-gray-100 mx-12 px-8 py-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-lg font-semibold">Tanggal Nota:</p>
                        <p className="text-base">{new Date(headerData.tgl_nota).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        }) || 'Tidak tersedia'}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Kode Nota:</p>
                        <p className="text-base">{headerData.kode_nota || 'Tidak tersedia'}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">No SPB:</p>
                        <p className="text-base">{headerData.no_spb || 'Tidak tersedia'}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Supplier :</p>
                        <p className="text-base">{supplier || 'Tidak tersedia'}</p>
                    </div>
                </div>
            </div>
            <div className="border-2 rounded-lg shadow-2xl mx-12 bg-white">
                <div className="container mx-auto px-8 py-8">
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Nama Bahan</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Satuan</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : data.length > 0 ? (
                                        data.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.nama_bahan}</TableCell>
                                                <TableCell>{row.qty}</TableCell>
                                                <TableCell>{row.nama_satuan}</TableCell>
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
                    </Paper>
                </div>
            </div>
        </>
    )
}

export default HistoryAllBahanMasukDetailPage
