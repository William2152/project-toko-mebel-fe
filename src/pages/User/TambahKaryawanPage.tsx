import React, { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { RootState } from "../../../app/storeRedux";
import { useSelector } from "react-redux";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TablePagination, TextField } from "@mui/material";
import { KaryawanData } from "../../interface";

function TambahKaryawanPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = useSelector((state: RootState) => state.localStorage.value);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<KaryawanData[]>([]);
  const [deleteId, setDeleteId] = useState(0);
  const [updateId, setUpdateId] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const [update, setUpdate] = useState(false);
  const schema = Joi.object({
    nama: Joi.string().required(),
    role: Joi.string().required(),
  })
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<KaryawanData>({ resolver: joiResolver(schema) });
  // Handle page change
  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
  };

  const handleUpdate = (row: KaryawanData) => {
    console.log(row);
    setValue('nama', row.nama);
    setValue('role', row.role);
    setUpdate(true);
    setUpdateId(row.id);
  }

  const handleDelete = async (id: number) => {
    console.log('Deleting row with ID:', id);
    const response = await axios.delete(`${API_URL}/api/karyawan/${deleteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response);
    setReload(!reload);
    setError('Berhasil Menghapus Karyawan');
  }

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: KaryawanData) => {
    if (update) {
      try {
        await axios.put(
          `${API_URL}/api/karyawan/${updateId}`,
          {
            nama: data.nama,
            role: data.role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setReload(!reload);
        setUpdate(false);
        setError('Berhasil Mengubah Karyawan');
        reset()
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError("Error updating data: " + error.response?.data.message);
        }
      }
    } else {
      try {
        await axios.post(
          `${API_URL}/api/karyawan`,
          {
            nama: data.nama,
            role: data.role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setReload(!reload);
        setError('Berhasil Menambah Karyawan');
        reset()
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError("Error creating data: " + error.response?.data.message);
        }
      }
    }
  }

  const fetchKaryawan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/api/karyawan?page=${page + 1}&per_page=${rowsPerPage}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);
      setTotalPages(response.data.total_page);
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("Error fetching data: " + error.response?.data.message);
      }
    }
  }

  useEffect(() => {
    fetchKaryawan();
  }, [reload, searchTerm, page, rowsPerPage]);
  return (
    <>
      {/* Snackbar untuk pesan notifikasi */}
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

      {/* Dialog Konfirmasi Hapus */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Hapus Karyawan"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Apakah Anda yakin ingin menghapus karyawan ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { handleDelete(deleteId); handleClose() }}>Ya</Button>
          <Button onClick={handleClose} autoFocus>
            Tidak
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header Halaman */}
      <div className="text-center mb-8 bg-[#65558f] rounded-lg py-2">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Tambah Karyawan
        </h1>
        <p className="mt-2 text-lg text-white">
          Berikut adalah halaman untuk menambahkan karyawan untuk proyek.
        </p>
      </div>

      {/* Kontainer Form dan Tabel */}
      <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
        <div className="p-8">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#65558f] hover:bg-[#54437b] text-white px-6 py-3 rounded-lg font-bold text-xl"
              >
                {update ? "Update Karyawan" : "Tambah Karyawan"}
              </button>
            </div>

            {/* Input Role */}
            <div className="flex items-center gap-x-4">
              <label htmlFor="Role" className="w-[25%] text-xl font-bold">
                Role
              </label>
              <select
                {...register("role")}
                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
              >
                <option hidden value="">-- Pilih Role --</option>
                <option value="ketua">Ketua</option>
                <option value="member">Member</option>
              </select>
              {errors.role && <span className="text-red-500 text-sm">{String(errors.role?.message)}</span>}
            </div>

            {/* Input Nama Lengkap */}
            <div className="flex items-center gap-x-4">
              <label htmlFor="name" className="w-[25%] text-xl font-bold">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                {...register("nama", { required: "Nama Lengkap is required" })}
                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
              />
              {errors.nama && <span className="text-red-500 text-sm">{String(errors.nama.message)}</span>}
            </div>
          </form>

          {/* Tabel Data */}
          <Paper className="mt-10 shadow-lg">
            {/* Search Bar */}
            <div className="px-4 py-2">
              <TextField
                label="Cari Karyawan"
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
                    <TableCell>Role</TableCell>
                    <TableCell>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : data.length > 0 ? (
                    data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{row.nama}</TableCell>
                        <TableCell>{row.role}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleUpdate(row)}
                            className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg mr-2"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => { setDeleteId(row.id); setOpen(true); }}
                            className="bg-[#e53935] text-white px-4 py-2 rounded-lg"
                          >
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
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

}

export default TambahKaryawanPage;
