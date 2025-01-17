import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { RootState } from '../../app/storeRedux';
import { useSelector } from 'react-redux';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, CircularProgress, TablePagination, TextField } from '@mui/material';

interface Data {
    id: number;
    no: number;
    nama: string;
    username: string;
    email: string;
    role: string;
    password: string;
}

const isUsernameDuplicate = async (username: string) => {
    try {
        const response = await axios.get(`http://localhost:6347/api/users?username=${username}`);
        return response.data.length > 0;
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    }
};

const isEmailDuplicate = async (email: string) => {
    try {
        const response = await axios.get(`http://localhost:6347/api/users?email=${email}`);
        return response.data.length > 0;
    } catch (error) {
        console.error('Error fetching data:', error);
        return false;
    }
};

function TambahUserPage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const schema = Joi.object({
        username: Joi.string()
            .required()
            .external(async (value) => {
                const isDuplicate = await isUsernameDuplicate(value);
                if (isDuplicate) {
                    throw new Error('Username already exists');
                }
            })
            .messages({
                'string.empty': 'Username is required',
            }),
        nama: Joi.string().required().messages({
            'string.empty': 'Name is required',
        }),
        password: Joi.string()
            .min(10)
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])'))
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 10 characters long',
                'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
            }),
        role: Joi.string()
            .valid('adminkantor', 'karyawankantor', 'adminworkshop', 'karyawanworkshop')
            .required()
            .messages({
                'string.empty': 'Role is required',
                'any.only': 'Invalid role selection',
            }),
        email: Joi.string()
            .email({ tlds: { allow: false } }) // Memastikan email memiliki format yang valid
            .required()
            .external(async (value) => {
                // Asumsikan Anda memiliki fungsi `isEmailDuplicate` untuk mengecek email di database
                const isDuplicate = await isEmailDuplicate(value);
                if (isDuplicate) {
                    throw new Error('Email already exists');
                }
            })
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Invalid email format',
            }),
    });

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<Data>({ resolver: joiResolver(schema) });
    const [reload, setReload] = useState(false);
    const [error, setError] = useState("");
    const [update, setUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(0);
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Data[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    console.log(token);

    const handleUpdate = (row: Data) => {
        console.log('Updating row with ID:', row.id);
        try {
            setValue('username', row.username);
            setValue('nama', row.nama);
            setValue('password', row.password);
            setValue('role', row.role);
            setValue('email', row.email);
            setUpdateId(row.id);
            setUpdate(true);
        } catch (error) {
            console.error('Error updating row:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
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

    const handleDelete = async (id: number) => {
        console.log('Deleting row with ID:', id);
        const response = await axios.delete(`http://localhost:6347/api/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log(response);
        setReload(!reload);
    };

    const onSubmit = async (data: Data) => {
        try {
            let response;
            if (update) {
                response = await axios.put(`http://localhost:6347/api/users/${updateId}/role`, {
                    role: data.role,
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                setReload(!reload);
                console.log(response);
                setUpdate(false);
                reset();
            } else {
                response = await axios.post("http://localhost:6347/api/users", {
                    username: data.username,
                    nama: data.nama,
                    password: data.password,
                    role: data.role,
                    email: data.email
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                setReload(!reload);
                console.log(response);
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Menangani error dan menyimpannya dalam state
                if (error.response) {
                    // Jika backend memberikan response error
                    // setError(`Error: ${error.response.data.message || 'Something went wrong'}`);
                    setError(String(error.response.data.message));
                    // console.log(error.response.data.message);

                } else if (error.request) {
                    // Jika request berhasil dikirim tetapi tidak ada response
                    setError('No response received from the server');
                    console.log(error.request);

                } else {
                    // Jika ada masalah dalam pembuatan request
                    // setError(`Error: ${error.message}`);
                    console.log(error);

                }
            }
        }

    };

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:6347/api/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response.data);

                const dataWithNo = response.data.data.map((item: Omit<Data, 'no'>, index: number) => ({
                    ...item,
                    no: index + 1,
                }));
                setData(dataWithNo);
                setTotalPages(response.data.total_page);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
    }, [reload]);

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
            <div className="text-center bg-[#65558f] rounded-lg py-2 mb-12">
                <h1 className="text-4xl font-bold text-white tracking-tight">
                    Tambah User
                </h1>
                <p className="mt-2 text-lg text-white">
                    Halaman untuk menambahkan user baru yang dapat mengakses sistem ini.
                </p>
            </div>
            <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
                <div className="p-8">
                    {/* Form Tambah/Update User */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="block text-lg font-semibold mb-2">
                                    Role
                                </label>
                                <select
                                    {...register("role")}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#65558f]"
                                    id="role"
                                >
                                    <option hidden value="">-- Pilih Role --</option>
                                    <option value="adminkantor">Admin Kantor</option>
                                    <option value="karyawankantor">Karyawan Kantor</option>
                                    <option value="adminworkshop">Admin Workshop</option>
                                    <option value="karyawanworkshop">Karyawan Workshop</option>
                                </select>
                                {errors.role && <span className="text-red-500 text-sm">{String(errors.role?.message)}</span>}
                            </div>
                            {/* Nama Lengkap */}
                            <div>
                                <label htmlFor="nama" className="block text-lg font-semibold mb-2">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    id="nama"
                                    {...register("nama")}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#65558f]"
                                    placeholder="Masukkan nama lengkap"
                                />
                                {errors.nama && <span className="text-red-500 text-sm">{String(errors.nama?.message)}</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Username */}
                            <div>
                                <label htmlFor="username" className="block text-lg font-semibold mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    {...register("username")}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#65558f]"
                                    placeholder="Masukkan username"
                                />
                                {errors.username && <span className="text-red-500 text-sm">{String(errors.username?.message)}</span>}
                            </div>
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-lg font-semibold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    {...register("email")}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#65558f]"
                                    placeholder="Masukkan email"
                                />
                                {errors.email && <span className="text-red-500 text-sm">{String(errors.email?.message)}</span>}
                            </div>
                        </div>

                        {!update && (
                            <div>
                                <label htmlFor="password" className="block text-lg font-semibold mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    {...register("password")}
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-[#65558f]"
                                    placeholder="Masukkan password"
                                />
                                {errors.password && <span className="text-red-500 text-sm">{String(errors.password?.message)}</span>}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[#65558f] hover:bg-[#54437f] text-white px-6 py-2 rounded-lg font-semibold"
                            >
                                {update ? "Update User" : "Tambah User"}
                            </button>
                        </div>
                    </form>

                    {/* Table */}
                    <Paper sx={{ width: "100%", overflow: "hidden" }} className="mt-8">
                        <div className="px-4 py-2">
                            <TextField
                                label="Cari User"
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
                                        <TableCell>Nama</TableCell>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Aksi</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : data.length > 0 ? (
                                        data.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.no}</TableCell>
                                                <TableCell>{row.nama}</TableCell>
                                                <TableCell>{row.username}</TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{row.role}</TableCell>
                                                <TableCell>
                                                    <button
                                                        onClick={() => handleUpdate(row)}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg mr-2"
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setDeleteId(row.id);
                                                            setOpen(true);
                                                        }}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                                                    >
                                                        Delete
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                Tidak ada data yang sesuai
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className="flex justify-between items-center px-4 py-2">
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
            </Paper>
        </>
    );


}

export default TambahUserPage;
