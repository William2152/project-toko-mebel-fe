import { IconButton, Snackbar, MenuItem, TextField, Autocomplete, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, TablePagination } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';

function InputPemakaianBahan() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const { control: controlHeader, handleSubmit: handleSubmitHeader, reset: resetHeader } = useForm();
    const { control: controlBahan, handleSubmit: handleSubmitBahan, reset: resetBahan } = useForm();
    const [error, setError] = useState("");
    const [proyekOptions, setProyekOptions] = useState([]);
    const [produkOptions, setProdukOptions] = useState([]);
    const [karyawanOptions, setKaryawanOptions] = useState([]);
    const [bahanOptions, setBahanOptions] = useState([]);
    const [satuanOptions, setSatuanOptions] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idProyek, setIdProyek] = useState(0);
    const [idProyekProduk, setIdProyekProduk] = useState(0);

    const onSubmitHeader = async (data) => {
        try {
            await axios.post('http://localhost:6347/api/history-bahan-keluar', {
                id_proyek_produk: data.produk.id,
                id_karyawan: data.karyawan.id,
                detail: detailData.map((item: any) => ({
                    id_history_bahan_masuk_detail: item.bahan.id,
                    qty: parseFloat(item.quantity),
                    id_satuan: item.satuan.id
                }))
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            resetHeader({
                proyek: null,
                produk: null,
                karyawan: null,
            });
            resetBahan({
                bahan: null,
                satuan: null,
                quantity: '',
            });
            setDetailData([]);
            setError("Berhasil Menambahkan Pemakaian Bahan");
        } catch (err) {
            console.log(err);
            setError(err.response.data.message);
        }
    };

    const onSubmitBahan = (data) => {
        console.log("Bahan Data: ", data); // Check the structure of the 'data' to ensure it's correct
        setDetailData(prevData => [...prevData, data]);  // Correctly append to the existing state
        resetBahan({
            bahan: null,
            satuan: null,
            quantity: '',
        });
    };


    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const proyekResponse = await axios.get('http://localhost:6347/api/master/proyek', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                const satuanResponse = await axios.get('http://localhost:6347/api/master/satuan', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                console.log(proyekResponse.data.data);
                setProyekOptions(await proyekResponse.data.data);
                setSatuanOptions(await satuanResponse.data.data);
            } catch (err) {
                console.log(err);

                setError("Gagal mengambil data dari server.");
            }
        };

        fetchOptions();
    }, []);

    useEffect(() => {
        const fetchProduk = async () => {
            const produkResponse = await axios.get(`http://localhost:6347/api/master/proyek-produk?id_proyek=${idProyek}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            console.log(produkResponse.data.data);

            setProdukOptions(await produkResponse.data.data);
        }
        if (idProyek)
            fetchProduk();
    }, [idProyek]);

    useEffect(() => {
        const fetchKaryawan = async () => {
            const karyawanResponse = await axios.get(`http://localhost:6347/api/master/karyawan?id_proyek_produk=${idProyekProduk}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(karyawanResponse.data.data);
            setKaryawanOptions(await karyawanResponse.data.data);
        }
        if (idProyekProduk)
            fetchKaryawan();
    }, [idProyekProduk]);

    useEffect(() => {
        const fetchBahan = async () => {
            const bahanResponse = await axios.get(`http://localhost:6347/api/master/bahan?id_proyek_produk=${idProyekProduk}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(bahanResponse.data.data);
            setBahanOptions(await bahanResponse.data.data);
        }
        if (idProyekProduk)
            fetchBahan();
    }, [idProyekProduk]);

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
            <div className='mb-12 mt-6'>
                <h2 className='text-4xl font-bold text-[#65558f] mb-2 px-12'>Input Pemakaian Bahan</h2>
            </div>
            <div className="px-12 my-6">
                <div className="mb-8">
                    <div className="py-6">
                        <div className="border-2 rounded-lg shadow-2xl">
                            <div className='px-12 py-12'>
                                {/* Form Header */}
                                <form onSubmit={handleSubmitHeader(onSubmitHeader)}>
                                    {/* Submit Button */}
                                    <div className="flex justify-end mb-5">
                                        <button type="submit" className="px-5 py-2 bg-[#65558f] text-white rounded-lg shadow-md">
                                            Submit Pemakaian Bahan
                                        </button>
                                    </div>
                                    {/* Form Controls */}
                                    <div className="flex justify-between items-center mb-4">
                                        {/* Searchable Combobox Proyek */}
                                        <div className="flex-1 mr-4">
                                            <Controller
                                                name="proyek"
                                                control={controlHeader}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        value={field.value || null}
                                                        options={proyekOptions}
                                                        getOptionLabel={(option) => option.nama}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Pilih Proyek"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                        onChange={(_, data) => {
                                                            field.onChange(data); // Tetapkan nilai ke form
                                                            setIdProyek(data?.id || null); // Set idProyek dengan id dari data yang dipilih
                                                        }}
                                                        getOptionSelected={(option, value) => option.id === value.id} // Pastikan opsi dipilih berdasarkan ID
                                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                                        renderOption={(props, option) => (
                                                            <li {...props} key={option.id}> {/* Gunakan ID untuk key */}
                                                                {option.nama}
                                                            </li>
                                                        )}
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* Searchable Combobox Produk */}
                                        <div className="flex-1 mr-4">
                                            <Controller
                                                name="produk"
                                                control={controlHeader}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        value={field.value || null}
                                                        options={produkOptions}
                                                        getOptionLabel={(option) => option.nama}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Pilih Produk"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                        onChange={(_, data) => { field.onChange(data); setIdProyekProduk(data?.id || null) }}
                                                        getOptionSelected={(option, value) => option.id === value.id} // Pastikan opsi dipilih berdasarkan ID
                                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                                        renderOption={(props, option) => (
                                                            <li {...props} key={option.id}> {/* Gunakan ID untuk key */}
                                                                {option.nama}
                                                            </li>
                                                        )}
                                                    />
                                                )}
                                            />
                                        </div>

                                        {/* Searchable Combobox Karyawan */}
                                        <div className="flex-1">
                                            <Controller
                                                name="karyawan"
                                                control={controlHeader}
                                                render={({ field }) => (
                                                    <Autocomplete
                                                        {...field}
                                                        value={field.value || null}
                                                        options={karyawanOptions}
                                                        getOptionLabel={(option) => option.nama}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Pilih Karyawan"
                                                                variant="outlined"
                                                            />
                                                        )}
                                                        onChange={(_, data) => field.onChange(data)}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </form>
                                {/* Additional Form Section */}
                                <form onSubmit={handleSubmitBahan(onSubmitBahan)}>
                                    <div className="mt-8">
                                        <h3 className="text-2xl font-semibold mb-4">Form Bahan</h3>
                                        <div className="flex justify-between items-center mb-4">
                                            {/* Searchable Combobox Bahan */}
                                            <div className="flex-1 mr-4">
                                                <Controller
                                                    name="bahan"
                                                    control={controlBahan}
                                                    render={({ field }) => (
                                                        <Autocomplete
                                                            {...field}
                                                            value={field.value || null}
                                                            options={bahanOptions}
                                                            getOptionLabel={(option) => option.nama}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Pilih Bahan"
                                                                    variant="outlined"
                                                                />
                                                            )}
                                                            onChange={(_, data) => field.onChange(data)}
                                                            isOptionEqualToValue={(option, value) => option.id === value.id} // Gunakan ID untuk pembandingan
                                                            renderOption={(props, option) => (
                                                                <li {...props} key={option.id}> {/* Gunakan ID sebagai key */}
                                                                    {option.nama}
                                                                </li>
                                                            )}
                                                        />
                                                    )}
                                                />
                                            </div>



                                            {/* Searchable Combobox Satuan */}
                                            <div className="flex-1 mr-4">
                                                <Controller
                                                    name="satuan"
                                                    control={controlBahan}
                                                    render={({ field }) => (
                                                        <Autocomplete
                                                            {...field}
                                                            value={field.value || null} // Default nilai untuk menghindari undefined
                                                            options={satuanOptions}
                                                            getOptionLabel={(option) => option.nama} // Label untuk opsi
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label="Pilih Satuan"
                                                                    variant="outlined"
                                                                />
                                                            )}
                                                            onChange={(_, data) => field.onChange(data)}
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


                                            {/* Input Quantity */}
                                            <div className="flex-1">
                                                <Controller
                                                    name="quantity"
                                                    control={controlBahan}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            type="number"
                                                            inputProps={{ step: "0.1" }}
                                                            label="Quantity"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <button type="submit" className="px-4 mb-5 py-2 bg-[#65558f] text-white rounded-lg shadow-md">
                                                Tambahkan Bahan
                                            </button>
                                        </div>
                                    </div>
                                </form>
                                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                                    <TableContainer sx={{ maxHeight: 400 }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>No</TableCell>
                                                    <TableCell>Nama Bahan</TableCell>
                                                    <TableCell>Satuan</TableCell>
                                                    <TableCell>Quantity</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {loading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={5} align="center">
                                                            <CircularProgress />
                                                        </TableCell>
                                                    </TableRow>
                                                ) : detailData.length > 0 ? (
                                                    detailData.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>{row.bahan?.nama || "N/A"}</TableCell>
                                                            <TableCell>{row.satuan?.nama || "N/A"}</TableCell>
                                                            <TableCell>{row.quantity}</TableCell>
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
                    </div>
                </div >
            </div >
        </>
    );
}

export default InputPemakaianBahan;
