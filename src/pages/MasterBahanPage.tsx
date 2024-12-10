import { RootState } from "@reduxjs/toolkit/query";
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
import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import React, { useEffect, useState } from "react";

function MasterBahanPage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const formBahan = useForm();
    const { register: registerBahan, handleSubmit: handleSubmitBahan } = formBahan;
    const formSatuan = useForm();
    const { register: registerSatuan, handleSubmit: handleSubmitSatuan } = formSatuan;
    const [rowsBahan, setRowsBahan] = useState();
    const [rowsSatuan, setRowsSatuan] = useState();

    interface DataBahan {
        id: number;
        no: number;
        nama: string;
    }

    interface DataSatuan {
        id: number;
        no: number;
        nama: string;
        satuan_terkecil: string;
        konversi: number;
    }

    interface ColumnDataBahan {
        dataKey: keyof DataBahan | "aksi";
        label: string;
        numeric?: boolean;
        width?: number;
    }

    interface ColumnDataSatuan {
        dataKey: keyof DataSatuan | "aksi";
        label: string;
        numeric?: boolean;
        width?: number;
    }

    const columnsDataBahan: ColumnDataBahan[] = [
        { width: 50, label: 'No', dataKey: 'no', numeric: true },
        { width: 150, label: 'Nama', dataKey: 'nama' },
        { width: 100, label: 'Aksi', dataKey: 'aksi' },
    ];

    const columnsDataSatuan: ColumnDataSatuan[] = [
        { width: 50, label: 'No', dataKey: 'no', numeric: true },
        { width: 150, label: 'Nama', dataKey: 'nama' },
        { width: 150, label: 'Satuan Terkecil', dataKey: 'satuan_terkecil' },
        { width: 150, label: 'Konversi', dataKey: 'konversi' },
        { width: 100, label: 'Aksi', dataKey: 'aksi' },
    ];

    const VirtuosoTableComponents: TableComponents<DataBahan> = {
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

    const VirtuosoTableComponentsSatuan: TableComponents<DataSatuan> = {
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

    function fixedHeaderContentBahan() {
        return (
            <TableRow>
                {columnsDataBahan.map((column) => (
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

    function fixedHeaderContentSatuan() {
        return (
            <TableRow>
                {columnsDataSatuan.map((column) => (
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

    const handleUpdateBahan = (row: Data) => {
        console.log('Updating row with ID:', row.id);
    };

    const handleUpdateSatuan = (row: Data) => {
        console.log('Updating row with ID:', row.id);
    };
    const handleDeleteBahan = async (id: number) => {
        console.log('Deleting row with ID:', id);
    };
    const handleDeleteSatuan = async (id: number) => {
        console.log('Deleting row with ID:', id);
    };

    function rowContentBahan(_index: number, row: DataBahan) {
        return (
            <React.Fragment>
                {columnsDataBahan.map((column) => (
                    <TableCell
                        key={column.dataKey}
                        align={column.numeric || false ? 'right' : 'left'}
                    >
                        {column.dataKey === 'aksi' ? (
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10px' }}>
                                <button onClick={() => handleUpdateBahan(row)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}>Update</button>
                                <button onClick={() => handleDeleteBahan(row.id)}
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
                            row[column.dataKey as keyof DataBahan] !== undefined
                                ? row[column.dataKey as keyof DataBahan]
                                : '-'
                        )}
                    </TableCell>
                ))}
            </React.Fragment>
        );
    }

    function rowContentSatuan(_index: number, row: DataBahan) {
        return (
            <React.Fragment>
                {columnsDataSatuan.map((column) => (
                    <TableCell
                        key={column.dataKey}
                        align={column.numeric || false ? 'right' : 'left'}
                    >
                        {column.dataKey === 'aksi' ? (
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', gap: '10px' }}>
                                <button onClick={() => handleUpdateSatuan(row)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}>Update</button>
                                <button onClick={() => handleDeleteSatuan(row.id)}
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
                            row[column.dataKey as keyof DataSatuan] !== undefined
                                ? row[column.dataKey as keyof DataSatuan]
                                : '-'
                        )}
                    </TableCell>
                ))}
            </React.Fragment>
        );
    }

    useEffect(() => {
        axios.get('http://localhost:6347/api/bahan', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log(response.data);

                const dataWithNo = response.data.data.map((item: Omit<DataBahan, 'no'>, index: number) => ({
                    ...item,
                    no: index + 1,
                }));
                setRowsBahan(dataWithNo);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:6347/api/satuan', {
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
                setRowsSatuan(dataWithNo);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const onSubmitBahan = async (data: any) => {
        const response = await axios.post("http://localhost:6347/api/bahan", {
            nama: data.namaBahan,
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        console.log(response);
    }

    const onSubmitSatuan = async (data: any) => {
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
        console.log(response);
    }

    return (
        <>
            {/* Header */}
            <div className="mb-12 mt-6">
                <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">
                    Master Bahan
                </h2>
            </div>

            {/* Form Container */}
            <div className="flex justify-between">
                {/* Tambah Nama Bahan */}
                <div className="border-2 rounded-lg w-[40%] shadow-2xl mx-12 bg-white text-[#65558f]">
                    <div className="container mx-auto px-8 py-8">
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
                            </div>
                            <button
                                type="submit"
                                className="bg-[#65558f] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                            >
                                Tambah Bahan
                            </button>
                        </form>
                        <Paper className='mt-10' sx={{ height: 200, width: '100%', boxShadow: 3 }}>
                            <TableVirtuoso
                                data={rowsBahan}
                                components={VirtuosoTableComponents}
                                fixedHeaderContent={fixedHeaderContentBahan}
                                itemContent={rowContentBahan}
                            />
                        </Paper>
                    </div>
                </div>

                {/* Tambah Satuan Bahan */}
                <div className="border-2 rounded-lg w-[60%] shadow-2xl mx-12 bg-white">
                    <div className="container mx-auto px-8 py-8">
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
                            </div>
                            <button
                                type="submit"
                                className="bg-[#65558f] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                            >
                                Tambah Satuan
                            </button>
                        </form>
                        <Paper className='mt-10' sx={{ height: 200, width: '100%', boxShadow: 3 }}>
                            <TableVirtuoso
                                data={rowsSatuan}
                                components={VirtuosoTableComponentsSatuan}
                                fixedHeaderContent={fixedHeaderContentSatuan}
                                itemContent={rowContentSatuan}
                            />
                        </Paper>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MasterBahanPage;
