import React, { useState, useEffect, Fragment } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    TextField,
    CircularProgress,
    Modal,
    Box,
    Autocomplete,
    Button,
    Snackbar,
    IconButton,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/storeRedux";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";

function LihatBahanSisaPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [totalPages, setTotalPages] = useState(0);
    const { control, handleSubmit, reset } = useForm();
    const [open, setOpen] = useState(false);
    const [satuanOptions, setSatuanOptions] = useState([]);
    const [satuan_terkecil, setSatuanTerkecil] = useState('');
    const [historyId, setHistoryId] = useState(0);
    const [reload, setReload] = useState(false);
    const [error, setError] = useState('');
    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const onSubmit = async (data: any) => {
        try {
            await axios.put(`http://localhost:6347/api/bahan-sisa/${historyId}`, {
                id_satuan: data.satuan.id,
                qty: data.quantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setReload(!reload);
            setError('Berhasil Mengambil Bahan');
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.response.data.message);
        }
    }


    // Handle page change
    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };

    const handleAmbil = async (id: number, satuan_terkecil: string) => {
        setOpen(true);
        setSatuanTerkecil(satuan_terkecil);
        setHistoryId(id);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:6347/api/bahan-sisa", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setData(response.data.data);
                setLoading(false);
                setTotalPages(response.data.total_page);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
                setError(error.response.data.message);
            }
        };

        fetchData();
    }, [reload])

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
    return (
        <>
            <div>
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
            </div>
            <div className="mb-12 mt-6">
                <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">Bahan Sisa</h2>
            </div>
            <div className="border-2 rounded-lg shadow-2xl mx-12">
                <div className="container mx-auto px-12 py-12">
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        {/* Search Bar */}
                        <div className="px-4 py-2 flex justify-between items-center">
                            <TextField
                                label="Cari Barang"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <TableContainer sx={{ maxHeight: 400 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Nama Bahan</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Satuan</TableCell>
                                        <TableCell>Proyek</TableCell>
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
                                                <TableCell>{row.qty}</TableCell>
                                                <TableCell>{row.satuan_terkecil}</TableCell>
                                                <TableCell>{row.nama_proyek}</TableCell>
                                                <TableCell>
                                                    <button
                                                        onClick={() => handleAmbil(row.id, row.satuan_terkecil)}
                                                        style={{
                                                            padding: '5px 10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Ambil
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

export default LihatBahanSisaPage
