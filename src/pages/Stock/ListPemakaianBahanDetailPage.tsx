import { Autocomplete, Box, Button, CircularProgress, IconButton, MenuItem, Modal, Paper, Select, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';

function ListPemakaianBahanDetailPage() {
    const API_URL = import.meta.env.VITE_API_URL;
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
            await axios.post(`${API_URL}/api/bahan-sisa`, {
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
            const satuanResponse = await axios.get(`${API_URL}/api/master/satuan?satuan_terkecil=${satuan_terkecil}`, {
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
                const response = await axios.get(`${API_URL}/api/history-bahan-keluar/${id}`, {
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
                    <h2 className="text-4xl font-bold text-white tracking-tight">
                        List Detail Pemakaian Bahan
                    </h2>
                    <p className="mt-2 text-lg text-white">
                        Berikut adalah detail pemakaian bahan untuk proyek "{headerData.nama_proyek}"
                    </p>
                </div>

                {/* Informasi Proyek, Produk, dan Karyawan */}
                <div className="bg-gray-100 shadow-md rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-lg font-semibold">Nama Proyek:</p>
                            <p className="text-base text-gray-700">{headerData.nama_proyek || "Tidak tersedia"}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Nama Produk:</p>
                            <p className="text-base text-gray-700">{headerData.nama_produk || "Tidak tersedia"}</p>
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Nama Karyawan:</p>
                            <p className="text-base text-gray-700">{headerData.nama_karyawan || "Tidak tersedia"}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 500 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="font-bold text-lg">No</TableCell>
                                        <TableCell className="font-bold text-lg">Nama Bahan</TableCell>
                                        <TableCell className="font-bold text-lg">Satuan</TableCell>
                                        <TableCell className="font-bold text-lg">Quantity</TableCell>
                                        <TableCell className="font-bold text-lg">Aksi</TableCell>
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
                                                <TableCell>
                                                    <button
                                                        onClick={() => handleBahanSisa(row.satuan_terkecil, row.id)}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                                    >
                                                        Add Bahan Sisa
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
                    </Paper>
                </div>

                {/* Modal Input Quantity and Unit */}
                <Modal open={open} onClose={handleClose}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "90%",
                            maxWidth: 400,
                            bgcolor: "background.paper",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Input Quantity and Unit</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Searchable Combobox Satuan */}
                            <Controller
                                name="satuan"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        value={field.value || null}
                                        options={satuanOptions}
                                        getOptionLabel={(option) => option.nama}
                                        onChange={(_, data) => field.onChange(data)}
                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Pilih Satuan"
                                                variant="outlined"
                                                fullWidth
                                            />
                                        )}
                                    />
                                )}
                            />
                            {/* Input Quantity */}
                            <Controller
                                name="quantity"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Masukkan Quantity"
                                        type="number"
                                        inputProps={{ step: "0.1" }}
                                        fullWidth
                                        variant="outlined"
                                    />
                                )}
                            />
                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4">
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
        </>
    );

}

export default ListPemakaianBahanDetailPage
