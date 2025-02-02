import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/storeRedux";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Snackbar,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";

// define modal style
const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

function GenerateLaporanHppPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = useSelector((state: RootState) => state.localStorage.value);
  const [loading, setLoading] = useState(false);
  // Untuk mengontrol state modal
  const [open, setOpen] = useState(false);
  // buat simpan url blob file PDF dari BE
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  // proyek
  const [proyekOptions, setProyekOptions] = useState([]);
  const [idProyek, setIdProyek] = useState(0);

  // produk
  const [produkOptions, setProdukOptions] = useState([]);
  const [isProdukEnabled, setIsProdukEnabled] = useState(false);

  // define schema validation
  const schemaAll = Joi.object({
    jenis_proyek: Joi.string().required().messages({
      "any.required": "Jenis proyek harus diisi.",
    }),
    sj_no: Joi.string().required().messages({
      "any.required": "Nomor SJ harus diisi.",
    }),
    acc: Joi.string().required().messages({
      "any.required": "Nama ACC harus diisi.",
    }),
    marketing: Joi.string().required().messages({
      "any.required": "Nama Marketing harus diisi.",
    }),
    nama_penanggung_jawab: Joi.string().required().messages({
      "any.required": "Nama Penanggung Jawab harus diisi.",
    }),
    total_harian: Joi.number().required().messages({
      "any.required": "Total harian harus diisi.",
    }),
    total_borongan: Joi.number().required().messages({
      "any.required": "Total borongan harus diisi.",
    }),
    proyek: Joi.object().required().messages({
      "any.required": "Proyek harus dipilih.",
    }),
    produk: Joi.object().required().messages({
      "any.required": "Produk harus dipilih.",
    }),
  });

  // use form
  const {
    control: controlHeader,
    handleSubmit: handleSubmitHeader,
    reset: resetHeader,
    setValue: setValueHeader,
    formState: { errors: errorsAll },
  } = useForm({ resolver: joiResolver(schemaAll) });

  const onSubmitReportFilter = async (data) => {
    setLoading(true);
    console.log(data);

    try {
      const response = await axios.post(
        `${API_URL}/api/laporan/hpp`,
        {
          jenis_proyek: data.jenis_proyek,
          sj_no: data.sj_no,
          acc: data.acc,
          marketing: data.marketing,
          nama_penanggung_jawab: data.nama_penanggung_jawab,
          total_harian: data.total_harian,
          total_borongan: data.total_borongan,
          id_proyek_produk: data.produk.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Penting agar file diterima sebagai blob
        }
      );

      // Buat URL blob untuk file yang diterima
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      // set url ke state
      setPdfUrl(url);

      // buka modal
      setOpen(true);
    } catch (error) {
      console.error("Gagal membuat laporan:", error);
      alert("Terjadi kesalahan saat membuat laporan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", "laporan_hpp.pdf"); // Nama file yang diunduh
      document.body.appendChild(link);
      link.click();
      link.remove();
      resetHeader({
        jenis_proyek: "",
        sj_no: "",
        acc: "",
        marketing: "",
        nama_penanggung_jawab: "",
        total_harian: "",
        total_borongan: "",
        proyek: null,
        produk: null,
      });
    }
  };

  // use effect
  // untuk ambil data combo pertama kali
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const proyekResponse = await axios.get(
          `${API_URL}/api/master/proyek`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(proyekResponse.data.data);
        setProyekOptions(await proyekResponse.data.data);
      } catch (err) {
        console.log(err);

        setError("Gagal mengambil data dari server.");
      }
    };

    fetchOptions();
  }, []);

  // filter data produk berdasarkan id proyek
  useEffect(() => {
    const fetchProduk = async () => {
      const produkResponse = await axios.get(
        `${API_URL}/api/master/proyek-produk?id_proyek=${idProyek}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(produkResponse.data.data);

      setProdukOptions(await produkResponse.data.data);
    };

    // cek apakah ada value proyek yang dipilih
    if (idProyek) {
      setValueHeader("produk", null); // Reset value produk
      // jika ada, maka enable input produk
      setIsProdukEnabled(true);
      fetchProduk();
    } else {
      // jika tidak ada, maka disable input produk
      setIsProdukEnabled(false);
    }
  }, [idProyek]);

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
          Laporan Harga Pokok Penjualan
        </h1>
        <p className="mt-2 text-lg text-white">
          Berikut adalah laporan harga pokok penjualan
        </p>
      </div>
      <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
        <div className="p-8">
          {/* Form section */}
          <form
            onSubmit={handleSubmitHeader(onSubmitReportFilter)}
            className="space-y-6 mb-5"
          >
            {/* Input jenis proyek */}
            <div className="flex-1">
              <Controller
                name="jenis_proyek"
                control={controlHeader}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    label="Jenis Proyek (baru/stock/revisi)"
                    variant="outlined"
                  />
                )}
              />
              {errorsAll.jenis_proyek && (
                <p className="text-red-500">
                  {String(errorsAll.jenis_proyek.message)}
                </p>
              )}
            </div>

            {/* Input nomor sj */}
            <div className="flex-1">
              <Controller
                name="sj_no"
                control={controlHeader}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    label="SJ No."
                    variant="outlined"
                  />
                )}
              />
              {errorsAll.sj_no && (
                <p className="text-red-500">
                  {String(errorsAll.sj_no.message)}
                </p>
              )}
            </div>

            {/* Input nama acc */}
            <div className="flex-1">
              <Controller
                name="acc"
                control={controlHeader}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    label="Nama Acc"
                    variant="outlined"
                  />
                )}
              />
              {errorsAll.acc && (
                <p className="text-red-500">
                  {String(errorsAll.acc.message)}
                </p>
              )}
            </div>

            {/* Input nama marketing */}
            <div className="flex-1">
              <Controller
                name="marketing"
                control={controlHeader}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    label="Nama Marketing"
                    variant="outlined"
                  />
                )}
              />
              {errorsAll.marketing && (
                <p className="text-red-500">
                  {String(errorsAll.marketing.message)}
                </p>
              )}
            </div>

            {/* Input nama penanggung jawab */}
            <div className="flex-1">
              <Controller
                name="nama_penanggung_jawab"
                control={controlHeader}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="text"
                    label="Nama Penanggung Jawab"
                    variant="outlined"
                  />
                )}
              />
              {errorsAll.nama_penanggung_jawab && (
                <p className="text-red-500">
                  {String(errorsAll.nama_penanggung_jawab.message)}
                </p>
              )}
            </div>

            {/* Input total harian */}
            <div className="flex-1">
              <Controller
                name="total_harian"
                control={controlHeader}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    inputProps={{ step: "1" }}
                    label="Total harian"
                    variant="outlined"
                  />
                )}
              />
              {errorsAll.total_harian && (
                <p className="text-red-500">
                  {String(errorsAll.total_harian.message)}
                </p>
              )}
            </div>

            {/* Input total borongan */}
            <div className="flex-1">
              <Controller
                name="total_borongan"
                control={controlHeader}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    inputProps={{ step: "1" }}
                    label="Total Borongan"
                    variant="outlined"
                  />
                )}
              />
              {errorsAll.total_borongan && (
                <p className="text-red-500">
                  {String(errorsAll.total_borongan.message)}
                </p>
              )}
            </div>

            {/* Input combobox proyek */}
            <div className="flex-1 mr-4">
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
                      field.onChange(data); // Tetapkan nilai ke form
                      setIdProyek(data?.id || null); // Set idProyek dengan id dari data yang dipilih
                    }}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    } // Pastikan opsi dipilih berdasarkan ID
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {" "}
                        {/* Gunakan ID untuk key */}
                        {option.nama}
                      </li>
                    )}
                  />
                )}
              />
              {errorsAll.proyek && (
                <p className="text-red-500">
                  {String(errorsAll.proyek.message)}
                </p>
              )}
            </div>

            {/* Input combobox produk */}
            <div className="flex-1 mr-4">
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
                        disabled={!isProdukEnabled} // Disable jika belum memilih Proyek
                      />
                    )}
                    onChange={(_, data) => {
                      field.onChange(data); // Tetapkan nilai ke form
                    }}
                    getOptionSelected={(option, value) =>
                      option.id === value.id
                    } // Pastikan opsi dipilih berdasarkan ID
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {" "}
                        {/* Gunakan ID untuk key */}
                        {option.nama}
                      </li>
                    )}
                  />
                )}
              />
              {errorsAll.produk && (
                <p className="text-red-500">
                  {String(errorsAll.produk.message)}
                </p>
              )}
            </div>
            <button
              className="bg-[#65558f] text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition duration-200"
              type="submit"
              disabled={loading}
            >
              {loading ? "Membuat laporan..." : "Generate Report"}
            </button>
          </form>

          {/* Modal untuk preview dokumen */}
          <Modal open={open} onClose={() => setOpen(false)}>
            <Box sx={modalStyle}>
              <h2>Preview Laporan</h2>
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="80%"
                  title="Preview PDF"
                  style={{ border: "none" }}
                ></iframe>
              )}
              <Button
                variant="contained"
                onClick={handleDownload}
                sx={{ mt: 2 }}
              >
                Download PDF
              </Button>
            </Box>
          </Modal>
        </div>
      </Paper>
    </>
  );
}

export default GenerateLaporanHppPage;
