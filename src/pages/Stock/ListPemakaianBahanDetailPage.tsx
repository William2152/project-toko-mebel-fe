import { Autocomplete, Box, Button, CircularProgress, IconButton, MenuItem, Modal, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';

function ListPemakaianBahanDetailPage() {
    const { id } = useParams();
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [headerData, setHeaderData] = useState([]);
    const { control, handleSubmit, reset } = useForm();
    const [open, setOpen] = useState(false);
    const [satuanOptions, setSatuanOptions] = useState([]);
    const [satuan_terkecil, setSatuanTerkecil] = useState('');
    const [historyId, setHistoryId] = useState(0);

    const handleClose = () => {
        setOpen(false);
        reset();
    }

    const onSubmit = async (data: any) => {
        console.log(data);
        try {
            await axios.post(`http://localhost:6347/api/bahan-sisa`, {
                id_history_bahan_keluar_detail: historyId,
                id_satuan: data.satuan.id,
                qty: data.quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            handleClose();
        } catch (error) {
            setError(error.response.data.message);
        }

    }



    const handleBahanSisa = (satuan: string, id: number) => {
        setOpen(true);
        setSatuanTerkecil(satuan);
        setHistoryId(id);
    }

    useEffect(() => {
        console.log(satuan_terkecil);

        const fetchSatuan = async () => {
            const satuanResponse = await axios.get(`http://localhost:6347/api/master/satuan?satuan_terkecil=${satuan_terkecil}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(satuanResponse.data.data);
            setSatuanOptions(await satuanResponse.data.data);
        }
        if (satuan_terkecil) {
            fetchSatuan();
        }
    }, [satuan_terkecil]);

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
                                        <TableCell>Aksi</TableCell>
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
                                                <TableCell><button
                                                    onClick={() => handleBahanSisa(row.satuan_terkecil, row.id)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        backgroundColor: '#4CAF50',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Add Bahan Sisa
                                                </button></TableCell>
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
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <h2 className="text-2xl font-bold mb-4">Input Quantity and Unit</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Searchable Combobox Satuan */}
                        <Controller
                            name="satuan"
                            control={control}
                            render={({ field }) => (
                                <Autocomplete
                                    {...field}
                                    value={field.value || null} // Default value untuk menghindari undefined
                                    options={satuanOptions}
                                    getOptionLabel={(option) => option.nama} // Label opsi
                                    onChange={(_, data) => field.onChange(data)} // Handle change
                                    isOptionEqualToValue={(option, value) =>
                                        option.id === value?.id
                                    } // Bandingkan berdasarkan ID unik
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Pilih Satuan"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.nama}
                                        </li>
                                    )}
                                />
                            )}
                        />
                        {/* Input Number Quantity */}
                        <Controller
                            name="quantity"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Masukkan Quantity"
                                    type="number"
                                    inputProps={{ step: "0.1" }} // Dua desimal
                                    fullWidth
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
        </>

    )
}

export default ListPemakaianBahanDetailPage
