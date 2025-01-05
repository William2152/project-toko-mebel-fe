import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ProjectData, ProyekProdukData } from '../../interface';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import { Modal, Box, TextField, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, TablePagination } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


function ProjectDetailPage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const { id } = useParams(); // Mengambil id dari URL params
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
    const [openJasa, setOpenJasa] = useState(false);

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
    };

    const fetchProduk = async () => {
        try {
            const response = await axios.get(`http://localhost:6347/api/proyek/produk?id_proyek=${id}`, {
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
                const response = await axios.get(`http://localhost:6347/api/proyek/${id}`, {
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
            await axios.put(`http://localhost:6347/api/proyek/${id}`, formData, {
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

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:6347/api/proyek/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            window.location.href = '/project/list';
        } catch (err) {
            console.log(err);
        }
    };

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    if (!data) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div className="mb-12 mt-6">
                    <h2 className="text-5xl font-bold text-[#65558f] mb-6 mx-12">Detail Proyek</h2>
                </div>
                <div className="border-2 rounded-lg shadow-2xl mx-12">
                    <div className="flex justify-end">
                        <button
                            onClick={handleUpdate}
                            className="px-8 py-3 me-5 mt-5 bg-[#65558f] text-white rounded-lg text-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-transform transform hover:scale-105 focus:outline-none"
                        >
                            Selesai
                        </button>
                    </div>
                    <div className="flex flex-row px-12 py-12">
                        {/* Bagian Kiri */}
                        <div className="flex-1 pr-8">
                            <div className="space-y-6 text-xl">
                                <p><strong>Nama Project:</strong> {data.nama}</p>
                                <p><strong>Customer:</strong> {data.id_customer}</p>
                                <p><strong>Start:</strong> {new Date(data.start).toLocaleDateString('en-GB')}</p>
                            </div>
                            <div className="flex space-x-4 mt-8">
                                <button
                                    onClick={handleUpdate}
                                    className="px-8 py-3 bg-blue-500 text-white rounded-lg text-lg shadow hover:bg-blue-600 focus:outline-none"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-8 py-3 bg-red-500 text-white rounded-lg text-lg shadow hover:bg-red-600 focus:outline-none"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Bagian Kanan */}
                        <div className="flex-1 pl-8">
                            <div className="space-y-6 text-xl">
                                <p><strong>Deadline:</strong> {new Date(data.deadline).toLocaleDateString('en-GB')}</p>
                                <p><strong>Alamat Pengiriman:</strong> {data.alamat_pengiriman}</p>
                            </div>
                        </div>
                    </div>
                    <div className='px-12 pb-12'>

                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            {/* Search Bar */}
                            <div className="px-4 py-2 flex justify-between items-center">
                                <TextField
                                    label="Cari Produk"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <TableContainer sx={{ maxHeight: 300 }}>
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
                                                <TableCell colSpan={5} align="center">
                                                    <CircularProgress />
                                                </TableCell>
                                            </TableRow>
                                        ) : dataProduk.length > 0 ? (
                                            dataProduk.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{row.nama_produk}</TableCell>
                                                    <TableCell>{row.qty}</TableCell>
                                                    <TableCell>{row.tipe}</TableCell>
                                                    <TableCell>{row.nama_penanggung_jawab}</TableCell>
                                                    <TableCell>{row.nama_karyawan1}</TableCell>
                                                    <TableCell>{row.nama_karyawan2}</TableCell>
                                                    <TableCell>
                                                        <button onClick={() => handleDetail(row.id)}
                                                            style={{
                                                                padding: '5px 10px',
                                                                marginRight: '10px',
                                                                backgroundColor: '#4CAF50',
                                                                color: 'white',
                                                                border: 'none',
                                                                borderRadius: '5px',
                                                                cursor: 'pointer',
                                                            }}>Detail</button>
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

                {/* Modal Update */}
                <Modal open={open} onClose={handleClose}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2
                    }}>
                        <h2 className="text-2xl font-bold mb-4">Update Proyek</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                name="nama"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Nama Project"
                                        variant="outlined"
                                    />
                                )}
                            />
                            <Controller
                                name="id_customer"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Customer"
                                        variant="outlined"
                                    />
                                )}
                            />
                            <Controller
                                name="start"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Start"
                                        inputFormat="dd/MM/yyyy" // Menampilkan tanggal dalam format DD/MM/YYYY
                                        value={field.value ? new Date(field.value) : null} // Pastikan nilai diubah menjadi objek Date
                                        onChange={(date) => {
                                            if (date) {
                                                // Ubah ke format YYYY-MM-DD
                                                const formattedDate = date.toISOString().split('T')[0];
                                                field.onChange(formattedDate); // Simpan ke state React Hook Form
                                            } else {
                                                field.onChange(''); // Kosongkan nilai jika tidak valid
                                            }
                                        }}
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
                                        inputFormat="dd/MM/yyyy" // Menampilkan tanggal dalam format DD/MM/YYYY
                                        value={field.value ? new Date(field.value) : null} // Pastikan nilai diubah menjadi objek Date
                                        onChange={(date) => {
                                            if (date) {
                                                // Ubah ke format YYYY-MM-DD
                                                const formattedDate = date.toISOString().split('T')[0];
                                                field.onChange(formattedDate); // Simpan ke state React Hook Form
                                            } else {
                                                field.onChange(''); // Kosongkan nilai jika tidak valid
                                            }
                                        }}
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                )}
                            />
                            <Controller
                                name="alamat_pengiriman"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Alamat Pengiriman"
                                        variant="outlined"
                                    />
                                )}
                            />
                            <div className="flex justify-end space-x-4 mt-4">
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
            </LocalizationProvider>
        </>
    );
}

export default ProjectDetailPage;
