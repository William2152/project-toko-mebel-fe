import { CircularProgress, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Select, MenuItem } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { ProjectData } from '../../interface';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import CloseIcon from '@mui/icons-material/Close';

function ListProjectPage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ProjectData[]>([]);
    const [filteredData, setFilteredData] = useState<ProjectData[]>([]);
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
        window.location.href = `/project/detail/${id}`;
    };

    const fetchProyek = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:6347/api/proyek?page=${page + 1}&per_page=${rowsPerPage}&search=${searchTerm}&status=${filter}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.data);

            setData(response.data.data);
            setTotalPages(response.data.total_page);
            setLoading(false);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
                setLoading(false);
            }
        }
    };

    const getCustomerName = async (id: number) => {
        try {
            const response = await axios.get(`http://localhost:6347/api/customer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.nama;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
        }
    };

    useEffect(() => {
        // Ambil semua nama pelanggan berdasarkan id_customer
        const fetchCustomerNames = async () => {
            const names = {};
            for (const row of data) {
                if (!names[row.id_customer]) {
                    names[row.id_customer] = await getCustomerName(row.id_customer);
                }
            }
            setCustomerNames(names); // Simpan hasil ke state
        };

        fetchCustomerNames();
    }, [data]);

    useEffect(() => {
        fetchProyek();
    }, [searchTerm, page, rowsPerPage, filter]);

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
            <div className="border-2 rounded-lg shadow-2xl mx-12 bg-white">
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
                                <MenuItem value="true">Proyek Selesai</MenuItem>
                                <MenuItem value="false">Proyek Belum Selesai</MenuItem>
                            </Select>
                        </div>

                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Nama</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Start</TableCell>
                                        <TableCell>Deadline</TableCell>
                                        <TableCell>Status</TableCell>
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
                                                <TableCell>{row.nama}</TableCell>
                                                <TableCell>{customerNames[row.id_customer] || 'Loading...'}</TableCell>
                                                <TableCell>{new Date(row.start).toLocaleDateString('en-GB')}</TableCell>
                                                <TableCell>{new Date(row.deadline).toLocaleDateString('en-GB')}</TableCell>
                                                <TableCell>{row.status == true ? 'Selesai' : 'Belum Selesai'}</TableCell>
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
    );
}

export default ListProjectPage;
