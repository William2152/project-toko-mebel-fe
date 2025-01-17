import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/storeRedux";
import { Box, Button, IconButton, Modal, Paper, Snackbar } from "@mui/material";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { format } from "date-fns";

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

function GenerateLaporanNotaByTanggal() {
  const token = useSelector((state: RootState) => state.localStorage.value);
  const [loading, setLoading] = useState(false);
  // Untuk mengontrol state modal
  const [open, setOpen] = useState(false);
  // buat simpan url blob file PDF dari BE
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  // define schema validation
  const schemaAll = Joi.object({
    tgl_input: Joi.date().required().label("Tanggal Input").messages({
      "date.base": "Tanggal input harus berupa tanggal.",
      "any.required": "Tanggal input harus diisi.",
    }),
    tgl_nota: Joi.date().required().label("Tanggal Nota").messages({
      "date.base": "Tanggal nota harus berupa tanggal.",
      "any.required": "Tanggal nota harus diisi.",
    }),
  });

  // use form
  const {
    register,
    handleSubmit: handleSubmitHeader,
    reset: resetHeader,
    formState: { errors: errorsAll },
  } = useForm({ resolver: joiResolver(schemaAll) });

  const formatDate = (date: string) => {
    const rawDate = new Date(date);

    // Konversi ke format YYYY-MM-DD
    const formattedDate = format(rawDate, "yyyy-MM-dd");

    return formattedDate;
  };

  const onSubmitReportFilter = async (data) => {
    setLoading(true);
    console.log(data);

    try {
      const response = await axios.post(
        "http://localhost:6347/api/laporan/nota",
        {
          //   tgl_input: formatDate(data.start_date),
          tgl_input: formatDate(data.tgl_input),
          tgl_nota: formatDate(data.tgl_nota),
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
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("Token tidak valid, silahkan login kembali");
        } else {
          setError(error.response?.data?.message || "Terjadi kesalahan");
        }
      }
      alert("Terjadi kesalahan saat membuat laporan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.setAttribute("download", "laporan_nota_per_supplier.pdf"); // Nama file yang diunduh
      document.body.appendChild(link);
      link.click();
      link.remove();
      resetHeader({
        start_date: "",
        end_date: "",
        supplier: null,
      });
    }
  };

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
          Laporan Nota per Tanggal
        </h1>
        <p className="mt-2 text-lg text-white">
          Generate Laporan Nota per Tanggal
        </p>
      </div>
      <Paper className="overflow-hidden shadow-lg rounded-xl bg-white">
        <div className="p-8">
          {/* Form section */}
          <form
            onSubmit={handleSubmitHeader(onSubmitReportFilter)}
            className="space-y-6 mb-5"
          >
            {/* Input tanggal input  */}
            <div className="flex-1 mr-4">
              <label
                htmlFor="tglInput"
                className="text-lg font-semibold text-gray-700"
              >
                Tanggal Input
              </label>
              <input
                type="date"
                id="tglInput"
                {...register("tgl_input")}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                placeholder="Masukkan range tanggal awal"
              />
              {errorsAll.tgl_input && (
                <p className="text-red-500">
                  {String(errorsAll.tgl_input.message)}
                </p>
              )}
            </div>

            {/* Input tanggal nota  */}
            <div className="flex-1 mr-4">
              <label
                htmlFor="tglNota"
                className="text-lg font-semibold text-gray-700"
              >
                Tanggal Nota
              </label>
              <input
                type="date"
                id="tglNota"
                {...register("tgl_nota")}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                placeholder="Masukkan range tanggal awal"
              />
              {errorsAll.tgl_nota && (
                <p className="text-red-500">
                  {String(errorsAll.tgl_nota.message)}
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

export default GenerateLaporanNotaByTanggal;
