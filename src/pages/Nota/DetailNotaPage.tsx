import { CircularProgress, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { useSelector } from 'react-redux'
import { RootState } from '../../../app/storeRedux'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function DetailNotaPage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = useSelector((state: RootState) => state.localStorage.value)
    const { id } = useParams()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [headerData, setHeaderData] = useState([])
    const [supplier, setSupplier] = useState('')

    const getNamaSupplier = async (id: number) => {
        const response = await axios.get(`${API_URL}/api/supplier/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.nama
    }

    useEffect(() => {
        const fetchDetailNota = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/history-bahan-masuk/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setHeaderData(response.data)
                setData(response.data.detail)
                await getNamaSupplier(response.data.id_supplier).then((result) => {
                    setSupplier(result)
                })
            } catch (error: any) {
                console.error('Error fetching detail nota:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetailNota();
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
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Detail Nota
                    </h1>
                    <p className="mt-2 text-lg text-white">
                        Detail Nota yang dipilih
                    </p>
                </div>

                {/* Content Section */}
                <div className="bg-gray-100 shadow-lg rounded-lg mx-4 md:mx-8 lg:mx-12 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-lg font-semibold">Kode Nota:</p>
                            <p className="text-base text-gray-700">{headerData.kode_nota || 'Tidak tersedia'}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">No SPB:</p>
                            <p className="text-base text-gray-700">{headerData.no_spb || 'Tidak tersedia'}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Nama Supplier:</p>
                            <p className="text-base text-gray-700">{supplier || 'Tidak tersedia'}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden shadow-lg rounded-xl bg-white">
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="font-bold text-lg">No</TableCell>
                                        <TableCell className="font-bold text-lg">Nama Bahan</TableCell>
                                        <TableCell className="font-bold text-lg">Satuan</TableCell>
                                        <TableCell className="font-bold text-lg">Quantity</TableCell>
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
                                                <TableCell>{row.nama_satuan}</TableCell>
                                                <TableCell>{row.qty}</TableCell>
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

export default DetailNotaPage
