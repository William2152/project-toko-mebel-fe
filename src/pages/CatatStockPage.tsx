import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/storeRedux";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function CatatStockPage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [namaBahan, setNamaBahan] = useState([]);
    const [satuan, setSatuan] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [error, setError] = useState('');

    const schemaAll = Joi.object({
        noNota: Joi.string().required().messages({
            "string.empty": "No Nota harus diisi",
        }),
        supplier: Joi.string().required().messages({
            "string.empty": "Supplier harus diisi",
        }),
        tanggalNota: Joi.string().required().messages({
            "string.empty": "Tanggal Nota harus diisi",
        }),
        noSpb: Joi.string().required().messages({
            "string.empty": "No SPB harus diisi",
        }),
    })
    const formAll = useForm({ resolver: joiResolver(schemaAll) });
    const { register: registerAll, handleSubmit: handleSubmitAll, formState: { errors: errorsAll }, reset: resetAll } = formAll;

    const schemaBarang = Joi.object({
        namaBahan: Joi.string().required().messages({
            "string.empty": "Nama Bahan Harus Diisi",
        }),
        satuan: Joi.string().required().messages({
            "string.empty": "Satuan Harus Diisi",
        }),
        jumlahBahan: Joi.number().greater(0).messages({
            'number.greater': 'Jumlah Bahan harus lebih besar dari 0',
            'number.base': 'Jumlah Bahan Harus Diisi',
        }),
    })
    const formBarang = useForm({ resolver: joiResolver(schemaBarang) });
    const { register: registerBarang, handleSubmit: handleSubmitBarang, reset: resetBarang, formState: { errors: errorsBarang } } = formBarang;

    const [items, setItems] = useState([
    ]);

    useEffect(() => {
        axios.get("http://localhost:6347/api/supplier?per_page=1000", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                console.log(response.data.data);
                setSupplier(response.data.data);
            })
            .catch(e => {
                console.log('Error fetching nama bahan:', e);
                setError(e.response.data.message);
            })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:6347/api/master/bahan?per_page=1000", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                console.log(response.data.data);
                setNamaBahan(response.data.data);
            })
            .catch(e => {
                console.log('Error fetching nama bahan:', e);
                setError(e.response.data.message);
            })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:6347/api/satuan?per_page=1000", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(response => {
                console.log(response.data.data);
                setSatuan(response.data.data);
            })
            .catch(e => {
                console.log('Error fetching nama satuan:', e);
                setError(e.response.data.message);
            })
    }, [])

    const handleDeleteItem = (id: number) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    };

    const handleAddItem = async (data) => {
        console.log(data);
        const responseBahan = await axios.get(`http://localhost:6347/api/bahan/${data.namaBahan}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        const bahan = responseBahan.data.nama;

        const responseSatuan = await axios.get(`http://localhost:6347/api/satuan/${data.satuan}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        const satuan = responseSatuan.data.nama;

        const newId = items.length + 1;
        const newItem = {
            id: newId,
            idBahan: data.namaBahan,
            idSatuan: data.satuan,
            jumlah: data.jumlahBahan,
            namaBarang: bahan,
            satuan: satuan,
        };
        setItems([...items, newItem]);
        resetBarang();
    };

    const onSubmitStok = async (data) => {
        if (items.length === 0) {
            setError('Data barang tidak boleh kosong');
        } else {
            try {
                await axios.post("http://localhost:6347/api/history-bahan-masuk", {
                    kode_nota: data.noNota,
                    tgl_nota: data.tanggalNota,
                    id_supplier: data.supplier,
                    no_spb: data.noSpb,
                    detail: items.map((item: any) => ({
                        id_bahan: parseInt(item.idBahan),
                        id_satuan: parseInt(item.idSatuan),
                        qty: parseFloat(item.jumlah)
                    }))
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                setItems([]);
                resetAll();
                setError('Data berhasil disimpan');
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data.message);
                }
            }
            // console.log(response);
            // console.log({
            //     kode_nota: data.noNota,
            //     tgl_nota: data.tanggalNota,
            //     id_supplier: data.supplier,
            //     no_spb: data.noSpb,
            //     detail: items.map((item: any) => ({
            //         id_bahan: item.idBahan,
            //         id_satuan: item.idSatuan,
            //         qty: item.jumlah
            //     }))
            // });
        }
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
                <div className="text-center mb-10 bg-[#65558f] rounded-lg py-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Input Stock
                    </h1>
                    <p className="mt-2 text-lg text-white">
                        Berikut adalah halaman untuk menginputkan Stock.
                    </p>
                </div>

                {/* Form Header */}
                <div className="mb-10">
                    <form onSubmit={handleSubmitAll(onSubmitStok)}>
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="tanggalNota" className="block text-lg font-semibold text-gray-700">
                                        Tanggal Nota
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggalNota"
                                        {...registerAll("tanggalNota")}
                                        className="mt-1 border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Masukkan tanggal nota"
                                    />
                                    {errorsAll.tanggalNota && <p className="text-red-500 text-sm">{String(errorsAll.tanggalNota.message)}</p>}
                                </div>

                                <div>
                                    <label htmlFor="supplier" className="block text-lg font-semibold text-gray-700">
                                        Supplier
                                    </label>
                                    <select
                                        id="supplier"
                                        {...registerAll("supplier")}
                                        className="mt-1 border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-purple-500 focus:border-purple-500"
                                    >
                                        <option hidden value="">Masukkan Supplier</option>
                                        {supplier.map((item: any) => (
                                            <option key={item.id} value={item.id}>{item.nama}</option>
                                        ))}
                                    </select>
                                    {errorsAll.supplier && <p className="text-red-500 text-sm">{String(errorsAll.supplier.message)}</p>}
                                </div>

                                <div>
                                    <label htmlFor="noNota" className="block text-lg font-semibold text-gray-700">
                                        No Surat Jalan
                                    </label>
                                    <input
                                        type="text"
                                        id="noNota"
                                        {...registerAll("noNota")}
                                        className="mt-1 border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Masukkan no surat jalan"
                                    />
                                    {errorsAll.noNota && <p className="text-red-500 text-sm">{String(errorsAll.noNota.message)}</p>}
                                </div>

                                <div>
                                    <label htmlFor="noSpb" className="block text-lg font-semibold text-gray-700">
                                        No SPB
                                    </label>
                                    <input
                                        type="text"
                                        id="noSpb"
                                        {...registerAll("noSpb")}
                                        className="mt-1 border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Masukkan no SPB"
                                    />
                                    {errorsAll.noSpb && <p className="text-red-500 text-sm">{String(errorsAll.noSpb.message)}</p>}
                                </div>
                            </div>
                            <div className="flex justify-end mt-6">
                                <button
                                    type="submit"
                                    className="bg-[#65558f] text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition duration-200"
                                >
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Form Tambah Barang */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-10">
                    <h3 className="text-2xl font-bold text-[#65558f] mb-6">Tambah Barang</h3>
                    <form onSubmit={handleSubmitBarang(handleAddItem)}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="namaBahan" className="block text-lg font-medium text-gray-700">
                                    Nama Bahan
                                </label>
                                <select
                                    id="namaBahan"
                                    className="mt-1 border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-purple-500 focus:border-purple-500"
                                    {...registerBarang("namaBahan")}
                                >
                                    <option value="" hidden>Pilih Bahan</option>
                                    {namaBahan.map((bahan: any) => (
                                        <option key={bahan.id} value={bahan.id}>
                                            {bahan.nama}
                                        </option>
                                    ))}
                                </select>
                                {errorsBarang.namaBahan && <p className="text-red-500 text-sm mt-1">{String(errorsBarang.namaBahan.message)}</p>}
                            </div>

                            <div>
                                <label htmlFor="jumlahBahan" className="block text-lg font-medium text-gray-700">
                                    Jumlah Bahan
                                </label>
                                <input
                                    type="number"
                                    id="jumlahBahan"
                                    className="mt-1 border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-purple-500 focus:border-purple-500"
                                    {...registerBarang("jumlahBahan")}
                                    placeholder="Masukkan jumlah bahan"
                                />
                                {errorsBarang.jumlahBahan && <p className="text-red-500 text-sm mt-1">{String(errorsBarang.jumlahBahan.message)}</p>}
                            </div>

                            <div>
                                <label htmlFor="satuan" className="block text-lg font-medium text-gray-700">
                                    Satuan
                                </label>
                                <select
                                    id="satuan"
                                    className="mt-1 border border-gray-300 rounded-lg w-full px-4 py-2 focus:ring-purple-500 focus:border-purple-500"
                                    {...registerBarang("satuan")}
                                >
                                    <option value="" hidden>Pilih Satuan</option>
                                    {satuan.map((s: any) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nama}
                                        </option>
                                    ))}
                                </select>
                                {errorsBarang.satuan && <p className="text-red-500 text-sm mt-1">{String(errorsBarang.satuan.message)}</p>}
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="bg-[#65558f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-200"
                            >
                                Tambah Barang
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabel Barang */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="border-b pb-4 mb-4">
                        <div className="flex justify-between text-lg font-semibold">
                            <div className="w-12 text-center">No</div>
                            <div className="flex-1 text-center">Nama Bahan</div>
                            <div className="w-20 text-center">Jumlah</div>
                            <div className="w-28 text-center">Satuan</div>
                            <div className="w-10 text-center"></div>
                        </div>
                    </div>

                    {items.map((item: any, index) => (
                        <div key={item.id} className="flex justify-between items-center border-b py-2">
                            <div className="w-12 text-center text-sm">{index + 1}</div>
                            <div className="flex-1 text-center text-sm">{item.namaBarang}</div>
                            <div className="w-20 text-center text-sm">{item.jumlah}</div>
                            <div className="w-28 text-center text-sm">{item.satuan}</div>
                            <div className="w-10 text-center">
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteItem(item.id)}
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );

}

export default CatatStockPage;
