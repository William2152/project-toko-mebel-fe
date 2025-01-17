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

            <div className="max-w mx-auto">
                <div className="text-center mb-8 bg-[#65558f] rounded-lg py-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        List Project
                    </h1>
                    <p className="mt-2 text-lg text-white">
                        Berikut adalah daftar project yang tersedia.
                    </p>
                </div>

                <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
                    <div className="p-8">
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
                                className="ml-4 w-40"
                            >
                                <MenuItem value="all">Semua Proyek</MenuItem>
                                <MenuItem value="true">Proyek Selesai</MenuItem>
                                <MenuItem value="false">Proyek Belum Selesai</MenuItem>
                            </Select>
                        </div>

                        <TableContainer className="max-h-96">
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
                                            <TableCell colSpan={7} align="center">
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : data.length > 0 ? (
                                        data.map((row, index) => (
                                            <TableRow key={index} className="hover:bg-gray-100">
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.nama}</TableCell>
                                                <TableCell>{customerNames[row.id_customer] || 'Loading...'}</TableCell>
                                                <TableCell>{new Date(row.start).toLocaleDateString('en-GB')}</TableCell>
                                                <TableCell>{new Date(row.deadline).toLocaleDateString('en-GB')}</TableCell>
                                                <TableCell>{row.status ? 'Selesai' : 'Belum Selesai'}</TableCell>
                                                <TableCell>
                                                    <button
                                                        onClick={() => handleDetail(row.id)}
                                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                                    >
                                                        Detail
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                Tidak ada data yang sesuai
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <div className="flex items-center justify-between mt-6">
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
                    </div>
                </Paper>
            </div>
        </>
    );
}

export default ListProjectPage;
