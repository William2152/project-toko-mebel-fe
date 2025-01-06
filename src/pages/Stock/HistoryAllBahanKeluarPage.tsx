import { Autocomplete, CircularProgress, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../../app/storeRedux'

function HistoryAllBahanKeluarPage() {
    const token = useSelector((state: RootState) => state.localStorage.value)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(0)
    const [selectedKaryawan, setSelectedKaryawan] = useState('')
    const [karyawanOptions, setKaryawanOptions] = useState([])
    const [selectedProduk, setSelectedProduk] = useState('')
    const [produkOptions, setProdukOptions] = useState([])
    const [produkId, setProdukId] = useState('');

    // Handle page change
    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };

    const handleDetail = (id: number) => {
        window.location.href = `/stock/history/keluar/${id}`
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {
                    ...(selectedProduk?.id && { id_proyek_produk: selectedProduk.id }),
                    ...(selectedKaryawan?.id && { id_karyawan: selectedKaryawan.id })
                };
                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const response = await axios.get(`http://localhost:6347/api/history-bahan-keluar`, { params, headers });
                setData(response.data.data || []); // Pastikan data default
                setTotalPages(response.data.total_page || 0); // Pastikan total_page default
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [selectedKaryawan, selectedProduk, token]); // Tambahkan token jika dapat berubah


    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:6347/api/master/proyek-produk`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response);

            setProdukOptions(await response.data.data);
        }
        fetchData();
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`http://localhost:6347/api/master/karyawan?id_proyek_produk=${produkId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response);

            setKaryawanOptions(await response.data.data);
        }
        if (produkId) {
            fetchData();
        }
    }, [produkId])

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
                    History Semua Bahan Masuk
                </h2>
            </div>
            <div className="border-2 rounded-lg shadow-2xl mx-12 bg-white">
                <div className="container mx-auto px-8 py-8">
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {/* Filter Section */}
                        <div className="flex items-center gap-4 p-4 bg-gray-100">
                            {/* Filter Produk */}
                            <div className="flex-1">
                                <Autocomplete
                                    value={selectedProduk} // Nilai yang dipilih
                                    onChange={(_, newValue) => { setSelectedProduk(newValue); setProdukId(newValue.id); }} // Mengatur nilai terpilih
                                    options={produkOptions} // Daftar opsi
                                    getOptionLabel={(option) => option.nama || ''} // Menentukan label untuk setiap opsi
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Pilih Produk"
                                            variant="outlined"
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value.id} // Membandingkan opsi berdasarkan ID
                                />
                            </div>

                            {/* Filter Karyawan */}
                            <div className="flex-1">
                                <Autocomplete
                                    value={selectedKaryawan} // Nilai yang dipilih
                                    onChange={(_, newValue) => setSelectedKaryawan(newValue)} // Mengatur nilai terpilih
                                    options={karyawanOptions} // Daftar opsi
                                    getOptionLabel={(option) => option.nama || ''} // Menentukan label untuk setiap opsi
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Pilih Karyawan"
                                            variant="outlined"
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value.id} // Membandingkan opsi berdasarkan ID
                                />
                            </div>
                        </div>

                        {/* Table Section */}
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Nama Produk</TableCell>
                                        <TableCell>Nama Proyek</TableCell>
                                        <TableCell>Nama Karyawan</TableCell>
                                        <TableCell>Detail</TableCell>
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
                                                <TableCell>{row.nama_produk}</TableCell>
                                                <TableCell>{row.nama_proyek}</TableCell>
                                                <TableCell>{row.nama_karyawan}</TableCell>
                                                <TableCell>
                                                    <button
                                                        onClick={() => handleDetail(row.id)}
                                                        style={{
                                                            padding: '5px 10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Detail
                                                    </button>
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
    )
}

export default HistoryAllBahanKeluarPage
