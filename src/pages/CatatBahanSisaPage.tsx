import React, { useState } from 'react'
import { useForm } from 'react-hook-form';


function CatatBahanSisaPage() {
    { /* FormHandle untuk keseluruhan */ }
    const formAll = useForm();
    const { register: registerAll, handleSubmit: handleSubmitAll, reset: resetAll } = formAll;

    { /* FormHandle untuk tambah barang */ }
    const formBarang = useForm();
    const { register: registerBarang, handleSubmit: handleSubmitBarang, reset: resetBarang } = formBarang;
    const [items, setItems] = useState([
        { id: 1, jumlah: 10, namaBarang: "Thinner A (Spesial)", satuan: "Liter" },
        { id: 2, jumlah: 5, namaBarang: "Cat Kayu Putih", satuan: "Kg" },
        { id: 3, jumlah: 15, namaBarang: "Vernish Transparan", satuan: "Liter" },
    ]);
    const handleDeleteItem = (id: number) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    }

    { /* handle menambahkan barang ke table */ }
    const handleAddItem = (data: any) => {
        const newId = items.length + 1;
        const newItem = { id: newId, jumlah: data.jumlahBarang, namaBarang: data.namaBarang, satuan: data.satuan };
        setItems([...items, newItem]);
        resetBarang()
    }

    { /* handle save keseluruhan ke database */ }
    const saveItems = (data: any) => {
        console.log(data);

    }
    return (
        <>
            <form onSubmit={handleSubmitAll(saveItems)}>
            </form>
            {/* Form Tambah Barang */}
            <form className="flex gap-x-4 items-center" onSubmit={handleSubmitBarang(handleAddItem)}>

            </form>
            <div className="p-4">
                {/* Header Tabel */}
                <div className="flex justify-between items-center border-b pb-2">
                    <div className="w-20 text-center font-semibold">Jumlah</div>
                    <div className="flex-1 text-center font-semibold">Nama Barang</div>
                    <div className="w-32 text-center font-semibold">Satuan</div>
                    <div className="w-10 text-center"></div> {/* Kolom tombol */}
                </div>

                {/* Data */}
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center border-b py-2"
                    >
                        {/* Jumlah */}
                        <div className="w-20 text-center">{item.jumlah}</div>
                        {/* Nama Barang */}
                        <div className="flex-1 text-center">{item.namaBarang}</div>
                        {/* Satuan */}
                        <div className="w-32 text-center">{item.satuan}</div>
                        {/* Tombol Hapus */}
                        <div className="w-10 text-center">
                            <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteItem(item.id)}
                            >
                                ❌
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default CatatBahanSisaPage
