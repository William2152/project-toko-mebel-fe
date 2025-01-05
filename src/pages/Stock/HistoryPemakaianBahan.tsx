import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import { CircularProgress, IconButton, MenuItem, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

function HistoryPemakaianBahan() {
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
                const response = await axios.get('http://localhost:6347/api/history-bahan-keluar', {
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
                <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">List Project</h2>
            </div>
            <div className="border-2 h-[80vh] rounded-lg shadow-2xl mx-12 bg-white">
                <div className="container mx-auto px-8 py-8">
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {/* Search Bar and Filter */}
                        <div className="px-4 py-2 flex justify-between items-center">
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
                                sx={{ minWidth: 150, marginLeft: 2 }}
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
                                        <TableCell>No</TableCell>
                                        <TableCell>Nama Proyek</TableCell>
                                        <TableCell>Nama Produk</TableCell>
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
                                                        style={{
                                                            padding: '5px 10px',
                                                            marginRight: '10px',
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

export default HistoryPemakaianBahan
