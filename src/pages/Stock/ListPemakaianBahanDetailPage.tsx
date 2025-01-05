import { CircularProgress, IconButton, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import axios from 'axios';

function ListPemakaianBahanDetailPage() {
    const { id } = useParams();
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [headerData, setHeaderData] = useState([]);

    useEffect(() => {
        const fetchHistoryPemakaianBahan = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:6347/api/history-bahan-keluar/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setHeaderData(response.data);
                setData(response.data.detail);
            } catch (error: any) {
                console.error('Error fetching history pemakaian bahan:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchHistoryPemakaianBahan();
    }, []);

    useEffect(() => {
        console.log(data.length);
        console.log(loading);

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
                    List Detail Pemakaian Bahan
                </h2>
            </div>
            {/* Informasi Proyek, Produk, dan Karyawan */}
            <div className="border-2 rounded-lg shadow-md bg-gray-100 mx-12 px-8 py-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-lg font-semibold">Nama Proyek:</p>
                        <p className="text-base">{headerData.nama_proyek || 'Tidak tersedia'}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Nama Produk:</p>
                        <p className="text-base">{headerData.nama_produk || 'Tidak tersedia'}</p>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Nama Karyawan:</p>
                        <p className="text-base">{headerData.nama_karyawan || 'Tidak tersedia'}</p>
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
                                        <TableCell>Satuan</TableCell>
                                        <TableCell>Quantity</TableCell>
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
                                                <TableCell>{row.nama_satuan}</TableCell>
                                                <TableCell>{row.qty}</TableCell>
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

export default ListPemakaianBahanDetailPage
