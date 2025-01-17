import {
  IconButton,
  Snackbar,
  MenuItem,
  TextField,
  Autocomplete,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/storeRedux";

function InputPemakaianBahan() {
  const token = useSelector((state: RootState) => state.localStorage.value);
  const {
    control: controlHeader,
    handleSubmit: handleSubmitHeader,
    reset: resetHeader,
  } = useForm();
  const {
    control: controlBahan,
    handleSubmit: handleSubmitBahan,
    reset: resetBahan,
  } = useForm();
  const [error, setError] = useState("");
  const [proyekOptions, setProyekOptions] = useState([]);
  const [produkOptions, setProdukOptions] = useState([]);
  const [karyawanOptions, setKaryawanOptions] = useState([]);
  const [bahanOptions, setBahanOptions] = useState([]);
  const [satuanOptions, setSatuanOptions] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [idProyek, setIdProyek] = useState(0);
  const [idProyekProduk, setIdProyekProduk] = useState(0);

  const onSubmitHeader = async (data) => {
    try {
      await axios.post(
        "http://localhost:6347/api/history-bahan-keluar",
        {
          id_proyek_produk: data.produk.id,
          id_karyawan: data.karyawan.id,
          detail: detailData.map((item: any) => ({
            id_history_bahan_masuk_detail: item.bahan.id,
            qty: parseFloat(item.quantity),
            id_satuan: item.satuan.id,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      resetHeader({
        proyek: null,
        produk: null,
        karyawan: null,
      });
      resetBahan({
        bahan: null,
        satuan: null,
        quantity: "",
      });
      setDetailData([]);
      setError("Berhasil Menambahkan Pemakaian Bahan");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  };

  const onSubmitBahan = (data) => {
    console.log("Bahan Data: ", data); // Check the structure of the 'data' to ensure it's correct
    setDetailData((prevData) => [...prevData, data]); // Correctly append to the existing state
    resetBahan({
      bahan: null,
      satuan: null,
      quantity: "",
    });
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const proyekResponse = await axios.get(
          "http://localhost:6347/api/master/proyek",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const satuanResponse = await axios.get(
          "http://localhost:6347/api/master/satuan",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(proyekResponse.data.data);
        setProyekOptions(await proyekResponse.data.data);
        setSatuanOptions(await satuanResponse.data.data);
      } catch (err) {
        console.log(err);

        setError("Gagal mengambil data dari server.");
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchProduk = async () => {
      const produkResponse = await axios.get(
        `http://localhost:6347/api/master/proyek-produk?id_proyek=${idProyek}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(produkResponse.data.data);

      setProdukOptions(await produkResponse.data.data);
    };
    if (idProyek) fetchProduk();
  }, [idProyek]);

  useEffect(() => {
    const fetchKaryawan = async () => {
      const karyawanResponse = await axios.get(
        `http://localhost:6347/api/master/karyawan?id_proyek_produk=${idProyekProduk}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(karyawanResponse.data.data);
      setKaryawanOptions(await karyawanResponse.data.data);
    };
    if (idProyekProduk) fetchKaryawan();
  }, [idProyekProduk]);

  useEffect(() => {
    const fetchBahan = async () => {
      const bahanResponse = await axios.get(
        `http://localhost:6347/api/master/stok?id_proyek_produk=${idProyekProduk}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(bahanResponse.data.data);
      setBahanOptions(await bahanResponse.data.data);
    };
    if (idProyekProduk) fetchBahan();
  }, [idProyekProduk]);

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
            Input Pemakaian Bahan
          </h1>
          <p className="mt-2 text-lg text-white">
            Berikut adalah form untuk input pemakaian bahan
          </p>
        </div>

        {/* Form Header */}
        <div className="mb-10">
          <form onSubmit={handleSubmitHeader(onSubmitHeader)}>
            <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Searchable Combobox Proyek */}
                  <div>
                    <Controller
                      name="proyek"
                      control={controlHeader}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          value={field.value || null}
                          options={proyekOptions}
                          getOptionLabel={(option) => option.nama}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Pilih Proyek"
                              variant="outlined"
                            />
                          )}
                          onChange={(_, data) => {
                            field.onChange(data);
                            setIdProyek(data?.id || null);
                          }}
                        />
                      )}
                    />
                  </div>

                  {/* Searchable Combobox Produk */}
                  <div>
                    <Controller
                      name="produk"
                      control={controlHeader}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          value={field.value || null}
                          options={produkOptions}
                          getOptionLabel={(option) => option.nama}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Pilih Produk"
                              variant="outlined"
                            />
                          )}
                          onChange={(_, data) => {
                            field.onChange(data);
                            setIdProyekProduk(data?.id || null);
                          }}
                        />
                      )}
                    />
                  </div>

                  {/* Searchable Combobox Karyawan */}
                  <div>
                    <Controller
                      name="karyawan"
                      control={controlHeader}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          value={field.value || null}
                          options={karyawanOptions}
                          getOptionLabel={(option) => option.nama}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Pilih Karyawan"
                              variant="outlined"
                            />
                          )}
                          onChange={(_, data) => field.onChange(data)}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="bg-[#65558f] text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition duration-200"
                  >
                    Submit Pemakaian Bahan
                  </button>
                </div>
              </div>
            </Paper>
          </form>
        </div>

        {/* Form Tambah Bahan */}
        <div className="mb-10">
          <form onSubmit={handleSubmitBahan(onSubmitBahan)}>
            <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#65558f] mb-6">
                  Tambah Bahan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Searchable Combobox Bahan */}
                  <div>
                    <Controller
                      name="bahan"
                      control={controlBahan}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          value={field.value || null}
                          options={bahanOptions}
                          getOptionLabel={(option) => option.nama}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Pilih Bahan"
                              variant="outlined"
                            />
                          )}
                          onChange={(_, data) => field.onChange(data)}
                        />
                      )}
                    />
                  </div>

                  {/* Searchable Combobox Satuan */}
                  <div>
                    <Controller
                      name="satuan"
                      control={controlBahan}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          value={field.value || null}
                          options={satuanOptions}
                          getOptionLabel={(option) => option.nama}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Pilih Satuan"
                              variant="outlined"
                            />
                          )}
                          onChange={(_, data) => field.onChange(data)}
                        />
                      )}
                    />
                  </div>

                  {/* Input Quantity */}
                  <div>
                    <Controller
                      name="quantity"
                      control={controlBahan}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          inputProps={{ step: "0.1" }}
                          label="Quantity"
                          variant="outlined"
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="bg-[#65558f] text-white px-6 py-2 rounded-lg font-bold hover:bg-purple-700 transition duration-200"
                  >
                    Tambahkan Bahan
                  </button>
                </div>
              </div>
            </Paper>
          </form>
        </div>

        {/* Tabel Data */}
        <div className="mb-10">
          <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-[#65558f] mb-6">
                Daftar Bahan
              </h3>
              <Paper>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>No</TableCell>
                        <TableCell>Nama Bahan</TableCell>
                        <TableCell>Satuan</TableCell>
                        <TableCell>Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      ) : detailData.length > 0 ? (
                        detailData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{row.bahan?.nama || "N/A"}</TableCell>
                            <TableCell>{row.satuan?.nama || "N/A"}</TableCell>
                            <TableCell>{row.quantity}</TableCell>
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
              </Paper>
            </div>
          </Paper>
        </div>
      </div>
    </>
  );
}

export default InputPemakaianBahan;
