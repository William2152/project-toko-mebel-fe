import { Autocomplete, CircularProgress, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../../app/storeRedux'

function HistoryAllBahanMasuk() {
    const token = useSelector((state: RootState) => state.localStorage.value)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [totalPages, setTotalPages] = useState(0)
    const [filteredData, setFilteredData] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterKodeNota, setFilterKodeNota] = useState('')
    const [filterTglNota, setFilterTglNota] = useState<string | null>('')
    const [selectedSupplier, setSelectedSupplier] = useState('')
    const [supplierOptions, setSupplierOptions] = useState([])
    const [supplierNames, setSupplierNames] = useState({}); // State untuk menyimpan nama supplier berdasarkan ID

    // Handle page change
    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page
    };

    const handleDetail = (id: number) => {
        window.location.href = `/stock/history/pemasukkan/${id}`
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''; // Jika tidak ada nilai, kembalikan string kosong
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format menjadi YYYY-MM-DD
    };

    const formattedTglNota = formatDate(filterTglNota) || null;

    const fetchSupplierName = async (id: number) => {
        // Cek jika nama supplier sudah ada di cache
        if (supplierNames[id]) return supplierNames[id];
        try {
            const response = await axios.get(`http://localhost:6347/api/supplier/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const name = response.data.nama;
            setSupplierNames((prev) => ({ ...prev, [id]: name })); // Tambahkan nama ke cache
            return name;
        } catch (error: any) {
            console.error(`Error fetching supplier name for id ${id}:`, error);
            return 'Unknown Supplier'; // Default jika terjadi error
        }
    };

    useEffect(() => {
        const autoFetchSupplierNames = async () => {
            const supplierIds = data.map((row) => row.id_supplier); // Ambil semua ID supplier dari data
            const uniqueSupplierIds = [...new Set(supplierIds)]; // Hilangkan ID duplikat
            uniqueSupplierIds.forEach((id) => fetchSupplierName(id)); // Fetch nama supplier untuk setiap ID unik
        };

        if (data.length > 0) {
            autoFetchSupplierNames();
        }
    }, [data]);

    useEffect(() => {
        const fetchSupplierOptions = async () => {
            try {
                const response = await axios.get(`http://localhost:6347/api/master/supplier`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                // console.log(response);

                setSupplierOptions(response.data.data)
            } catch (error: any) {
                console.error('Error fetching supplier options:', error);
            }
        }

        fetchSupplierOptions()
    }, [])


    useEffect(() => {
        const fetchAllBahanMasuk = async () => {
            setLoading(true);
            console.log(formattedTglNota);
            console.log(selectedSupplier);
            const params = {
                page: page + 1,
                per_page: rowsPerPage,
                search: filterKodeNota || undefined, // Hanya kirim jika ada nilai
                tgl_nota: filterTglNota || undefined, // Hanya kirim jika ada nilai
                id_supplier: selectedSupplier.id || undefined, // Hanya kirim jika ada nilai
            };

            const headers = {
                Authorization: `Bearer ${token}`, // Contoh header untuk autentikasi
            };


            try {
                const response = await axios.get(`http://localhost:6347/api/history-bahan-masuk`, { params, headers })
                console.log(response);

                setData(response.data.data)
                setTotalPages(response.data.total_page)
            } catch (error: any) {
                console.error('Error fetching all bahan masuk:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAllBahanMasuk()
    }, [formattedTglNota, page, rowsPerPage, searchTerm, filterKodeNota, selectedSupplier])

    return (
        <>
            <div>
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
            </div>
            <div className="mb-12 mt-6">
                <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">
                    History Semua Bahan Masuk
                </h2>
            </div>
            <div className="border-2 rounded-lg shadow-2xl mx-12 bg-white">
                <div className="container mx-auto px-8 py-8">
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {/* Filter Section */}
                        <div className="flex items-center gap-4 p-4 bg-gray-100">
                            {/* Filter Kode Nota */}
                            <TextField
                                label="Cari Kode Nota"
                                variant="outlined"
                                value={filterKodeNota}
                                onChange={(e) => setFilterKodeNota(e.target.value)}
                            />

                            {/* Filter Supplier */}
                            <div className="flex-1">
                                <Autocomplete
                                    value={selectedSupplier} // Nilai yang dipilih
                                    onChange={(_, newValue) => setSelectedSupplier(newValue)} // Mengatur nilai terpilih
                                    options={supplierOptions} // Daftar opsi
                                    getOptionLabel={(option) => option.nama || ''} // Menentukan label untuk setiap opsi
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Pilih Supplier"
                                            variant="outlined"
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value.id} // Membandingkan opsi berdasarkan ID
                                />
                            </div>

                            {/* Filter Tanggal Nota */}
                            <TextField
                                label="Tanggal Nota"
                                type="date"
                                variant="outlined"
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={filterTglNota || ''}
                                onChange={(e) => setFilterTglNota(e.target.value || null)}
                            />
                        </div>

                        {/* Table Section */}
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No</TableCell>
                                        <TableCell>Tanggal Nota</TableCell>
                                        <TableCell>Kode Nota</TableCell>
                                        <TableCell>No SPB</TableCell>
                                        <TableCell>Supplier</TableCell>
                                        <TableCell>Detail</TableCell>
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
                                                <TableCell>{new Date(row.tgl_nota).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}</TableCell>
                                                <TableCell>{row.kode_nota}</TableCell>
                                                <TableCell>{row.no_spb}</TableCell>
                                                <TableCell>{supplierNames[row.id_supplier] || (
                                                    <CircularProgress size={16} /> // Loader jika nama belum tersedia
                                                )}</TableCell>
                                                <TableCell>
                                                    <button
                                                        onClick={() => handleDetail(row.id)}
                                                        style={{
                                                            padding: '5px 10px',
                                                            backgroundColor: '#4CAF50',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '5px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        Detail
                                                    </button>
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
    )
}

export default HistoryAllBahanMasuk
