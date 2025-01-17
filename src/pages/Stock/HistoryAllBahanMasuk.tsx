import {
  Autocomplete,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/storeRedux";

function HistoryAllBahanMasuk() {
  const token = useSelector((state: RootState) => state.localStorage.value);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKodeNota, setFilterKodeNota] = useState("");
  const [filterTglNota, setFilterTglNota] = useState<string | null>("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [supplierNames, setSupplierNames] = useState({}); // State untuk menyimpan nama supplier berdasarkan ID

  // Handle page change
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const handleDetail = (id: number) => {
    window.location.href = `/stock/history/pemasukkan/${id}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Jika tidak ada nilai, kembalikan string kosong
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format menjadi YYYY-MM-DD
  };

  const formattedTglNota = formatDate(filterTglNota) || null;

  const fetchSupplierName = async (id: number) => {
    // Cek jika nama supplier sudah ada di cache
    if (supplierNames[id]) return supplierNames[id];
    try {
      const response = await axios.get(
        `http://localhost:6347/api/supplier/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const name = response.data.nama;
      setSupplierNames((prev) => ({ ...prev, [id]: name })); // Tambahkan nama ke cache
      return name;
    } catch (error: any) {
      console.error(`Error fetching supplier name for id ${id}:`, error);
      return "Unknown Supplier"; // Default jika terjadi error
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
        const response = await axios.get(
          `http://localhost:6347/api/master/supplier?per_page=1000`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(response);

        setSupplierOptions(response.data.data);
      } catch (error: any) {
        console.error("Error fetching supplier options:", error);
        setError(error.response.data.message);
      }
    };

    fetchSupplierOptions();
  }, []);

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
        const response = await axios.get(
          `http://localhost:6347/api/history-bahan-masuk`,
          { params, headers }
        );
        console.log(response);

        setData(response.data.data);
        setTotalPages(response.data.total_page);
      } catch (error: any) {
        console.error("Error fetching all bahan masuk:", error);
        setError(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBahanMasuk();
  }, [
    formattedTglNota,
    page,
    rowsPerPage,
    searchTerm,
    filterKodeNota,
    selectedSupplier,
  ]);

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
            History Bahan Masuk
          </h1>
          <p className="mt-2 text-lg text-white">
            Berikut adalah seluruh history bahan masuk.
          </p>
        </div>

        {/* Filter and Table Section */}
        <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
          <div className="p-8">
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              {/* Filter Section */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-100 rounded-md mb-6">
                {/* Filter Kode Nota */}
                <TextField
                  label="Cari Kode Nota"
                  variant="outlined"
                  size="small"
                  value={filterKodeNota}
                  onChange={(e) => setFilterKodeNota(e.target.value)}
                  fullWidth
                />
                {/* Filter Supplier */}
                <Autocomplete
                  value={selectedSupplier}
                  onChange={(_, newValue) => setSelectedSupplier(newValue)}
                  options={supplierOptions}
                  getOptionLabel={(option) => option.nama || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pilih Supplier"
                      variant="outlined"
                      size="small"
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                  className="flex-1"
                />
                {/* Filter Tanggal Nota */}
                <TextField
                  label="Tanggal Nota"
                  type="date"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={filterTglNota || ""}
                  onChange={(e) => setFilterTglNota(e.target.value || null)}
                />
              </div>

              {/* Table Section */}
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold text-lg">No</TableCell>
                      <TableCell className="font-bold text-lg">
                        Tanggal Nota
                      </TableCell>
                      <TableCell className="font-bold text-lg">
                        Kode Nota
                      </TableCell>
                      <TableCell className="font-bold text-lg">
                        No SPB
                      </TableCell>
                      <TableCell className="font-bold text-lg">
                        Supplier
                      </TableCell>
                      <TableCell className="font-bold text-lg">
                        Detail
                      </TableCell>
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
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            {new Date(row.tgl_nota).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell>{row.kode_nota}</TableCell>
                          <TableCell>{row.no_spb}</TableCell>
                          <TableCell>
                            {supplierNames[row.id_supplier] || (
                              <CircularProgress size={16} />
                            )}
                          </TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleDetail(row.id)}
                              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                            >
                              Detail
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

export default HistoryAllBahanMasuk;
