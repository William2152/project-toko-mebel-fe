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
    const response = await axios.delete(`http://localhost:6347/api/karyawan/${deleteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response);
    setReload(!reload);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: KaryawanData) => {
    if (update) {
      try {
        await axios.put(
          `http://localhost:6347/api/karyawan/${updateId}`,
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
        reset()
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError("Error updating data: " + error.response?.data.message);
        }
      }
    } else {
      try {
        await axios.post(
          "http://localhost:6347/api/karyawan",
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
        `http://localhost:6347/api/karyawan?page=${page + 1}&per_page=${rowsPerPage}&search=${searchTerm}`,
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
        <h2 className='text-4xl font-bold text-[#65558f] mb-2 mx-12'>Tambah Karyawan</h2>
      </div>
      <div className='border-2 rounded-lg shadow-2xl mx-12'>
        <div className='container mx-auto px-12 py-12'>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Tombol Submit */}
            {update ?
              <div className='flex flex-col h-full'>
                <button type="submit" className="self-end bg-[#65558f] text-white px-4 py-3 rounded mt-4 font-bold text-xl rounded-lg">
                  Update Karyawan
                </button>
              </div>
              :
              <div className='flex flex-col h-full'>
                <button type="submit" className="self-end bg-[#65558f] text-white px-4 py-3 rounded mt-4 font-bold text-xl rounded-lg">
                  Tambah Karyawan
                </button>
              </div>}
            <br />
            {/* Role */}
            <div className='flex gap-x-4'>
              <label htmlFor="Role" className='w-[25%] text-xl font-bold'>Role</label>
              <select {...register("role")} className="border-2 border-gray-300 rounded px-2 py-2 w-full" id="">
                <option hidden value="">-- Pilih Role --</option>
                <option value="ketua">Ketua</option>
                <option value="member">Member</option>
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

export default TambahKaryawanPage;
