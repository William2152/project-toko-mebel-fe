import React from 'react'
import { useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function TambahProjectPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <>
            <div className='mb-12 mt-6'>
                <h2 className='text-4xl font-bold text-[#65558f] mb-2 mx-12'>Tambah Project Baru</h2>
            </div>
            <div className='border-2 rounded-lg h-[80vh] shadow-2xl mx-12'>
                <div className='container mx-auto px-12 py-12'>
                    {/* Formulir untuk Menambah Project */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Tombol Submit */}
                        <div className='flex flex-col h-full'>
                            <button type="submit" className="self-end bg-[#65558f] text-white px-4 py-3 rounded-lg mt-4 font-bold text-xl">
                                Tambah Project
                            </button>
                        </div>
                        <br />

                        {/* <Autocomplete
                            disablePortal
                            options={["Option 1", "Option 2", "Option 3"]}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} />}
                        /> */}
                        {/* Nama Project */}
                        <div className='flex gap-x-4'>
                            <label htmlFor="namaProject" className='w-[25%] text-2xl font-bold'>Nama Project</label>
                            <input
                                type="text"
                                id="namaProject"
                                {...register("namaProject", { required: "Nama Project is required" })}
                                className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                            />
                            {errors.namaProject && <span className="text-red-500 text-sm">{errors.namaProject.message}</span>}
                        </div>
                        <br />

                        {/* Customer */}
                        <div className='flex gap-x-4'>
                            <label htmlFor="customer" className='w-[25%] text-2xl font-bold'>Customer</label>
                            <select
                                id="customer"
                                {...register("customer", { required: "Customer is required" })}
                                className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                            >
                                <option value="">Pilih Customer</option>
                            </select>
                            {errors.customer && <span className="text-red-500 text-sm">{errors.customer.message}</span>}
                        </div>
                        <br />

                        {/* Tanggal Mulai */}
                        <div className='flex gap-x-4'>
                            <label htmlFor="tanggalMulai" className='w-[25%] text-2xl font-bold'>Tanggal Mulai</label>
                            <input
                                type="date"
                                id="tanggalMulai"
                                {...register("tanggalMulai", { required: "Tanggal Mulai is required" })}
                                className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                            />
                            {errors.tanggalMulai && <span className="text-red-500 text-sm">{errors.tanggalMulai.message}</span>}
                        </div>
                        <br />

                        {/* Deadline */}
                        <div className='flex gap-x-4'>
                            <label htmlFor="deadline" className='w-[25%] text-2xl font-bold'>Deadline</label>
                            <input
                                type="date"
                                id="deadline"
                                {...register("deadline", { required: "Deadline is required" })}
                                className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                            />
                            {errors.deadline && <span className="text-red-500 text-sm">{errors.deadline.message}</span>}
                        </div>
                        <br />

                        {/* Alamat Pengiriman */}
                        <div className='flex gap-x-4'>
                            <label htmlFor="alamatPengiriman" className='w-[25%] text-2xl font-bold'>Alamat Pengiriman</label>
                            <input
                                type="text"
                                id="alamatPengiriman"
                                {...register("alamatPengiriman", { required: "Alamat Pengiriman is required" })}
                                className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                            />
                            {errors.alamatPengiriman && <span className="text-red-500 text-sm">{errors.alamatPengiriman.message}</span>}
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default TambahProjectPage
