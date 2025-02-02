import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import { CircularProgress, IconButton, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

function HistoryPemakaianBahan() {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [error, setError] = useState('');
    const [customerNames, setCustomerNames] = useState({});
    const [filter, setFilter] = useState<string>('all'); // Filter state: all, completed, pending

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
        window.location.href = `/stock/detail/pemakaian/${id}`;
    };

    useEffect(() => {
        const fetchHistoryPemakaianBahan = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/api/history-bahan-keluar`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFilteredData(response.data.data);
                setTotalPages(response.data.total_page);
            }
            catch (error) {
                console.error('Error fetching history pemakaian bahan:', error);
                setError(error.response.data.message);
            }
            finally {
                setLoading(false);
            }
        };

        fetchHistoryPemakaianBahan();
    }, [token]);

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
                        List Pemakaian Bahan
                    </h1>
                    <p className="mt-2 text-lg text-white">
                        Berikut adalah List Pemakaian Bahan dari Proyek.
                    </p>
                </div>

                {/* Table Section */}
                <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
                    <div className="p-8">
                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            {/* Search Bar and Filter */}
                            <div className="flex justify-between items-center mb-6">
                                <TextField
                                    label="Cari Proyek"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    displayEmpty
                                    size="small"
                                    className="ml-4"
                                    sx={{ minWidth: 150 }}
                                >
                                    <MenuItem value="all">Semua Proyek</MenuItem>
                                    <MenuItem value="completed">Proyek Selesai</MenuItem>
                                    <MenuItem value="pending">Proyek Belum Selesai</MenuItem>
                                </Select>
                            </div>

                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="font-bold text-lg">No</TableCell>
                                            <TableCell className="font-bold text-lg">Nama Proyek</TableCell>
                                            <TableCell className="font-bold text-lg">Nama Produk</TableCell>
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
                                        ) : filteredData.length > 0 ? (
                                            filteredData.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{row.nama_proyek}</TableCell>
                                                    <TableCell>{row.nama_produk}</TableCell>
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
                            <div className="flex justify-between items-center mt-4">
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

export default HistoryPemakaianBahan
