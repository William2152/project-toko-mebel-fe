import axios from "axios";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { Fragment, useEffect, useState } from "react";
import { CircularProgress, IconButton, Snackbar, TablePagination, TextField } from "@mui/material";
import { RootState } from "../../app/storeRedux";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import CloseIcon from '@mui/icons-material/Close';

function MasterBahanPage() {
    interface DataBahan {
        id: number;
        nama: string;
    }

    interface DataSatuan {
        id: number;
        nama: string;
        satuan_terkecil: string;
        konversi: number;
    }

    const schemaBahan = Joi.object({
        namaBahan: Joi.string().required().messages({
            "string.empty": "Nama bahan harus diisi",
        }),
    });
    const schemaSatuan = Joi.object({
        satuanBahan: Joi.string().required().messages({
            "string.empty": "Satuan bahan harus diisi",
        }),
        satuanTerkecil: Joi.string().required().messages({
            "string.empty": "Satuan terkecil harus diisi",
        }),
        konversi: Joi.number().required().messages({
            "number.base": "Konversi harus diisi",
        }),
    });

    const token = useSelector((state: RootState) => state.localStorage.value);
    const formBahan = useForm({ resolver: joiResolver(schemaBahan) });
    const { register: registerBahan, handleSubmit: handleSubmitBahan, formState: { errors: errorsBahan }, reset: resetBahan, setValue: setBahan } = formBahan;
    const formSatuan = useForm({ resolver: joiResolver(schemaSatuan) });
    const { register: registerSatuan, handleSubmit: handleSubmitSatuan, formState: { errors: errorsSatuan }, reset: resetSatuan, setValue: setSatuan } = formSatuan;
    const [searchTermBahan, setSearchTermBahan] = useState("");
    const [searchTermSatuan, setSearchTermSatuan] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [dataBahan, setDataBahan] = useState<DataBahan[]>([]);
    const [dataSatuan, setDataSatuan] = useState<DataSatuan[]>([]);
    const [pageBahan, setPageBahan] = useState<number>(0);
    const [pageSatuan, setPageSatuan] = useState<number>(0);
    const [rowsPerPageBahan, setRowsPerPageBahan] = useState<number>(10);
    const [rowsPerPageSatuan, setRowsPerPageSatuan] = useState<number>(10);
    const [totalPagesBahan, setTotalPagesBahan] = useState<number>(0);
    const [totalPagesSatuan, setTotalPagesSatuan] = useState<number>(0);
    const [reload, setReload] = useState<boolean>(false);
    const [updateIdBahan, setUpdateIdBahan] = useState<number>(0);
    const [updateIdSatuan, setUpdateIdSatuan] = useState<number>(0);
    const [updateSatuan, setUpdateSatuan] = useState<boolean>(false);
    const [updateBahan, setUpdateBahan] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Handle page change
    const handleChangePageBahan = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPageBahan(newPage);
    };

    // Handle page change
    const handleChangePageSatuan = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPageSatuan(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPageBahan = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPageBahan(parseInt(event.target.value, 10));
        setPageBahan(0); // Reset to the first page
    };

    // Handle rows per page change
    const handleChangeRowsPerPageSatuan = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPageSatuan(parseInt(event.target.value, 10));
        setPageSatuan(0); // Reset to the first page
    };

    const handleUpdateBahan = (row: Data) => {
        console.log('Updating row with ID:', row.id);
        setBahan('namaBahan', row.nama);
        setUpdateIdBahan(row.id);
        setUpdateBahan(true);
    };

    const handleUpdateSatuan = (row: Data) => {
        console.log('Updating row with ID:', row.id);
        setSatuan('satuanBahan', row.nama);
        setSatuan('satuanTerkecil', row.satuan_terkecil);
        setSatuan('konversi', row.konversi);
        setUpdateIdSatuan(row.id);
        setUpdateSatuan(true);
    };

    const handleDeleteBahan = async (id: number) => {
        console.log('Deleting row with ID:', id);
        await axios.delete(`http://localhost:6347/api/bahan/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        setError('Berhasil Menghapus Bahan');
        setReload(!reload);
    };
    const handleDeleteSatuan = async (id: number) => {
        console.log('Deleting row with ID:', id);
        await axios.delete(`http://localhost:6347/api/satuan/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        setError('Berhasil Menghapus Satuan');
        setReload(!reload);
    };

    useEffect(() => {
        console.log('searchTermBahan:', searchTermBahan);
        console.log('rowsPerPageBahan:', rowsPerPageBahan);
        console.log('pageBahan:', pageBahan + 1);
        setLoading(true);
        axios.get(`http://localhost:6347/api/bahan?search=${searchTermBahan}&page=${pageBahan + 1}&per_page=${rowsPerPageBahan}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                setLoading(false);
                console.log(response.data);

                const dataWithNo = response.data.data.map((item: Omit<DataBahan, 'no'>, index: number) => ({
                    ...item,
                    no: index + 1,
                }));
                setDataBahan(dataWithNo);
                setTotalPagesBahan(response.data.total_page);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, [searchTermBahan, rowsPerPageBahan, pageBahan, reload]);

    useEffect(() => {
        axios.get(`http://localhost:6347/api/satuan?search=${searchTermSatuan}&page=${pageSatuan + 1}&per_page=${rowsPerPageSatuan}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response.data);

                const dataWithNo = response.data.data.map((item: Omit<DataSatuan, 'no'>, index: number) => ({
                    ...item,
                    no: index + 1,
                }));
                setDataSatuan(dataWithNo);
                setTotalPagesSatuan(response.data.total_page);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, [searchTermSatuan, rowsPerPageSatuan, pageSatuan, reload]);

    const onSubmitBahan = async (data: any) => {
        if (updateBahan) {
            const response = await axios.put(`http://localhost:6347/api/bahan/${updateIdBahan}`, {
                nama: data.namaBahan,
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setReload(!reload);
            resetBahan();
            console.log(response);
            setUpdateBahan(false);
        } else {
            try {
                const response = await axios.post("http://localhost:6347/api/bahan", {
                    nama: data.namaBahan,
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                setReload(!reload);
                resetBahan();
                console.log(response);
                setError('Berhasil Menambahkan Bahan');
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data.message);
                }
            }
        }
    }

    const onSubmitSatuan = async (data: any) => {
        if (updateSatuan) {
            const response = await axios.put(`http://localhost:6347/api/satuan/${updateIdSatuan}`, {
                nama: data.satuanBahan,
                satuan_terkecil: data.satuanTerkecil,
                konversi: data.konversi
            },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setReload(!reload);
            resetSatuan();
            console.log(response);
            setUpdateSatuan(false);
        } else {
            try {
                const response = await axios.post("http://localhost:6347/api/satuan", {
                    nama: data.satuanBahan,
                    satuan_terkecil: data.satuanTerkecil,
                    konversi: data.konversi
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                setReload(!reload);
                resetSatuan();
                console.log(response);
                setError('Berhasil Menambahkan Satuan');
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data.message);
                }
            }
        }
    }

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
            {/* Header */}
            <div className="text-center mb-8 bg-[#65558f] rounded-lg py-2">
                <h2 className="text-4xl font-bold text-white tracking-tight">Master Bahan</h2>
                <p className="mt-2 text-lg text-white">
                    Berikut adalah Form Input Nama dan Satuan Bahan
                </p>
            </div>

            {/* Tambah Nama Bahan */}
            <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
                <div className="p-8">
                    <h3 className="text-2xl font-bold mb-6">Tambah Nama Bahan</h3>
                    <form onSubmit={handleSubmitBahan(onSubmitBahan)}>
                        <div className="mb-4">
                            <label
                                htmlFor="namaBahan"
                                className="block text-lg font-medium text-gray-700 mb-2"
                            >
                                Nama Bahan
                            </label>
                            <input
                                type="text"
                                id="namaBahan"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                {...registerBahan("namaBahan")}
                                placeholder="Masukkan nama bahan"
                            />
                            {errorsBahan.namaBahan && (
                                <p className="text-red-500 text-sm mt-1">
                                    {String(errorsBahan.namaBahan.message)}
                                </p>
                            )}
                        </div>
                        {updateBahan ?
                            <>
                                <button
                                    type="submit"
                                    className="bg-[#65558f] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition mb-5"
                                >
                                    Update Bahan
                                </button>
                            </>
                            :
                            <>
                                <button
                                    type="submit"
                                    className="bg-[#65558f] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition mb-5"
                                >
                                    Tambah Bahan
                                </button>
                            </>}
                    </form>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        {/* Search Bar */}
                        <div className="px-4 py-2 flex justify-between items-center">
                            <TextField
                                label="Cari Bahan"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchTermBahan}
                                onChange={(e) => setSearchTermBahan(e.target.value)}
                            />
                        </div>

                        <TableContainer sx={{ maxHeight: 1000 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Nama Bahan</TableCell>
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
                                    ) : dataBahan.length > 0 ? (
                                        dataBahan.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.nama}</TableCell>
                                                <TableCell><button onClick={() => handleUpdateBahan(row)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        marginRight: '10px',
                                                        backgroundColor: '#4CAF50',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                    }}>Update</button><button onClick={() => handleDeleteBahan(row.id)}
                                                        style={{
                                                            padding: '5px 10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}>Delete</button></TableCell>
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
                                Page {pageBahan + 1} of {totalPagesBahan}
                            </span>
                            <TablePagination
                                rowsPerPageOptions={[10, 20, 50]}
                                component="div"
                                count={totalPagesBahan * rowsPerPageBahan}
                                rowsPerPage={rowsPerPageBahan}
                                page={pageBahan}
                                onPageChange={handleChangePageBahan}
                                onRowsPerPageChange={handleChangeRowsPerPageBahan}
                            />
                        </div>
                    </Paper>
                </div>
            </Paper>

            {/* Tambah Satuan Bahan */}
            <Paper className="overflow-hidden shadow-lg rounded-xl bg-white mt-10">
                <div className="p-8">
                    <h3 className="text-2xl font-bold mb-6 text-[#65558f]">Tambah Satuan Bahan</h3>
                    <form onSubmit={handleSubmitSatuan(onSubmitSatuan)}>
                        <div className="mb-4">
                            <label
                                htmlFor="satuanBahan"
                                className="block text-lg font-medium text-gray-700 mb-2"
                            >
                                Satuan Bahan
                            </label>
                            <input
                                type="text"
                                id="satuanBahan"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                placeholder="Masukkan satuan bahan"
                                {...registerSatuan("satuanBahan")}
                            />
                            {errorsSatuan.satuanBahan && (
                                <p className="text-red-500 text-sm mt-1">
                                    {String(errorsSatuan.satuanBahan.message)}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="satuanTerkecil"
                                className="block text-lg font-medium text-gray-700 mb-2"
                            >
                                Satuan Terkecil Bahan
                            </label>
                            <input
                                type="text"
                                id="satuanTerkecil"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                placeholder="Masukkan satuan terkecil bahan"
                                {...registerSatuan("satuanTerkecil")}
                            />
                            {errorsSatuan.satuanTerkecil && (
                                <p className="text-red-500 text-sm mt-1">
                                    {String(errorsSatuan.satuanTerkecil.message)}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="konversi"
                                className="block text-lg font-medium text-gray-700 mb-2"
                            >
                                Satuan Bahan ke Satuan Terkecil Bahan
                            </label>
                            <input
                                type="number"
                                id="konversi"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                placeholder="Masukkan nilai konversi"
                                {...registerSatuan("konversi")}
                            />
                            {errorsSatuan.konversi && (
                                <p className="text-red-500 text-sm mt-1">
                                    {String(errorsSatuan.konversi.message)}
                                </p>
                            )}
                        </div>
                        {updateSatuan ?
                            <>
                                <button
                                    type="submit"
                                    className="bg-[#65558f] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition mb-5"
                                >
                                    Update Satuan
                                </button>
                            </>
                            :
                            <>
                                <button
                                    type="submit"
                                    className="bg-[#65558f] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition mb-5"
                                >
                                    Tambah Satuan
                                </button>
                            </>
                        }
                    </form>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        {/* Search Bar */}
                        <div className="px-4 py-2 flex justify-between items-center">
                            <TextField
                                label="Cari Bahan"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={searchTermSatuan}
                                onChange={(e) => setSearchTermSatuan(e.target.value)}
                            />
                        </div>

                        <TableContainer sx={{ maxHeight: 1000 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Satuan</TableCell>
                                        <TableCell>Satuan Terkecil</TableCell>
                                        <TableCell>Konversi</TableCell>
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
                                    ) : dataSatuan.length > 0 ? (
                                        dataSatuan.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.nama}</TableCell>
                                                <TableCell>{row.satuan_terkecil}</TableCell>
                                                <TableCell>{row.konversi}</TableCell>
                                                <TableCell><button onClick={() => handleUpdateSatuan(row)}
                                                    style={{
                                                        padding: '5px 10px',
                                                        marginRight: '10px',
                                                        backgroundColor: '#4CAF50',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                    }}>Update</button><button onClick={() => handleDeleteSatuan(row.id)}
                                                        style={{
                                                            padding: '5px 10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}>Delete</button></TableCell>
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
                                Page {pageSatuan + 1} of {totalPagesSatuan}
                            </span>
                            <TablePagination
                                rowsPerPageOptions={[10, 20, 50]}
                                component="div"
                                count={totalPagesSatuan * rowsPerPageSatuan}
                                rowsPerPage={rowsPerPageSatuan}
                                page={pageSatuan}
                                onPageChange={handleChangePageSatuan}
                                onRowsPerPageChange={handleChangeRowsPerPageSatuan}
                            />
                        </div>
                    </Paper>
                </div>
            </Paper>
        </>
    );
}

export default MasterBahanPage;
