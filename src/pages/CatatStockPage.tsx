import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormHeaderStock from "../component/FormHeaderStock";
import FormInputBarang from "../component/FormInputBarang";
import axios from "axios";
import { RootState } from "@reduxjs/toolkit/query";
import { useSelector } from "react-redux";

function CatatStockPage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const [namaBahan, setNamaBahan] = useState([]);
    const [satuan, setSatuan] = useState([]);

    const formAll = useForm();
    const { register: registerAll, handleSubmit: handleSubmitAll } = formAll;

    const formBarang = useForm();
    const { register: registerBarang, handleSubmit: handleSubmitBarang, reset: resetBarang } = formBarang;

    const [items, setItems] = useState([
        { id: 1, jumlah: 10, namaBarang: "Thinner A (Spesial)", satuan: "Liter" },
        { id: 2, jumlah: 5, namaBarang: "Cat Kayu Putih", satuan: "Kg" },
        { id: 3, jumlah: 15, namaBarang: "Vernish Transparan", satuan: "Liter" },
    ]);

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

    const handleDeleteItem = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    };

    const handleAddItem = (data) => {
        console.log(data);

        const newId = items.length + 1;
        const newItem = {
            id: newId,
            jumlah: data.jumlahBahan,
            namaBarang: data.namaBahan,
            satuan: data.satuan,
        };
        setItems([...items, newItem]);
        resetBarang();
    };

    const saveItems = (data) => {
        console.log(data);
    };

    return (
        <>
            <div className='mb-12 mt-6'>
                <h2 className='text-4xl font-bold text-[#65558f] mb-2 px-12'>Catat Stock Bahan</h2>
            </div>
            <div className="px-12 my-6">
                {/* Form Header */}
                <div className="mb-8">
                    <div className=" py-6">
                        <form onSubmit={handleSubmitAll(saveItems)}>
                            <FormHeaderStock register={registerAll} />
                        </form>
                    </div>
                </div>

                {/* Form Tambah Barang */}
                <div className="border-2 rounded-lg shadow-xl py-6 mb-8">
                    <form onSubmit={handleSubmitBarang(handleAddItem)}>
                        <div className="flex items-center gap-x-4">
                            <FormInputBarang register={registerBarang} namaBahan={namaBahan} satuan={satuan} />
                        </div>
                    </form>
                </div>

                {/* Tabel Barang */}
                <div className="border-2 rounded-lg shadow-xl py-6">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <div className="w-20 text-center font-semibold text-lg">Jumlah</div>
                        <div className="flex-1 text-center font-semibold text-lg">Nama Bahan</div>
                        <div className="w-32 text-center font-semibold text-lg">Satuan</div>
                        <div className="w-10 text-center"></div>
                    </div>

                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center border-b py-2"
                        >
                            <div className="w-20 text-center text-md">{item.jumlah}</div>
                            <div className="flex-1 text-center text-md">{item.namaBarang}</div>
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
