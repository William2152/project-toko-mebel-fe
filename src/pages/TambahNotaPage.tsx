import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/storeRedux";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function TambahNotaPage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [namaBahan, setNamaBahan] = useState([]);
    const [satuan, setSatuan] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [error, setError] = useState('');

    const schemaAll = Joi.object({
        kodeNota: Joi.string().required().messages({
            "string.empty": "Kode Nota harus diisi",
        }),
        supplier: Joi.string().required().messages({
            "string.empty": "Supplier harus diisi",
        }),
        tanggalNota: Joi.string().required().messages({
            "string.empty": "Tanggal Nota harus diisi",
        }),
        totalPajak: Joi.number().required().messages({
            "number.base": "Total Pajak harus diisi",
        }),
        totalDiscount: Joi.number().required().messages({
            "number.base": "Total Discount harus diisi",
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
        hargaSatuan: Joi.number().required().messages({
            'number.base': 'Harga Satuan Harus Diisi',
        }),
        diskonAkhir: Joi.number().required().messages({
            'number.base': 'Diskon Akhir Harus Diisi',
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
            hargaSatuan: data.hargaSatuan,
            diskonAkhir: data.diskonAkhir,
        };
        setItems([...items, newItem]);
        resetBarang();
    };

    const onSubmitNota = async (data) => {
        try {
            await axios.post("http://localhost:6347/api/nota", {
                kode_nota: data.kodeNota,
                tgl_nota: data.tanggalNota,
                id_supplier: data.supplier,
                total_pajak: data.totalPajak,
                diskon_akhir: data.totalDiscount,
                detail: items.map((item: any) => ({
                    id_bahan: parseInt(item.idBahan),
                    id_satuan: parseInt(item.idSatuan),
                    qty: parseFloat(item.jumlah),
                    harga_satuan: parseInt(item.hargaSatuan),
                    diskon: parseFloat(item.diskonAkhir)
                }))
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            resetAll();
            setItems([]);
            setError("Berhasil Menambahkan Nota");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
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
            <div className='mb-12 mt-6'>
                <h2 className='text-4xl font-bold text-[#65558f] mb-2 px-12'>Tambah Nota</h2>
            </div>
            <div className="px-12 my-6">
                {/* Form Header */}
                <div className="mb-8">
                    <div className=" py-6">
                        <form onSubmit={handleSubmitAll(onSubmitNota)}>
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
                                            {...registerAll("tanggalNota")}
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

                                    {/* Kode Nota */}
                                    <div className="flex flex-col gap-y-2">
                                        <label htmlFor="kodeNota" className="text-lg font-semibold text-gray-700">
                                            Kode Nota
                                        </label>
                                        <input
                                            type="text"
                                            id="kodeNota"
                                            {...registerAll("kodeNota")}
                                            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Masukkan kode Nota"
                                        />
                                        {errorsAll.kodeNota && <p className="text-red-500">{String(errorsAll.kodeNota.message)}</p>}
                                    </div>

                                    {/* Total Pajak */}
                                    <div className="flex flex-col gap-y-2">
                                        <label htmlFor="totalPajak" className="text-lg font-semibold text-gray-700">
                                            Total Pajak
                                        </label>
                                        <input
                                            type="number"
                                            id="totalPajak"
                                            {...registerAll("totalPajak", { required: "Total Pajak wajib diisi" })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Masukkan total pajak"
                                        />
                                        {errorsAll.totalPajak && <p className="text-red-500">{String(errorsAll.totalPajak.message)}</p>}
                                    </div>

                                    {/* Total Discount */}
                                    <div className="flex flex-col gap-y-2">
                                        <label htmlFor="totalDiscount" className="text-lg font-semibold text-gray-700">
                                            Total Discount
                                        </label>
                                        <input
                                            type="number"
                                            id="totalDiscount"
                                            {...registerAll("totalDiscount", { required: "Total Discount wajib diisi" })}
                                            className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Masukkan total discount"
                                        />
                                        {errorsAll.totalDiscount && <p className="text-red-500">{String(errorsAll.totalDiscount.message)}</p>}
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

                <div className="border-2 rounded-lg shadow-xl py-6 mb-8">
                    <form onSubmit={handleSubmitBarang(handleAddItem)}>
                        <div className="flex flex-wrap justify-between gap-4 px-8">
                            {/* Nama Bahan */}
                            <div className="flex flex-col items-start w-1/5">
                                <label htmlFor="namaBahan" className="text-gray-700 font-semibold">Nama Bahan</label>
                                <select
                                    id="namaBahan"
                                    {...registerBarang("namaBahan")}
                                    className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                                >
                                    <option value="" hidden>Pilih Bahan</option>
                                    {namaBahan.map((bahan) => (
                                        <option key={bahan.id} value={bahan.id}>{bahan.nama}</option>
                                    ))}
                                </select>
                                {errorsBarang.namaBahan && <p className="text-red-500 text-sm">{String(errorsBarang.namaBahan.message)}</p>}
                            </div>

                            {/* Jumlah Bahan */}
                            <div className="flex flex-col items-start w-1/6">
                                <label htmlFor="jumlahBahan" className="text-gray-700 font-semibold">Jumlah Bahan</label>
                                <input
                                    id="jumlahBahan"
                                    type="number"
                                    {...registerBarang("jumlahBahan")}
                                    className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                                    min={0}
                                    step="0.1"
                                />
                                {errorsBarang.jumlahBahan && <p className="text-red-500 text-sm">{String(errorsBarang.jumlahBahan.message)}</p>}
                            </div>

                            {/* Satuan */}
                            <div className="flex flex-col items-start w-1/6">
                                <label htmlFor="satuan" className="text-gray-700 font-semibold">Satuan</label>
                                <select
                                    id="satuan"
                                    {...registerBarang("satuan")}
                                    className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                                >
                                    <option value="" hidden>Pilih Satuan</option>
                                    {satuan.map((s) => (
                                        <option key={s.id} value={s.id}>{s.nama}</option>
                                    ))}
                                </select>
                                {errorsBarang.satuan && <p className="text-red-500 text-sm">{String(errorsBarang.satuan.message)}</p>}
                            </div>

                            {/* Harga Satuan */}
                            <div className="flex flex-col items-start w-1/4">
                                <label htmlFor="hargaSatuan" className="text-gray-700 font-semibold">Harga Satuan</label>
                                <input
                                    id="hargaSatuan"
                                    type="number"
                                    {...registerBarang("hargaSatuan")}
                                    className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                                    min={0}
                                />
                                {errorsBarang.hargaSatuan && <p className="text-red-500 text-sm">{String(errorsBarang.hargaSatuan.message)}</p>}
                            </div>

                            {/* Diskon Akhir */}
                            <div className="flex flex-col items-start w-1/6">
                                <label htmlFor="diskonAkhir" className="text-gray-700 font-semibold">Diskon Akhir</label>
                                <div className="flex items-center gap-x-2">
                                    <input
                                        id="diskonAkhir"
                                        type="number"
                                        {...registerBarang("diskonAkhir")}
                                        className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                                        min={0}
                                    />
                                    <span className="text-gray-700">%</span>
                                </div>
                                {errorsBarang.diskonAkhir && <p className="text-red-500 text-sm">{String(errorsBarang.diskonAkhir.message)}</p>}
                            </div>

                            {/* Tambah Barang Button */}
                            <div className="flex items-center justify-end w-full mt-4">
                                <button
                                    type="submit"
                                    className="bg-[#65558f] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition duration-200"
                                >
                                    Tambah Barang
                                </button>
                            </div>
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
                        <div className="w-32 text-center font-semibold text-lg">Harga Satuan</div>
                        <div className="w-32 text-center font-semibold text-lg">Diskon Akhir</div>
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
                            <div className="w-32 text-center text-md">{item.hargaSatuan?.toLocaleString("id-ID")}</div>
                            <div className="w-32 text-center text-md">{item.diskonAkhir} %</div>
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
    )
}

export default TambahNotaPage
