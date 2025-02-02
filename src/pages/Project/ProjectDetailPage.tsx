import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ProjectData, ProyekProdukData } from '../../interface';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import { Modal, Box, TextField, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, TablePagination, Snackbar, IconButton } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CloseIcon from '@mui/icons-material/Close';


function ProjectDetailPage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = useSelector((state: RootState) => state.localStorage.value);
    const { id } = useParams(); // Mengambil id dari URL params
    const id_projek = id;
    const [data, setData] = useState<ProjectData>(); // State untuk menyimpan data proyek
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false); // State untuk modal
    const { control, handleSubmit, reset } = useForm();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dataProduk, setDataProduk] = useState<ProyekProdukData[]>([]);

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
        window.location.href = `/project/product/detail/${id}`;
        localStorage.setItem('id_projek', id_projek?.toString() || '');
    };

    const fetchProduk = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/proyek/produk?id_proyek=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(response);
            setDataProduk(response.data.data); // Asumsikan response.data berisi detail proyek
            setTotalPages(response.data.total_page);
        } catch (err) {
            setError('Failed to fetch project details');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProduk();
    }, [id]);

    // Fetch data proyek berdasarkan ID
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/proyek/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(response);
                setData(response.data); // Asumsikan response.data berisi detail proyek
                reset(response.data); // Mengisi default value pada form
            } catch (err) {
                setError('Failed to fetch project details');
                console.error(err);
            }
        };

        fetchProject();
    }, [id, reset]);

    const handleUpdate = () => {
        setOpen(true); // Buka modal
    };

    const handleClose = () => {
        setOpen(false); // Tutup modal
    };

    const onSubmit = async (formData) => {
        try {
            await axios.put(`${API_URL}/api/proyek/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Proyek berhasil diupdate');
            setData(formData); // Update state dengan data baru
            setOpen(false); // Tutup modal
        } catch (err) {
            alert('Gagal mengupdate proyek');
            console.error(err);
        }
    };

    const handleSelesai = async () => {
        await axios.put(`${API_URL}/api/proyek/${id}/status`, { status: 1 }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        )
        setError("Berhasil Selesaikan Project");
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/api/proyek/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            window.location.href = '/project/list';
        } catch (err) {
            console.log(err);
        }
    };

    if (!data) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError("")}
                    message={error}
                    action={
                        <Fragment>
                            <IconButton size="small" color="inherit" onClick={() => setError("")}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Fragment>
                    }
                />

                <div className="max-w mx-auto">
                    <div className="text-center mb-8 bg-[#65558f] rounded-lg py-2">
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            Detail Project
                        </h1>
                        <p className="mt-2 text-lg text-white">
                            Berikut adalah Detail Project yang anda pilih.
                        </p>
                    </div>

                    <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-lg font-semibold">Nama Project: {data.nama}</p>
                                    <p className="text-lg font-semibold">Customer: {data.id_customer}</p>
                                    <p className="text-lg font-semibold">Start: {new Date(data.start).toLocaleDateString('en-GB')}</p>
                                    <p className="text-lg font-semibold">Deadline: {new Date(data.deadline).toLocaleDateString('en-GB')}</p>
                                    <p className="text-lg font-semibold">Alamat Pengiriman: {data.alamat_pengiriman}</p>
                                </div>
                            </div>
                            <div className="space-x-4 mb-5">
                                <Button variant="contained" color="primary" onClick={handleUpdate}>
                                    Update
                                </Button>
                                <Button variant="outlined" color="error" onClick={handleDelete}>
                                    Delete
                                </Button>
                                <Button variant="contained" sx={{
                                    backgroundColor: '#65558f', // Warna kustom
                                    '&:hover': {
                                        backgroundColor: '#65558f', // Warna ketika di-hover
                                    },
                                }} onClick={() => handleSelesai()}>
                                    Selesai
                                </Button>
                            </div>

                            <TextField
                                label="Cari Produk"
                                variant="outlined"
                                size="small"
                                fullWidth
                                className="mb-6"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <TableContainer className="max-h-96">
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No</TableCell>
                                            <TableCell>Produk</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Penanggung Jawab</TableCell>
                                            <TableCell>Karyawan 1</TableCell>
                                            <TableCell>Karyawan 2</TableCell>
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
                                        ) : dataProduk.length > 0 ? (
                                            dataProduk.map((row, index) => (
                                                <TableRow key={index} className="hover:bg-gray-100">
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{row.nama_produk}</TableCell>
                                                    <TableCell>{row.qty}</TableCell>
                                                    <TableCell>{row.tipe}</TableCell>
                                                    <TableCell>{row.nama_penanggung_jawab}</TableCell>
                                                    <TableCell>{row.nama_karyawan1}</TableCell>
                                                    <TableCell>{row.nama_karyawan2}</TableCell>
                                                    <TableCell>
                                                        <Button variant="contained" color="success" onClick={() => handleDetail(row.id)}>
                                                            Detail
                                                        </Button>
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
                                <span className="text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
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

                    <Modal open={open} onClose={handleClose}>
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: 2,
                            }}
                        >
                            <h2 className="text-xl font-bold mb-4">Update Proyek</h2>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <Controller
                                    name="nama"
                                    control={control}
                                    render={({ field }) => <TextField {...field} fullWidth label="Nama Project" />}
                                />
                                <Controller
                                    name="id_customer"
                                    control={control}
                                    render={({ field }) => <TextField {...field} fullWidth label="Customer" />}
                                />
                                <Controller
                                    name="start"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Start"
                                            inputFormat="dd/MM/yyyy"
                                            value={field.value ? new Date(field.value) : null}
                                            onChange={(date) => field.onChange(date?.toISOString().split('T')[0] || '')}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    )}
                                />
                                <Controller
                                    name="deadline"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Deadline"
                                            inputFormat="dd/MM/yyyy"
                                            value={field.value ? new Date(field.value) : null}
                                            onChange={(date) => field.onChange(date?.toISOString().split('T')[0] || '')}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                        />
                                    )}
                                />
                                <Controller
                                    name="alamat_pengiriman"
                                    control={control}
                                    render={({ field }) => <TextField {...field} fullWidth label="Alamat Pengiriman" />}
                                />
                                <div className="flex justify-end mt-4 space-x-4">
                                    <Button type="submit" variant="contained" color="primary">
                                        Simpan
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={handleClose}>
                                        Batal
                                    </Button>
                                </div>
                            </form>
                        </Box>
                    </Modal>
                </div>
            </LocalizationProvider>
        </>
    );
}

export default ProjectDetailPage;
