import axios from 'axios';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { RootState } from '../../../app/storeRedux';
import { Autocomplete, Box, Button, CircularProgress, IconButton, Modal, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import { BahanData, BahanProdukData, DetailBahanProdukData, SatuanData } from '../../interface';
import CloseIcon from '@mui/icons-material/Close';
import { set } from 'date-fns';

function ProdukDetailPage() {
    const { id } = useParams();
    const id_projek = localStorage.getItem('id_projek');
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [dataBahan, setDataBahan] = useState<BahanProdukData[]>([]);
    const [dataBahanDetail, setDataBahanDetail] = useState<DetailBahanProdukData[]>([]);
    const [dataNamaBahan, setDataNamaBahan] = useState<BahanData[]>([])
    const [dataSatuan, setDataSatuan] = useState<SatuanData[]>([])
    const { register, handleSubmit, reset, setValue } = useForm<DetailBahanProdukData>();
    const { register: registerJasa, handleSubmit: handleSubmitJasa, reset: resetJasa, control } = useForm();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredNamaBahan, setFilteredNamaBahan] = useState<BahanData[]>([]);
    const [update, setUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(0);
    const [reload, setReload] = useState(false);
    const [openJasa, setOpenJasa] = useState(false);
    const [openDaftarJasa, setOpenDaftarJasa] = useState(false);
    const [satuanOptions, setSatuanOptions] = useState<SatuanData[]>([]);
    const [dataJasa, setDataJasa] = useState([]);
    const [reloadTableJasa, setReloadTableJasa] = useState(false);
    const [error, setError] = useState('');

    const handleCloseJasa = () => {
        setOpenJasa(false); // Tutup modal
        resetJasa();
    };

    const handleCloseDaftarJasa = () => {
        setOpenDaftarJasa(false); // Tutup modal
    };

    // Handle page change
    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };

    const handleUpdate = (detail: DetailBahanProdukData) => {
        setValue('qty', detail.qty);
        setValue('keterangan', detail.keterangan);
        setValue('id_bahan', detail.id_bahan);
        setValue('id_satuan', detail.id_satuan);
        setUpdateId(detail.id_bahan);
        setUpdate(true);
    };

    const handleSelesai = async () => {
        await axios.put(`http://localhost:6347/api/proyek/${id_projek}/produk/${id}/status`, { status: 1 }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        setError("Berhasil Selesaikan Produk");
    }

    const handleDelete = async (id: number) => {
        setDataBahanDetail(dataBahanDetail.filter((detail) => detail.id_bahan !== id));
    };

    const filterNamaBahan = () => {
        const filtered = dataNamaBahan.filter((bahan) => !dataBahanDetail.some((detail) => detail.id_bahan === bahan.id));
        if (update) {
            setFilteredNamaBahan(dataNamaBahan);
        } else {
            setFilteredNamaBahan(filtered);
        }
        console.log(filteredNamaBahan);
        console.log(update);

    }

    const fetchProduk = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:6347/api/bahan`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log(response);
            setDataNamaBahan(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching produk:', error);
            setLoading(false);
        }
    };

    const fetchSatuan = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:6347/api/satuan`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log(response);
            setDataSatuan(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching produk:', error);
            setLoading(false);
        }
    };

    const fetchBahan = async () => {
        try {
            const response = await axios.get(`http://localhost:6347/api/produk/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setDataBahan(response.data);
            setDataBahanDetail(response.data.detail);
        } catch (error) {
            console.error('Error fetching bahan:', error);
        }
    };

    const getNamaBahan = async (id: number) => {
        const response = await axios.get(`http://localhost:6347/api/bahan/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data.nama;
    }

    const getNamaSatuan = async (id: number) => {
        const response = await axios.get(`http://localhost:6347/api/satuan/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        return response.data.nama;
    }

    const handleSave = async () => {
        console.log(dataBahanDetail);

        const payload = {
            detail: dataBahanDetail,
        };
        console.log("payload : " + payload);

        try {
            const response = await axios.put(`http://localhost:6347/api/produk/${id}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(response);
            setError("Berhasil Mengubah Data");
        } catch (error) {
            console.error('Error fetching bahan:', error);
            setError("Gagal Mengubah Data");
        }
    }

    const handleDeleteJasa = async (id: number) => {
        await axios.delete(`http://localhost:6347/api/produk-jasa/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        setReloadTableJasa(!reloadTableJasa);
    }

    const onSubmit = async (data: DetailBahanProdukData) => {
        console.log(data);
        if (update) {
            dataBahanDetail.map((detail) => {
                if (detail.id_bahan === updateId) {
                    detail.qty = data.qty;
                    detail.keterangan = data.keterangan;
                }
            })
            setUpdate(false);
            reset();
            setReload(!reload);
        } else {
            const namaBahan = await getNamaBahan(data.id_bahan);
            const namaSatuan = await getNamaSatuan(data.id_satuan);
            setDataBahanDetail([
                ...dataBahanDetail,
                {
                    id_bahan: data.id_bahan,
                    nama_bahan: namaBahan,
                    id_satuan: data.id_satuan,
                    nama_satuan: namaSatuan,
                    qty: data.qty,
                    keterangan: data.keterangan
                }
            ]);
            reset();
            setReload(!reload);
        }
        console.log(dataBahanDetail);
    };

    const onSubmitJasa = async (data: any) => {
        console.log("tes: " + data.nama);
        try {
            const response = await axios.post('http://localhost:6347/api/produk-jasa', {
                id_produk: id,
                id_satuan: data.satuan.id,
                nama: data.nama,
                qty: data.quantity,
                harga_satuan: data.harga_satuan,
                keterangan: data.keterangan
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(response);
            setOpenJasa(false);
            resetJasa();
        } catch (error) {
            console.error('Error fetching bahan:', error);
            setError(error.response.data.message);
        }
    }

    useEffect(() => {
        fetchBahan();
        fetchProduk();
        fetchSatuan();
    }, []);

    useEffect(() => {
        if (update) {
            filterNamaBahan();
            setReload(!reload);
        } else {
            filterNamaBahan();
        }
    }, [dataBahanDetail, update]);

    useEffect(() => {
        setValue('id_bahan', updateId);
    }, [reload]);

    useEffect(() => {
        const fetchSatuan = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:6347/api/master/satuan`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSatuanOptions(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching produk:', error);
                setLoading(false);
                setError(error.response.data.message);
            }
        };
        fetchSatuan();
    }, []);

    useEffect(() => {
        const fetchJasa = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:6347/api/produk-jasa?id_produk=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDataJasa(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching produk:', error);
                setLoading(false);
                setError(error.response.data.message);
            }
        }
        fetchJasa();
    }, [openDaftarJasa, reloadTableJasa]);
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
                <h2 className="text-5xl font-bold text-[#65558f] mb-6 mx-12">Detail Produk</h2>
            </div>
            <div className="border-2 rounded-lg shadow-2xl mx-12 px-12">
                <div className='container mx-auto py-12'>
                    <div className="flex justify-between">
                        <button
                            onClick={handleSelesai}
                            className="px-8 py-2 me-5 mt-5 mb-5 bg-[#65558f] text-white rounded-lg text-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-transform transform hover:scale-105 focus:outline-none"
                        >
                            Selesai
                        </button>
                        <button
                            onClick={() => handleSave()}
                            className="px-6 py-2 mb-5 text-white bg-[#65558f] rounded-lg hover:bg-green-500 mt-4"
                        >
                            Save Produk
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center">
                            <p className="text-2xl font-bold text-[#65558f]">Nama Produk:</p>
                            <p className="text-2xl ml-4">{dataBahan.nama}</p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="bahan" className="block text-xl font-bold text-[#65558f]">Bahan</label>
                                <select
                                    id="bahan"
                                    {...register('id_bahan')}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#65558f]"
                                >
                                    <option hidden value="">Pilih Bahan</option>
                                    {filteredNamaBahan.map((bahan: BahanData) => (
                                        <option key={bahan.id} value={bahan.id} disabled={update}>
                                            {bahan.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="satuan" className="block text-xl font-bold text-[#65558f]">Satuan</label>
                                <select
                                    id="satuan"
                                    {...register('id_satuan')}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#65558f]"
                                >
                                    <option hidden value="">Pilih Satuan</option>
                                    {dataSatuan.map((satuan: SatuanData) => (
                                        <option key={satuan.id} value={satuan.id} disabled={update}>
                                            {satuan.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="quantity" className="block text-xl font-bold text-[#65558f]">Quantity</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="quantity"
                                    {...register('qty')}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#65558f]"
                                />
                            </div>

                            <div>
                                <label htmlFor="keterangan" className="block text-xl font-bold text-[#65558f]">Keterangan</label>
                                <input
                                    type="text"
                                    id="keterangan"
                                    {...register('keterangan')}
                                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#65558f]"
                                />
                            </div>
                        </div>

                        {update ?
                            <>
                                <button
                                    type="submit"
                                    className="px-6 py-2 text-white bg-[#65558f] rounded-lg hover:bg-[#534474] me-5"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => { setUpdate(false); reset(); }}
                                    className="px-6 py-2 text-white bg-[#65558f] rounded-lg hover:bg-[#534474]"
                                >
                                    Batal
                                </button>
                            </>
                            :
                            <> <button
                                type="submit"
                                className="px-6 py-2 text-white bg-[#65558f] rounded-lg hover:bg-[#534474] me-5"
                            >
                                Tambah
                            </button>
                                <button
                                    onClick={() => setOpenJasa(true)}
                                    className="px-6 py-2 me-5 bg-[#65558f] text-white rounded-lg shadow hover:bg-red-600 focus:outline-none"
                                >
                                    Tambah Biaya Jasa
                                </button>
                                <button
                                    onClick={() => setOpenDaftarJasa(true)}
                                    className="px-6 py-2 bg-[#65558f] text-white rounded-lg shadow hover:bg-red-600 focus:outline-none"
                                >
                                    Daftar Biaya Jasa
                                </button>
                            </>

                        }

                    </form>
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
                                        <TableCell>Nama Bahan</TableCell>
                                        <TableCell>Satuan</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Keterangan</TableCell>
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
                                    ) : dataBahanDetail.length > 0 ? (
                                        dataBahanDetail.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.nama_bahan}</TableCell>
                                                <TableCell>{row.nama_satuan}</TableCell>
                                                <TableCell>{row.qty}</TableCell>
                                                <TableCell>{row.keterangan}</TableCell>
                                                <TableCell>
                                                    <button onClick={() => { handleUpdate(row) }}
                                                        style={{
                                                            padding: '5px 10px',
                                                            marginRight: '10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}>Update</button>
                                                    <button onClick={() => handleDelete(row.id_bahan)}
                                                        style={{
                                                            padding: '5px 10px',
                                                            marginRight: '10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}>Delete</button>
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
            {/* Modal Biaya Jasa */}
            <Modal open={openJasa} onClose={handleCloseJasa}>
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
                    <h2 className="text-2xl font-bold mb-4">Tambah Biaya Jasa</h2>
                    <form onSubmit={handleSubmitJasa(onSubmitJasa)} className="space-y-4">
                        {/* Input Nama */}
                        <Controller
                            name="nama"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Nama"
                                    variant="outlined"
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
                                    fullWidth
                                    label="Quantity"
                                    type="number"
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                />
                            )}
                        />
                        {/* Searchable Combobox Satuan */}
                        <div className="flex-1 mr-4">
                            <Controller
                                name="satuan"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        {...field}
                                        value={field.value || null} // Default nilai untuk menghindari undefined
                                        options={satuanOptions} // Pilihan satuan
                                        getOptionLabel={(option) => option.nama} // Label untuk opsi
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Pilih Satuan"
                                                variant="outlined"
                                            />
                                        )}
                                        onChange={(_, data) => field.onChange(data)} // Set nilai ke form
                                        isOptionEqualToValue={(option, value) => option.id === value.id} // Bandingkan berdasarkan ID unik
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}> {/* Gunakan ID sebagai key */}
                                                {option.nama}
                                            </li>
                                        )}
                                    />
                                )}
                            />
                        </div>
                        {/* Input Harga Satuan */}
                        <Controller
                            name="harga_satuan"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Harga Satuan"
                                    type="number"
                                    inputProps={{ min: 0, step: "0.01" }}
                                    variant="outlined"
                                />
                            )}
                        />
                        {/* Input Keterangan */}
                        <Controller
                            name="keterangan"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Keterangan"
                                    multiline
                                    rows={3}
                                    variant="outlined"
                                />
                            )}
                        />
                        <div className="flex justify-end space-x-4 mt-4">
                            <Button type="submit" variant="contained" color="primary">
                                Tambah
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={() => { handleCloseJasa(); }}>
                                Batal
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* Modal Daftar Biaya Jasa */}
            <Modal open={openDaftarJasa} onClose={handleCloseDaftarJasa}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 1000,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 300 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Nama Produk</TableCell>
                                        <TableCell>Nama Jasa</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Satuan</TableCell>
                                        <TableCell>Harga Satuan</TableCell>
                                        <TableCell>Subtotal</TableCell>
                                        <TableCell>Keterangan</TableCell>
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
                                    ) : dataJasa.length > 0 ? (
                                        dataJasa.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.nama_produk}</TableCell>
                                                <TableCell>{row.nama}</TableCell>
                                                <TableCell>{row.qty}</TableCell>
                                                <TableCell>{row.nama_satuan}</TableCell>
                                                <TableCell>{row.harga_satuan}</TableCell>
                                                <TableCell>{row.subtotal}</TableCell>
                                                <TableCell>{row.keterangan}</TableCell>
                                                <TableCell>
                                                    <button onClick={() => handleDeleteJasa(row.id)}
                                                        style={{
                                                            padding: '5px 10px',
                                                            marginRight: '10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}>Delete</button>
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
                </Box>
            </Modal>
        </>
    );
}

export default ProdukDetailPage;
