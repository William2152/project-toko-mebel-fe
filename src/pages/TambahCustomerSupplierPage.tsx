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
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/storeRedux';
import { Snackbar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface Data {
    id: number
    no: number;
    nama: string;
    no_rekening?: number;
    nama_bank?: string;
    no_telepon: number;
    alamat: string;
}

interface DataFormSubmit {
    nama: string;
    noTelepon: number;
    alamat: string;
    noRekening?: number;
    namaBank?: string;
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
    { width: 100, label: 'No Rekening', dataKey: 'no_rekening' },
    { width: 100, label: 'Nama Bank', dataKey: 'nama_bank' },
    { width: 100, label: 'No Telepon', dataKey: 'no_telepon' },
    { width: 100, label: 'Alamat', dataKey: 'alamat' },
    { width: 100, label: 'Aksi', dataKey: 'aksi' },
];


const VirtuosoTableComponents: TableComponents<Data> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
        <Table
            {...props}
            sx={{
                borderCollapse: 'separate',
                tableLayout: 'fixed', // Tambahkan ini
                width: '100%', // Pastikan tabel memenuhi seluruh container
            }}
        />
    ),
    TableHead: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableHead {...props} ref={ref} />
    )),
    TableRow,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref} />
    )),
};


function TambahCustomerSupplierPage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [rows, setRows] = useState<Data[]>([]);
    const [reload, setReload] = useState(false);
    const [update, setUpdate] = useState(false);
    const [updateId, setUpdateId] = useState(0);
    const schema = Joi.object({
        nama: Joi.string().required().messages({
            'string.empty': 'Nama is required',
        }),
        noRekening: Joi.string().min(10).required().messages({
            'string.empty': 'No Rekening is required',
            'string.min': 'No Rekening must be at least 10 digits',
        }),
        namaBank: Joi.string().required().messages({
            'string.empty': 'Nama Bank is required',
        }),
        noTelepon: Joi.string().min(10).pattern(/^\d+$/, 'no numbers allowed').required().messages({
            'string.empty': 'No Telepon is required',
            'string.pattern.name': 'Hanya boleh berisi angka',
            'string.min': 'No Telepon must be at least 10 digits',
        }),
        alamat: Joi.string().required().messages({
            'string.empty': 'Alamat is required',
        }),
    });
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<DataFormSubmit>({
        resolver: joiResolver(schema),
    });
    const [role, setRole] = useState("");
    const [error, setError] = useState("");

    const visibleColumns = columns.filter((column) => {
        if (role === 'Customer') {
            return column.dataKey !== 'no_rekening' && column.dataKey !== 'nama_bank';
        }
        return true;
    });

    function rowContent(_index: number, row: Data) {
        return (
            <>
                {visibleColumns.map((column) => (
                    <TableCell
                        key={column.dataKey}
                        align={column.numeric ? 'right' : 'left'}
                        style={{
                            width: column.width,
                            padding: '8px',
                            border: '1px solid #ddd',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                        }} // Tambahkan width di sini
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
            </>
        );
    }




    function fixedHeaderContent() {
        return (
            <TableRow>
                {visibleColumns.map((column) => (
                    <TableCell
                        key={column.dataKey}
                        variant="head"
                        align={column.numeric ? 'right' : 'left'}
                        style={{ width: column.width }} // Tambahkan width di sini
                        sx={{
                            backgroundColor: 'background.paper',
                        }}
                    >
                        {column.label}
                    </TableCell>
                ))}
            </TableRow>
        );
    }


    const handleUpdate = (row: Data) => {
        if (role === 'Customer') {
            setValue('nama', row.nama);
            setValue('noTelepon', row.no_telepon);
            setValue('alamat', row.alamat);
            setUpdateId(row.id);
            setUpdate(true);
        } else if (role === 'Supplier') {
            setValue('nama', row.nama);
            setValue('noTelepon', row.no_telepon);
            setValue('alamat', row.alamat);
            setValue('noRekening', row.no_rekening);
            setValue('namaBank', row.nama_bank);
            setUpdateId(row.id);
            setUpdate(true);
        }
    };

    const handleDelete = (id: number) => {
        console.log('Deleting row with ID:', id);
        if (role === 'Customer') {
            axios.delete(`http://localhost:6347/api/customer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReload(!reload);
        } else if (role === 'Supplier') {
            axios.delete(`http://localhost:6347/api/supplier/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setReload(!reload);
        }
    };

    const onSubmit = async (data: DataFormSubmit) => {
        if (update) {
            const id = updateId;
            if (role === "Customer") {
                const response = await axios.put(`http://localhost:6347/api/customer/${id}`, {
                    nama: data.nama,
                    no_telepon: data.noTelepon,
                    alamat: data.alamat
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })
                console.log(response);
                setUpdate(false);
                reset();
                setReload(!reload);
            } else if (role === "Supplier") {
                const response = await axios.put(`http://localhost:6347/api/supplier/${id}`, {
                    nama: data.nama,
                    no_rekening: data.noRekening,
                    nama_bank: data.namaBank,
                    no_telepon: data.noTelepon,
                    alamat: data.alamat
                },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })
                console.log(response);
                setUpdate(false);
                reset();
                setReload(!reload);
            }
        } else {
            if (role === "Customer") {
                try {
                    const response = await axios.post("http://localhost:6347/api/customer", {
                        nama: data.nama,
                        no_telepon: data.noTelepon,
                        alamat: data.alamat
                    },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                    console.log(response);
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        // Menangani error dan menyimpannya dalam state
                        if (error.response) {
                            // Jika backend memberikan response error
                            setError(`Error: ${error.response.data.message || 'Something went wrong'}`);
                        } else if (error.request) {
                            // Jika request berhasil dikirim tetapi tidak ada response
                            setError('No response received from the server');
                        } else {
                            // Jika ada masalah dalam pembuatan request
                            setError(`Error: ${error.message}`);
                        }
                    }
                }

            } else if (role === "Supplier") {
                try {
                    const response = await axios.post("http://localhost:6347/api/supplier", {
                        nama: data.nama,
                        no_rekening: data.noRekening,
                        nama_bank: data.namaBank,
                        no_telepon: data.noTelepon,
                        alamat: data.alamat
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    console.log(response);
                    reset();
                    setError("");
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        // Menangani error dan menyimpannya dalam state
                        if (error.response) {
                            // Jika backend memberikan response error
                            setError(`Error: ${error.response.data.message || 'Something went wrong'}`);
                        } else if (error.request) {
                            // Jika request berhasil dikirim tetapi tidak ada response
                            setError('No response received from the server');
                        } else {
                            // Jika ada masalah dalam pembuatan request
                            setError(`Error: ${error.message}`);
                        }
                    }
                }
            }
        }
    };

    useEffect(() => {
        if (role === 'Supplier') {
            axios.get('http://localhost:6347/api/supplier', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    console.log(response.data);

                    const dataWithNo = response.data.data.map((item: Omit<Data, 'no'> & { id: string }, index: number) => ({
                        ...item,
                        no: index + 1,
                        id: item.id,
                    }));
                    setRows(dataWithNo);
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        } else if (role === 'Customer') {
            axios.get('http://localhost:6347/api/customer', {
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
                    setRows(dataWithNo);
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        }
    }, [role, token, reload]);


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
            {/* Header */}
            <div className="mb-12 mt-6">
                <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">
                    Tambah Customer / Supplier
                </h2>
            </div>

            {/* Form Container */}
            <div className="border-2 rounded-lg shadow-2xl mx-12">
                <div className="container mx-auto px-12 py-12">
                    {error && (
                        <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '5px' }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                        <div className="flex justify-end mt-4">
                            <button type="submit" className="bg-[#65558f] hover:bg-[#56437b] text-white px-6 py-3 rounded-lg font-bold text-xl">
                                {update == true ? "Update User" : "Tambah User"}
                            </button>
                        </div>

                        <div className="flex items-center gap-x-4">
                            <label htmlFor="role" className="w-[25%] text-xl font-bold">Role</label>
                            <select
                                id="role"
                                onChange={(e) => setRole(e.target.value)}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                            >
                                <option value="">-- Pilih Role --</option>
                                <option value="Customer">Customer</option>
                                <option value="Supplier">Supplier</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-x-4">
                            <label htmlFor="nama" className="w-[25%] text-xl font-bold">Nama</label>
                            <input
                                type="text"
                                id="nama"
                                {...register("nama")}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                            />
                            {errors.nama && <span className="text-red-500 text-sm">{String(errors.nama.message)}</span>}
                        </div>

                        {role === "Supplier" && (
                            <>
                                <div className="flex items-center gap-x-4">
                                    <label htmlFor="noRekening" className="w-[25%] text-xl font-bold">No Rekening</label>
                                    <input
                                        type="text"
                                        id="noRekening"
                                        {...register("noRekening")}
                                        className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                                    />
                                    {errors.noRekening && <span className="text-red-500 text-sm">{String(errors.noRekening.message)}</span>}
                                </div>

                                <div className="flex items-center gap-x-4">
                                    <label htmlFor="namaBank" className="w-[25%] text-xl font-bold">Nama Bank</label>
                                    <input
                                        type="text"
                                        id="namaBank"
                                        {...register("namaBank")}
                                        className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                                    />
                                    {errors.namaBank && <span className="text-red-500 text-sm">{String(errors.namaBank.message)}</span>}
                                </div>
                            </>
                        )}

                        <div className="flex items-center gap-x-4">
                            <label htmlFor="noTelepon" className="w-[25%] text-xl font-bold">No Telepon</label>
                            <input
                                type="text"
                                id="noTelepon"
                                {...register("noTelepon")}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                            />
                            {errors.noTelepon && <span className="text-red-500 text-sm">{String(errors.noTelepon.message)}</span>}
                        </div>

                        <div className="flex items-center gap-x-4">
                            <label htmlFor="alamat" className="w-[25%] text-xl font-bold">Alamat</label>
                            <textarea
                                id="alamat"
                                {...register("alamat")}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                                rows={4}
                            ></textarea>
                            {errors.alamat && <span className="text-red-500 text-sm">{String(errors.alamat.message)}</span>}
                        </div>
                    </form>
                    {rows.length == 0 ? "Belum ada data" : <>
                        <Paper className="mt-10" sx={{ height: 400, width: '100%', boxShadow: 3 }}>
                            <TableVirtuoso
                                data={rows}
                                components={VirtuosoTableComponents}
                                fixedHeaderContent={fixedHeaderContent}
                                itemContent={(index, row) => rowContent(index, row)} // Hilangkan TableRow di sini
                            />
                        </Paper>
                    </>}
                </div>
            </div>
        </>
    );
}

export default TambahCustomerSupplierPage;
