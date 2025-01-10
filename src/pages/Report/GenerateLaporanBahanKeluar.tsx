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
  Snackbar,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
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

function GenerateLaporanBahanKeluar() {
  const token = useSelector((state: RootState) => state.localStorage.value);
  const [loading, setLoading] = useState(false);
  // Untuk mengontrol state modal
  const [open, setOpen] = useState(false);
  // buat simpan url blob file PDF dari BE
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  // proyek
  const [customerOptions, setCustomerOptions] = useState([]);

  // define schema validation
  const schemaAll = Joi.object({
    start_date: Joi.date().required().label("Tanggal Awal").messages({
      "date.base": "Tanggal awal harus berupa tanggal.",
      "any.required": "Tanggal awal harus diisi.",
    }),
    end_date: Joi.date().required().label("Tanggal Akhir").messages({
      "date.base": "Tanggal akhir harus berupa tanggal.",
      "any.required": "Tanggal akhir harus diisi.",
    }),
    customer: Joi.object().required().label("Customer").messages({
      "object.base": "Customer harus dipilih.",
      "any.required": "Customer harus dipilih.",
    }),
  });

  // use form
  const {
    register,
    control: controlHeader,
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
        "http://localhost:6347/api/laporan/bahan-keluar",
        {
          start_date: formatDate(data.start_date),
          end_date: formatDate(data.end_date),
          id_customer: data.customer.id,
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
      link.setAttribute("download", "laporan_bahan_keluar.pdf"); // Nama file yang diunduh
      document.body.appendChild(link);
      link.click();
      link.remove();
      resetHeader({
        start_date: "",
        end_date: "",
        customer: null,
      });
    }
  };

  // use effect
  // untuk ambil data combo pertama kali
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const customerResponse = await axios.get(
          "http://localhost:6347/api/master/customer?per_page=1000",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(customerResponse.data.data);
        setCustomerOptions(await customerResponse.data.data);
      } catch (err) {
        console.log(err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError("Token tidak valid, silahkan login kembali");
          } else {
            setError(err.response?.data?.message || "Terjadi kesalahan");
          }
        }
      }
    };

    fetchOptions();
  }, []);

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
      <div className="mb-12 mt-6">
        <h2 className="text-4xl font-bold text-[#65558f] mb-2 px-12">
          Laporan Bahan Keluar
        </h2>
      </div>
      <div className="px-12 my-6">
        <div className="mb-8">
          <div className="py-6">
            <div className="border-2 rounded-lg shadow-2xl">
              <div className="px-12 py-12">
                {/* Form section */}
                <form
                  onSubmit={handleSubmitHeader(onSubmitReportFilter)}
                  className="space-y-6 mb-5"
                >
                  {/* Input start date  */}
                  <div className="flex-1 mr-4">
                    <label
                      htmlFor="startDate"
                      className="text-lg font-semibold text-gray-700"
                    >
                      Start Date Tanggal Input
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      {...register("start_date")}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                      placeholder="Masukkan range tanggal awal"
                    />
                    {errorsAll.start_date && (
                      <p className="text-red-500">
                        {String(errorsAll.start_date.message)}
                      </p>
                    )}
                  </div>

                  {/* Input end date  */}
                  <div className="flex-1 mr-4">
                    <label
                      htmlFor="endDate"
                      className="text-lg font-semibold text-gray-700"
                    >
                      End Date Tanggal Input
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      {...register("end_date")}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                      placeholder="Masukkan range tanggal awal"
                    />
                    {errorsAll.end_date && (
                      <p className="text-red-500">
                        {String(errorsAll.end_date.message)}
                      </p>
                    )}
                  </div>

                  {/* Input combobox supplier */}
                  <div className="flex-1 mr-4">
                    <Controller
                      name="customer"
                      control={controlHeader}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          value={field.value || null}
                          options={customerOptions}
                          getOptionLabel={(option) => option.nama}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Pilih Customer"
                              variant="outlined"
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
                    {errorsAll.customer && (
                      <p className="text-red-500">
                        {String(errorsAll.customer.message)}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GenerateLaporanBahanKeluar;
