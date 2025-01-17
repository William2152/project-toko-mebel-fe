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
        axios.get("http://localhost:6347/api/supplier", {
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
        axios.get("http://localhost:6347/api/bahan", {
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
        axios.get("http://localhost:6347/api/satuan", {
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
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-[#65558f] tracking-tight">
                    Input Stock
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Berikut adalah halaman untuk menginputkan Stock.
                </p>
            </div>
            <div className="px-12 my-6">
                {/* Form Header */}
                <div className="mb-8">
                    <div className=" py-6">
                        <form onSubmit={handleSubmitAll(onSubmitStok)}>
                            <div className="bg-white shadow-xl border-2 rounded-xl p-8">
                                {/* <h2 className="text-3xl font-bold text-gray-800 mb-6">Form Input Stock</h2> */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                    {/* Tanggal Nota */}
                                    <div className="flex flex-col gap-y-2">
                                        <label htmlFor="tanggalNota" className="text-lg font-semibold text-gray-700">
                                            Tanggal Nota
                                        </label>
                                        <input
                                            type="date"
                                            id="tanggalNota"
                                            {...registerAll("tanggalNota", { required: "Tanggal Nota wajib diisi" })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Masukkan tanggal nota"
                                        />
                                        {errorsAll.tanggalNota && <p className="text-red-500">{String(errorsAll.tanggalNota.message)}</p>}
                                    </div>

                                    {/* Supplier */}
                                    <div className="flex flex-col gap-y-2">
                                        <label htmlFor="supplier" className="text-lg font-semibold text-gray-700">
                                            Supplier
                                        </label>
                                        <select id="supplier"{...registerAll("supplier", { required: "Supplier wajib diisi" })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                            <option hidden value="">Masukkan Supplier</option>
                                            {supplier.map((item: any) => (
                                                <option key={item.id} value={item.id}>{item.nama}</option>
                                            ))}
                                        </select>
                                        {errorsAll.supplier && <p className="text-red-500">{String(errorsAll.supplier.message)}</p>}
                                    </div>

                                    {/* No Surat Jalan */}
                                    <div className="flex flex-col gap-y-2">
                                        <label htmlFor="noNota" className="text-lg font-semibold text-gray-700">
                                            No Surat Jalan
                                        </label>
                                        <input
                                            type="text"
                                            id="noNota"
                                            {...registerAll("noNota", { required: "No Surat Jalan wajib diisi" })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Masukkan no surat jalan"
                                        />
                                        {errorsAll.noNota && <p className="text-red-500">{String(errorsAll.noNota.message)}</p>}
                                    </div>

                                    {/* No SPB */}
                                    <div className="flex flex-col gap-y-2">
                                        <label htmlFor="noSpb" className="text-lg font-semibold text-gray-700">
                                            No SPB
                                        </label>
                                        <input
                                            type="text"
                                            id="noSpb"
                                            {...registerAll("noSpb", { required: "No SPB wajib diisi" })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Masukkan no SPB"
                                        />
                                        {errorsAll.noSpb && <p className="text-red-500">{String(errorsAll.noSpb.message)}</p>}
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end mt-8">
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
                </div>

                {/* Form Tambah Barang */}
                <div className="bg-white border-2 rounded-lg shadow-xl py-8 px-6 mb-8">
                    <h3 className="text-2xl font-bold text-[#65558f] mb-6">Tambah Barang</h3>
                    <form onSubmit={handleSubmitBarang(handleAddItem)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Nama Bahan */}
                            <div className="flex flex-col">
                                <label htmlFor="namaBahan" className="text-lg font-medium text-gray-700">
                                    Nama Bahan
                                </label>
                                <select
                                    id="namaBahan"
                                    className="mt-2 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    {...registerBarang("namaBahan")}
                                >
                                    <option value="" hidden>Pilih Bahan</option>
                                    {namaBahan.map((bahan: any) => (
                                        <option key={bahan.id} value={bahan.id}>
                                            {bahan.nama}
                                        </option>
                                    ))}
                                </select>
                                {errorsBarang.namaBahan && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {String(errorsBarang.namaBahan.message)}
                                    </p>
                                )}
                            </div>

                            {/* Jumlah Barang */}
                            <div className="flex flex-col">
                                <label htmlFor="jumlahBahan" className="text-lg font-medium text-gray-700">
                                    Jumlah Bahan
                                </label>
                                <input
                                    type="number"
                                    id="jumlahBahan"
                                    className="mt-2 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    {...registerBarang("jumlahBahan")}
                                    min={0}
                                    step="0.01"
                                    placeholder="Masukkan jumlah bahan"
                                />
                                {errorsBarang.jumlahBahan && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {String(errorsBarang.jumlahBahan.message)}
                                    </p>
                                )}
                            </div>

                            {/* Satuan */}
                            <div className="flex flex-col">
                                <label htmlFor="satuan" className="text-lg font-medium text-gray-700">
                                    Satuan
                                </label>
                                <select
                                    id="satuan"
                                    className="mt-2 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    {...registerBarang("satuan")}
                                >
                                    <option value="" hidden>Pilih Satuan</option>
                                    {satuan.map((s: any) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nama}
                                        </option>
                                    ))}
                                </select>
                                {errorsBarang.satuan && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {String(errorsBarang.satuan.message)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Button Tambah Barang */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-[#65558f] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-200 font-semibold"
                            >
                                Tambah Barang
                            </button>
                        </div>
                    </form>
                </div>


                {/* Tabel Barang */}
                <div className="border-2 rounded-lg shadow-xl py-6 px-8">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <div className="w-20 text-center font-semibold text-lg">No</div>
                        <div className="flex-1 text-center font-semibold text-lg">Nama Bahan</div>
                        <div className="w-20 text-center font-semibold text-lg">Jumlah</div>
                        <div className="w-32 text-center font-semibold text-lg">Satuan</div>
                        <div className="w-10 text-center"></div>
                    </div>

                    {items.map((item: any, index) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center border-b py-2"
                        >
                            <div className="w-20 text-center text-md">{index + 1}</div>
                            <div className="flex-1 text-center text-md">{item.namaBarang}</div>
                            <div className="w-20 text-center text-md">{item.jumlah}</div>
                            <div className="w-32 text-center text-md">{item.satuan}</div>
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
