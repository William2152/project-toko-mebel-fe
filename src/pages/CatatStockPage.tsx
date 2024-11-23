import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Form } from 'react-router-dom';

function CatatStockPage() {
    const { handleSubmit, register, formState: { errors }, reset } = useForm();
    const [items, setItems] = useState([
        { id: 1, jumlah: 10, namaBarang: "Thinner A (Spesial)", satuan: "Liter" },
        { id: 2, jumlah: 5, namaBarang: "Cat Kayu Putih", satuan: "Kg" },
        { id: 3, jumlah: 15, namaBarang: "Vernish Transparan", satuan: "Liter" },
    ]);

    const handleDeleteItem = (id: number) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
    }

    const handleAddItem = (data: any) => {
        const newId = items.length + 1;
        const newItem = { id: newId, jumlah: data.jumlahBarang, namaBarang: data.namaBarang, satuan: data.satuan };
        setItems([...items, newItem]);
        reset()
    }
    return (
        <>
            <div className="flex justify-start gap-x-10 items-center p-4">
                {/* Tanggal Nota */}
                <div className="flex flex-col items-start bg-[#bcaaa4] p-4 rounded">
                    <label htmlFor="tanggalNota" className="text-sm font-semibold">Tanggal Nota</label>
                    <input
                        type="text"
                        id="tanggalNota"
                        className="mt-1 border border-gray-300 rounded px-2 py-1"
                        placeholder="Input"
                    />
                </div>

                {/* Supplier */}
                <div className="flex flex-col items-start bg-[#bcaaa4] p-4 rounded">
                    <label htmlFor="supplier" className="text-sm font-semibold">Supplier</label>
                    <input
                        type="text"
                        id="supplier"
                        className="mt-1 border border-gray-300 rounded px-2 py-1"
                        placeholder="Input"
                    />
                </div>

                {/* No Surat Jalan */}
                <div className="flex flex-col items-start bg-[#bcaaa4] p-4 rounded">
                    <label htmlFor="noSuratJalan" className="text-sm font-semibold">No Surat Jalan</label>
                    <input
                        type="text"
                        id="noSuratJalan"
                        className="mt-1 border border-gray-300 rounded px-2 py-1"
                        placeholder="Input"
                    />
                </div>

                {/* No SPB */}
                <div className="flex flex-col items-start bg-[#bcaaa4] p-4 rounded">
                    <label htmlFor="noSpb" className="text-sm font-semibold">No SPB</label>
                    <input
                        type="text"
                        id="noSpb"
                        className="mt-1 border border-gray-300 rounded px-2 py-1"
                        placeholder="Input"
                    />
                </div>

                {/* Save Button */}
                <button className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-700">
                    Save
                </button>
            </div>
            {/* Tambah barang */}
            <div className="flex justify-start gap-x-10 items-center p-4">
                {/* Form Tambah Barang */}
                <form className="flex gap-x-4 items-center" onSubmit={handleSubmit(handleAddItem)}>
                    {/* Nama Barang */}
                    <div className="flex flex-col items-start p-4 rounded">
                        <label htmlFor="">Nama Barang</label>
                        <select className='mt-1 border border-gray-300 rounded px-2 py-1 w-[200px]'
                            {...register("namaBarang", { required: true })} name='namaBarang'>
                            <option value="" hidden>Pilih Barang</option>
                            <option value="thinner">Thinner</option>
                        </select>
                    </div>
                    {/* Jumlah Barang */}
                    <div className="flex flex-col items-start p-4 rounded">
                        <label htmlFor="">Jumlah Barang</label>
                        <input type="number" className='mt-1 border border-gray-300 rounded px-2 py-1' {...register("jumlahBarang", { required: true })} min={0} name="jumlahBarang" />
                    </div>
                    {/* Satuan */}
                    <div className="flex flex-col items-start p-4 rounded">
                        <label htmlFor="">Satuan</label>
                        <select
                            className='mt-1 border border-gray-300 rounded px-2 py-1 w-[200px]'
                            {...register("satuan", { required: true })}
                            name="satuan">
                            <option value="" hidden>Pilih Satuan</option>
                            <option value="kg">KG</option>
                        </select>
                    </div>
                    {/* Tambah Barang Button */}
                    <button className="bg-purple-500 text-white mt-4 px-6 py-2 rounded-full hover:bg-purple-700">
                        Tambah Barang
                    </button>
                </form>
            </div>
            <div className="p-4">
                {/* Header Tabel */}
                <div className="flex justify-between items-center border-b pb-2">
                    <div className="w-20 text-center font-semibold">Jumlah</div>
                    <div className="flex-1 text-center font-semibold">Nama Barang</div>
                    <div className="w-32 text-center font-semibold">Satuan</div>
                    <div className="w-10 text-center"></div> {/* Kolom tombol */}
                </div>

                {/* Baris Data */}
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
    );
}

export default CatatStockPage;

