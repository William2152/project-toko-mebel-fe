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
    Snackbar,
    IconButton,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/storeRedux";
import CloseIcon from "@mui/icons-material/Close";

interface NotaData {
    tgl_nota: string;
    kode_nota: string;
    id_supplier: number;
    total_pajak: number;
    diskon_akhir: number;
    total_harga: number;
}

interface SupplierData {
    id: number;
    nama: string;
}

function LihatNotaPage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [data, setData] = useState<NotaData[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:6347/api/supplier",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuppliers(response.data.data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            setError(error.response.data.message);
        }
    };

    // Fetch data from the backend
    const fetchData = async (page: number, rowsPerPage: number) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:6347/api/nota?page=${page + 1}&per_page=${rowsPerPage}&search=${searchTerm}`
                , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            const result = await response.data;
            console.log(result);
            setData(result.data);
            setTotalPages(result.total_page);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDetail = (id: number) => {
        window.location.href = `/nota/detail/${id}`;
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

    // Load data on page load and when pagination changes
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchData(page, rowsPerPage);
        }, 400);

        return () => {
            clearTimeout(handler);
        };
    }, [page, rowsPerPage, searchTerm]);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const getSupplierName = (id: number) => {
        // console.log("suppliers:", suppliers);
        // console.log("searching for id:", id);
        const supplier = suppliers.find(s => s.id === id);
        // console.log("found supplier:", supplier);
        return supplier ? supplier.nama : `Supplier ${id}`;
    };

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
            <div className="w-full">
                {/* Header Section */}
                <div className="text-center mb-8 bg-[#65558f] rounded-lg py-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        List Nota
                    </h1>
                    <p className="mt-2 text-lg text-white">
                        Berikut adalah seluruh nota yang ada.
                    </p>
                </div>

                {/* Content Section */}
                <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
                    <div className="p-8">
                        <Paper sx={{ width: "100%", overflow: "hidden" }}>
                            {/* Search Bar */}
                            <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-md mb-6">
                                <TextField
                                    label="Cari Nota"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Table Section */}
                            <TableContainer sx={{ maxHeight: 400 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="font-bold text-lg">Tanggal Nota</TableCell>
                                            <TableCell className="font-bold text-lg">Kode Nota</TableCell>
                                            <TableCell className="font-bold text-lg">Supplier</TableCell>
                                            <TableCell className="font-bold text-lg">Total Pajak</TableCell>
                                            <TableCell className="font-bold text-lg">Total Diskon</TableCell>
                                            <TableCell className="font-bold text-lg">Total Harga</TableCell>
                                            <TableCell className="font-bold text-lg">Detail</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    <CircularProgress />
                                                </TableCell>
                                            </TableRow>
                                        ) : data.length > 0 ? (
                                            data.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {new Date(row.tgl_nota).toLocaleDateString("en-GB", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                        })}
                                                    </TableCell>
                                                    <TableCell>{row.kode_nota}</TableCell>
                                                    <TableCell>{getSupplierName(row.id_supplier)}</TableCell>
                                                    <TableCell>Rp. {row.total_pajak.toLocaleString()}</TableCell>
                                                    <TableCell>{row.diskon_akhir} %</TableCell>
                                                    <TableCell>Rp. {row.total_harga.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <button
                                                            onClick={() => handleDetail(row.id)}
                                                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                                                        >
                                                            Detail Nota
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    Tidak ada data yang sesuai
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Pagination Section */}
                            <div className="flex justify-between items-center mt-4 px-4 py-2">
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
            </div>
        </>
    );

}

export default LihatNotaPage
