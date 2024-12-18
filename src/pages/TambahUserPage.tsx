import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import axios from 'axios';
import { RootState } from '../../app/storeRedux';
import { useSelector } from 'react-redux';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface Data {
    id: number;
    no: number;
    nama: string;
    username: string;
    email: string;
    role: string;
}

interface UserFormData {
    username: string;
    name: string;
    password: string;
    role: string;
    email: string;
}

interface ColumnData {
    dataKey: keyof Data | "aksi";
    label: string;
    numeric?: boolean;
    width?: number;
}

const columns: ColumnData[] = [
    { width: 50, label: 'No', dataKey: 'no', numeric: true },
    { width: 100, label: 'Nama', dataKey: 'nama' },
    { width: 100, label: 'Username', dataKey: 'username' },
    { width: 150, label: 'Email', dataKey: 'email' },
    { width: 100, label: 'Role', dataKey: 'role' },
    { width: 100, label: 'Aksi', dataKey: 'aksi' },
];

const VirtuosoTableComponents: TableComponents<Data> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
        <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableHead {...props} ref={ref} />
    )),
    TableRow,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} />
    )),
};

function fixedHeaderContent() {
    return (
        <TableRow>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    variant="head"
                    align={column.numeric || false ? 'right' : 'left'}
                    style={{ width: column.width }}
                    sx={{ backgroundColor: 'background.paper' }}
                >
                    {column.label}
                </TableCell>
            ))}
        </TableRow>
    );
}

const handleUpdate = (row: Data) => {
    console.log('Updating row with ID:', row.id);
};

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
        name: Joi.string().required().messages({
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

    const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({ resolver: joiResolver(schema) });
    const [rows, setRows] = useState<Data[]>([]);
    const [reload, setReload] = useState(false);
    const [error, setError] = useState("");
    console.log(token);

    function rowContent(_index: number, row: Data) {
        return (
            <React.Fragment>
                {columns.map((column) => (
                    <TableCell
                        key={column.dataKey}
                        align={column.numeric || false ? 'right' : 'left'}
                    >
                        {column.dataKey === 'aksi' ? (
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10px' }}>
                                <button onClick={() => handleUpdate(row)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}>Update</button>
                                <button onClick={() => handleDelete(row.id)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}>Delete</button>
                            </div>
                        ) : (
                            row[column.dataKey as keyof Data] !== undefined
                                ? row[column.dataKey as keyof Data]
                                : '-'
                        )}
                    </TableCell>
                ))}
            </React.Fragment>
        );
    }

    const handleDelete = async (id: number) => {
        console.log('Deleting row with ID:', id);
        const response = await axios.delete(`http://localhost:6347/api/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        console.log(response);
    };

    const onSubmit = async (data: UserFormData) => {
        try {
            const response = await axios.post("http://localhost:6347/api/users", {
                username: data.username,
                nama: data.name,
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
        axios.get('http://localhost:6347/api/users', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response.data);

                const dataWithNo = response.data.map((item: Omit<Data, 'no'>, index: number) => ({
                    ...item,
                    no: index + 1,
                }));
                setRows(dataWithNo);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, [reload]);

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
                <h2 className='text-4xl font-bold text-[#65558f] mb-2 mx-12'>Tambah Pengguna Baru</h2>
            </div>
            <div className='border-2 rounded-lg h-[90vh] shadow-2xl mx-12'>
                <div className='container mx-auto px-12 py-12'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Tombol Submit */}
                        <div className='flex flex-col h-full'>
                            <button type="submit" className="self-end bg-[#65558f] text-white px-4 py-3 rounded mt-4 font-bold text-xl rounded-lg">
                                Tambah User
                            </button>
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
                                {...register("name", { required: "Nama Lengkap is required" })}
                                className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                            />
                            {errors.name && <span className="text-red-500 text-sm">{String(errors.name.message)}</span>}
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
                        <div className='flex gap-x-4'>
                            <label htmlFor="email" className='w-[25%] text-xl font-bold'>Password</label>
                            <input
                                type="password"
                                id="password"
                                {...register("password", {
                                    required: "Password is required",
                                })}
                                className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                            />
                            {errors.password && <span className="text-red-500 text-sm">{String(errors.password.message)}</span>}
                        </div>
                    </form>
                    <Paper className='mt-10' sx={{ height: 200, width: '100%', boxShadow: 3 }}>
                        <TableVirtuoso
                            data={rows}
                            components={VirtuosoTableComponents}
                            fixedHeaderContent={fixedHeaderContent}
                            itemContent={rowContent}
                        />
                    </Paper>
                </div>
            </div>
        </>
    );
}

export default TambahUserPage;
