import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import Chance from 'chance';

interface Data {
    id: number;
    Nama: string;
    No_telepon: number;
    Alamat: string;
}

interface ColumnData {
    dataKey: keyof Data;
    label: string;
    numeric?: boolean;
    width?: number;
}

const chance = new Chance(42);

function createData(id: number): Data {
    return {
        id,
        Nama: "a",
        No_telepon: 0,
        Alamat: "a"
        // state: chance.state({ full: true }),
    };
}

const columns: ColumnData[] = [
    {
        width: 100,
        label: 'Nama',
        dataKey: 'Nama',
    },
    {
        width: 100,
        label: 'No_telepon',
        dataKey: 'No_telepon',
        numeric: true,
    },
    {
        width: 100,
        label: 'Alamat',
        dataKey: 'Alamat',
    },
];

const rows: Data[] = Array.from({ length: 200 }, (_, index) => createData(index));

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

function rowContent(_index: number, row: Data) {
    return (
        <React.Fragment>
            {columns.map((column) => (
                <TableCell
                    key={column.dataKey}
                    align={column.numeric || false ? 'right' : 'left'}
                >
                    {row[column.dataKey]}
                </TableCell>
            ))}
        </React.Fragment>
    );
}

function TambahCustomerSupplierPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [role, setRole] = useState("");

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <>
            {/* Header */}
            <div className="mb-12 mt-6">
                <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">
                    Tambah Customer / Supplier
                </h2>
            </div>

            {/* Form Container */}
            <div className="border-2 rounded-lg shadow-2xl mx-12">
                <div className="container mx-auto px-12 py-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
                        {/* Tombol Submit */}
                        <div className="flex justify-end mt-4">
                            <button
                                type="submit"
                                className="bg-[#65558f] hover:bg-[#56437b] text-white px-6 py-3 rounded-lg font-bold text-xl"
                            >
                                Tambah User
                            </button>
                        </div>
                        {/* Role */}
                        <div className="flex items-center gap-x-4">
                            <label htmlFor="role" className="w-[25%] text-xl font-bold">
                                Role
                            </label>
                            <select
                                id="role"
                                onChange={(e) => setRole(e.target.value)}
                                // {...register("role", { required: "Role is required" })}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                            >
                                <option value="">-- Pilih Role --</option>
                                <option value="Customer">Customer</option>
                                <option value="Supplier">Supplier</option>
                            </select>
                            {errors.role && (
                                <span className="text-red-500 text-sm">{errors.role.message}</span>
                            )}
                        </div>

                        {/* Nama */}
                        <div className="flex items-center gap-x-4">
                            <label htmlFor="nama" className="w-[25%] text-xl font-bold">
                                Nama
                            </label>
                            <input
                                type="text"
                                id="nama"
                                {...register("nama", { required: "Nama is required" })}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                            />
                            {errors.nama && (
                                <span className="text-red-500 text-sm">{errors.nama.message}</span>
                            )}
                        </div>

                        {role === "Supplier" && (
                            <>
                                {/* No Rekening */}
                                <div className="flex items-center gap-x-4">
                                    <label htmlFor="noRekening" className="w-[25%] text-xl font-bold">
                                        No Rekening
                                    </label>
                                    <input
                                        type="text"
                                        id="noRekening"
                                        {...register("noRekening", {
                                            required: "No Rekening is required",
                                            pattern: {
                                                value: /^[0-9]+$/,
                                                message: "No Rekening must be a number",
                                            },
                                        })}
                                        className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                                    />
                                    {errors.noRekening && (
                                        <span className="text-red-500 text-sm">{errors.noRekening.message}</span>
                                    )}
                                </div>

                                {/* Nama Bank */}
                                <div className="flex items-center gap-x-4">
                                    <label htmlFor="namaBank" className="w-[25%] text-xl font-bold">
                                        Nama Bank
                                    </label>
                                    <input
                                        type="text"
                                        id="namaBank"
                                        {...register("namaBank", { required: "Nama Bank is required" })}
                                        className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                                    />
                                    {errors.namaBank && (
                                        <span className="text-red-500 text-sm">{errors.namaBank.message}</span>
                                    )}
                                </div>
                            </>
                        )}
                        {/* No Telepon */}
                        <div className="flex items-center gap-x-4">
                            <label htmlFor="noTelepon" className="w-[25%] text-xl font-bold">
                                No Telepon
                            </label>
                            <input
                                type="text"
                                id="noTelepon"
                                {...register("noTelepon", {
                                    required: "No Telepon is required",
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "No Telepon must be a number",
                                    },
                                })}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                            />
                            {errors.noTelepon && (
                                <span className="text-red-500 text-sm">{errors.noTelepon.message}</span>
                            )}
                        </div>

                        {/* Alamat */}
                        <div className="flex items-center gap-x-4">
                            <label htmlFor="alamat" className="w-[25%] text-xl font-bold">
                                Alamat
                            </label>
                            <textarea
                                id="alamat"
                                {...register("alamat", { required: "Alamat is required" })}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                                rows="4"
                            ></textarea>
                            {errors.alamat && (
                                <span className="text-red-500 text-sm">{errors.alamat.message}</span>
                            )}
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

export default TambahCustomerSupplierPage;
