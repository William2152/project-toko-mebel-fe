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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Hapus User"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Apakah Anda yakin ingin menghapus user ini?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { handleDelete(deleteId); handleClose() }}>Ya</Button>
                    <Button onClick={handleClose} autoFocus>
                        Tidak
                    </Button>
                </DialogActions>
            </Dialog>
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
                <h2 className='text-4xl font-bold text-[#65558f] mb-2 mx-12'>Tambah Pengguna Baru</h2>
            </div>
            <div className='border-2 rounded-lg shadow-2xl mx-12'>
                <div className='container mx-auto px-12 py-12'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Tombol Submit */}
                        <div className='flex flex-col h-full'>
                            {update ? <><button type="submit" className="self-end bg-[#65558f] text-white px-4 py-3 rounded mt-4 font-bold text-xl rounded-lg">
                                Update User
                            </button>
                            </> : <><button type="submit" className="self-end bg-[#65558f] text-white px-4 py-3 rounded mt-4 font-bold text-xl rounded-lg">
                                Tambah User
                            </button></>}
                        </div>
                        <br />
                        {/* Role */}
                        <div className='flex gap-x-4'>
                            <label htmlFor="Role" className='w-[25%] text-xl font-bold'>Role</label>
                            <select {...register("role")} className="border-2 border-gray-300 rounded px-2 py-2 w-full" id="">
                                <option hidden value="">-- Pilih Role --</option>
                                <option value="adminkantor">Admin Kantor</option>
                                <option value="karyawankantor">Karyawan Kantor</option>
                                <option value="adminworkshop">Admin Workshop</option>
                                <option value="karyawanworkshop">Karyawan Workshop</option>
                            </select>
                            {errors.role && <span className="text-red-500 text-sm">{String(errors.role?.message)}</span>}
                        </div>
                        <br />
                        {/* Nama Lengkap */}
                        <div className='flex gap-x-4'>
                            <label htmlFor="name" className='w-[25%] text-xl font-bold'>Nama Lengkap</label>
                            <input
                                type="text"
                                id="name"
                                {...register("nama", { required: "Nama Lengkap is required" })}
                                className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                            />
                            {errors.nama && <span className="text-red-500 text-sm">{String(errors.nama.message)}</span>}
                        </div>
                        <br />

                        {/* Username */}
                        <div className='flex gap-x-4'>
                            <label htmlFor="username" className='w-[25%] text-xl font-bold'>Username</label>
                            <input
                                type="text"
                                id="username"
                                {...register("username", { required: "Username is required" })}
                                className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                            />
                            {errors.username && <span className="text-red-500 text-sm">{String(errors.username.message)}</span>}
                        </div>
                        <br />

                        {/* Email */}
                        <div className='flex gap-x-4'>
                            <label htmlFor="email" className='w-[25%] text-xl font-bold'>Email</label>
                            <input
                                type="email"
                                id="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email" }
                                })}
                                className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                            />
                            {errors.email && <span className="text-red-500 text-sm">{String(errors.email.message)}</span>}
                        </div>
                        <br />
                        {/* Password */}
                        {update ? <></> : <><div className='flex gap-x-4'>
                            <label htmlFor="email" className='w-[25%] text-xl font-bold'>Password</label>
                            <input
                                type="password"
                                id="password"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                                className="border-2 border-gray-300 rounded px-2 py-2 w-full mb-5"
                            />
                            {errors.password && <span className="text-red-500 text-sm">{String(errors.password.message)}</span>}
                        </div></>}

                    </form>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        {/* Search Bar */}
                        <div className="px-4 py-2 flex justify-between items-center">
                            <TextField
                                label="Cari User"
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
                                            <TableCell colSpan={5} align="center">
                                                <CircularProgress />
                                            </TableCell>
                                        </TableRow>
                                    ) : data.length > 0 ? (
                                        data.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{row.nama}</TableCell>
                                                <TableCell>{row.username}</TableCell>
                                                <TableCell>{row.email}</TableCell>
                                                <TableCell>{row.role}</TableCell>
                                                <TableCell>
                                                    <button onClick={() => handleUpdate(row)}
                                                        style={{
                                                            padding: '5px 10px',
                                                            marginRight: '10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}>Update</button>
                                                    <button onClick={() => { setDeleteId(row.id); setOpen(true) }}
                                                        style={{
                                                            padding: '5px 10px',
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
        </>
    );
}

export default TambahUserPage;
