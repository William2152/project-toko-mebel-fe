import React from 'react'
import { useForm } from 'react-hook-form';

function TambahProjectPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <div className='container mx-auto px-5'>
            {/* Halaman Deskripsi */}
            <div className='mb-6'>
                <h2 className='text-2xl font-bold text-[#65558f] mb-2'>Tambah Project Baru</h2>
            </div>

            {/* Formulir untuk Menambah Project */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Nama Project */}
                <div className='flex gap-x-4'>
                    <label htmlFor="namaProject" className='w-[30%]'>Nama Project</label>
                    <input
                        type="text"
                        id="namaProject"
                        {...register("namaProject", { required: "Nama Project is required" })}
                        className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    {errors.namaProject && <span className="text-red-500 text-sm">{errors.namaProject.message}</span>}
                </div>
                <br />

                {/* Customer */}
                <div className='flex gap-x-4'>
                    <label htmlFor="customer" className='w-[30%]'>Customer</label>
                    <select
                        id="customer"
                        {...register("customer", { required: "Customer is required" })}
                        className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                    >
                        <option value="">Pilih Customer</option>
                        {/* Tambahkan opsi customer di sini */}
                    </select>
                    {errors.customer && <span className="text-red-500 text-sm">{errors.customer.message}</span>}
                </div>
                <br />

                {/* Tanggal Mulai */}
                <div className='flex gap-x-4'>
                    <label htmlFor="tanggalMulai" className='w-[30%]'>Tanggal Mulai</label>
                    <input
                        type="date"
                        id="tanggalMulai"
                        {...register("tanggalMulai", { required: "Tanggal Mulai is required" })}
                        className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    {errors.tanggalMulai && <span className="text-red-500 text-sm">{errors.tanggalMulai.message}</span>}
                </div>
                <br />

                {/* Deadline */}
                <div className='flex gap-x-4'>
                    <label htmlFor="deadline" className='w-[30%]'>Deadline</label>
                    <input
                        type="date"
                        id="deadline"
                        {...register("deadline", { required: "Deadline is required" })}
                        className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    {errors.deadline && <span className="text-red-500 text-sm">{errors.deadline.message}</span>}
                </div>
                <br />

                {/* Alamat Pengiriman */}
                <div className='flex gap-x-4'>
                    <label htmlFor="alamatPengiriman" className='w-[30%]'>Alamat Pengiriman</label>
                    <input
                        type="text"
                        id="alamatPengiriman"
                        {...register("alamatPengiriman", { required: "Alamat Pengiriman is required" })}
                        className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    {errors.alamatPengiriman && <span className="text-red-500 text-sm">{errors.alamatPengiriman.message}</span>}
                </div>
                <br />

                {/* Tombol Submit */}
                <div className='flex flex-col h-full'>
                    <button type="submit" className="self-end bg-[#65558f] text-white px-4 py-2 rounded mt-4">
                        Tambah Project
                    </button>
                </div>
                <br />
            </form>
        </div>
    )
}

export default TambahProjectPage
