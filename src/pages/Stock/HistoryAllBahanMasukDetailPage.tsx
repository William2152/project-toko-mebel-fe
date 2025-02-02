import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../../app/storeRedux';
import { CircularProgress, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

function HistoryAllBahanMasukDetailPage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [headerData, setHeaderData] = useState([]);
    const [data, setData] = useState([]);
    const [supplier, setSupplier] = useState("");

    const getNamaSupplier = async (id: number) => {
        const response = await axios.get(`${API_URL}/api/supplier/${id}`, {
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
                const response = await axios.get(`${API_URL}/api/history-bahan-masuk/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHeaderData(response.data);
                setData(response.data.detail);
                await getNamaSupplier(response.data.id_supplier)
            } catch (error: any) {
                console.error('Error fetching history pemakaian bahan:', error);
                setError(error.response.data.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistoryPemakaianBahan();
    }, [])

    return (
        <>
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
            <div className="w-full">
                {/* Header Section */}
                <div className="text-center mb-8 bg-[#65558f] rounded-lg py-2">
                    <h2 className="text-4xl font-bold text-white tracking-tight">
                        Detail History Pemasukkan Bahan
                    </h2>
                    <p className="mt-2 text-lg text-white">
                        Berikut adalah detail history pemakaian bahan.
                    </p>
                </div>

                {/* Informasi Nota */}
                <div className="bg-gray-100 shadow-md rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <p className="text-lg font-semibold">Tanggal Nota:</p>
                            <p className="text-base text-gray-700">
                                {headerData.tgl_nota
                                    ? new Date(headerData.tgl_nota).toLocaleDateString('id-ID', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    })
                                    : 'Tidak tersedia'}
                            </p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Kode Nota:</p>
                            <p className="text-base text-gray-700">{headerData.kode_nota || 'Tidak tersedia'}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">No SPB:</p>
                            <p className="text-base text-gray-700">{headerData.no_spb || 'Tidak tersedia'}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Supplier:</p>
                            <p className="text-base text-gray-700">{supplier || 'Tidak tersedia'}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="font-bold text-lg">No</TableCell>
                                        <TableCell className="font-bold text-lg">Nama Bahan</TableCell>
                                        <TableCell className="font-bold text-lg">Quantity</TableCell>
                                        <TableCell className="font-bold text-lg">Satuan</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
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
                                            <TableCell colSpan={4} align="center">
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
    );

}

export default HistoryAllBahanMasukDetailPage
