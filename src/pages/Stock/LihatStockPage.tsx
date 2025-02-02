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
import { RootState } from "../../../app/storeRedux";
import CloseIcon from "@mui/icons-material/Close";

// Define the structure of your data
interface StockData {
    tgl_nota: string;
    nama_bahan: string;
    nama_satuan: string;
    qty: number;
    created_at: string;
}

function LihatStockPage() {
    // State for table data and pagination
    const API_URL = import.meta.env.VITE_API_URL;
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [data, setData] = useState<StockData[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // Fetch data from the backend
    const fetchData = async (page: number, rowsPerPage: number) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/api/history-bahan-masuk/stok?page=${page + 1}&per_page=${rowsPerPage}&search=${searchTerm}`
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
            <div className="text-center mb-8 bg-[#65558f] rounded-lg py-2">
                <h1 className="text-4xl font-bold text-white tracking-tight">
                    Stock Bahan
                </h1>
                <p className="mt-2 text-lg text-white">
                    Berikut adalah seluruh Stock yang tersedia.
                </p>
            </div>
            <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
                <div className="p-8">
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        {/* Search Bar */}
                        <div className="px-4 py-2 flex justify-between items-center">
                            <TextField
                                label="Cari Barang"
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
                                        <TableCell>Tanggal Masuk</TableCell>
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
                                    ) : data.length > 0 ? (
                                        data.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{new Date(row.tgl_nota).toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}</TableCell>
                                                <TableCell>{row.nama_bahan}</TableCell>
                                                <TableCell>{row.nama_satuan}</TableCell>
                                                <TableCell>{row.qty}</TableCell>
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
            </Paper>
        </>
    );
};

export default LihatStockPage;
