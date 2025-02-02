import { Autocomplete, CircularProgress, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../../app/storeRedux'

function HistoryAllBahanKeluarPage() {
    const API_URL = import.meta.env.VITE_API_URL;
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

                const response = await axios.get(`${API_URL}/api/history-bahan-keluar`, { params, headers });
                setData(response.data.data || []); // Pastikan data default
                setTotalPages(response.data.total_page || 0); // Pastikan total_page default
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.response.data.message);
            }
        };

        fetchData();
    }, [selectedKaryawan, selectedProduk, token]); // Tambahkan token jika dapat berubah


    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${API_URL}/api/master/proyek-produk`, {
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
            const response = await axios.get(`${API_URL}/api/master/karyawan?id_proyek_produk=${produkId}`, {
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
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError("")}
                message={error}
                action={
                    <Fragment>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => setError("")}
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
                        History Bahan Keluar
                    </h1>
                    <p className="mt-2 text-lg text-white">
                        Berikut adalah seluruh History Bahan Keluar.
                    </p>
                </div>

                {/* Filter and Table Section */}
                <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
                    <div className="p-8">
                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            {/* Filter Section */}
                            <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-100 rounded-md mb-6">
                                {/* Filter Produk */}
                                <Autocomplete
                                    value={selectedProduk}
                                    onChange={(_, newValue) => {
                                        setSelectedProduk(newValue);
                                        setProdukId(newValue?.id || "");
                                    }}
                                    options={produkOptions}
                                    getOptionLabel={(option) => option.nama || ""}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Pilih Produk"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    className="flex-1"
                                />

                                {/* Filter Karyawan */}
                                <Autocomplete
                                    value={selectedKaryawan}
                                    onChange={(_, newValue) => setSelectedKaryawan(newValue)}
                                    options={karyawanOptions}
                                    getOptionLabel={(option) => option.nama || ""}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Pilih Karyawan"
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                    className="flex-1"
                                />
                            </div>

                            {/* Table Section */}
                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="font-bold text-lg">No</TableCell>
                                            <TableCell className="font-bold text-lg">Nama Produk</TableCell>
                                            <TableCell className="font-bold text-lg">Nama Proyek</TableCell>
                                            <TableCell className="font-bold text-lg">Nama Karyawan</TableCell>
                                            <TableCell className="font-bold text-lg">Detail</TableCell>
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
                                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
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

                            {/* Pagination Section */}
                            <div className="flex justify-between items-center mt-4 px-4 py-2">
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
                </Paper>
            </div>
        </>
    );

}

export default HistoryAllBahanKeluarPage
