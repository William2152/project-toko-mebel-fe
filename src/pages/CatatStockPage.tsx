import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FormHeaderStock from "../component/FormHeaderStock";
import FormInputBarang from "../component/FormInputBarang";

function CatatStockPage() {
    const formAll = useForm();
    const { register: registerAll, handleSubmit: handleSubmitAll } = formAll;

    const formBarang = useForm();
    const { register: registerBarang, handleSubmit: handleSubmitBarang, reset: resetBarang } = formBarang;

    const [items, setItems] = useState([
        { id: 1, jumlah: 10, namaBarang: "Thinner A (Spesial)", satuan: "Liter" },
        { id: 2, jumlah: 5, namaBarang: "Cat Kayu Putih", satuan: "Kg" },
        { id: 3, jumlah: 15, namaBarang: "Vernish Transparan", satuan: "Liter" },
    ]);

    const handleDeleteItem = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    };

    const handleAddItem = (data) => {
        const newId = items.length + 1;
        const newItem = {
            id: newId,
            jumlah: data.jumlahBarang,
            namaBarang: data.namaBarang,
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
                    <div className="border-2 rounded-lg shadow-xl py-6">
                        <form onSubmit={handleSubmitAll(saveItems)}>
                            <FormHeaderStock register={registerAll} />
                        </form>
                    </div>
                </div>

                {/* Form Tambah Barang */}
                <div className="border-2 rounded-lg shadow-xl py-6 mb-8">
                    <form onSubmit={handleSubmitBarang(handleAddItem)}>
                        <div className="flex items-center gap-x-4">
                            <FormInputBarang register={registerBarang} />
                        </div>
                    </form>
                </div>

                {/* Tabel Barang */}
                <div className="border-2 rounded-lg shadow-xl py-6">
                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                        <div className="w-20 text-center font-semibold text-lg">Jumlah</div>
                        <div className="flex-1 text-center font-semibold text-lg">Nama Barang</div>
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
