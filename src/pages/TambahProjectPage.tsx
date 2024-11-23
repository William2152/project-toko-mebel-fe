import React from 'react'
import { useForm } from 'react-hook-form';

function TambahProjectPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    return (
        <div className='container mx-auto px-5'>
            <form>
                <div className='flex gap-x-4'>
                    <label htmlFor="" className='w-[10%]'>Nama Project</label>
                    <input type="text" name="" id="" className="mt-1 border border-gray-300 rounded px-2 py-1 w-full" />
                </div>
                <br />
                <div className='flex gap-x-4'>
                    <label htmlFor="" className='w-[10%]'>Customer</label>
                    <select name="" id="" className="mt-1 border border-gray-300 rounded px-2 py-1 w-full" >
                        <option value=""></option>
                    </select>
                </div>
                <br />
                <div className='flex gap-x-4'>
                    <label htmlFor="" className='w-[10%]'>Tanggal Mulai</label>
                    <input type="text" name="" id="" className="mt-1 border border-gray-300 rounded px-2 py-1 w-full" />
                </div>
                <br />
                <div className='flex gap-x-4'>
                    <label htmlFor="" className='w-[10%]'>Deadline</label>
                    <input type="text" name="" id="" className="mt-1 border border-gray-300 rounded px-2 py-1 w-full" />
                </div>
                <br />
                <div className='flex gap-x-4'>
                    <label htmlFor="" className='w-[10%]'>Alamat Pengiriman</label>
                    <input type="text" name="" id="" className="mt-1 border border-gray-300 rounded px-2 py-1 w-full" />
                </div>
                <br />
                <div className='flex gap-x-4'>
                    <label htmlFor="" className='w-[10%]'>Tipe Project</label>
                    <select name="" id="" className="mt-1 border border-gray-300 rounded px-2 py-1 w-full" >
                        <option value=""></option>
                    </select>
                </div>
                <br />
                <div className='flex gap-x-4'>
                    <label htmlFor="" className='w-[10%]'>Kode Karyawan</label>
                    <select name="" id="" className="mt-1 border border-gray-300 rounded px-2 py-1 w-full" >
                        <option value=""></option>
                    </select>
                </div>
                <div className='flex flex-col h-full'>
                    <button type="submit" className="self-end bg-[#bcaaa4] text-white px-4 py-2 rounded mt-4">
                        Tambah Project
                    </button>
                </div>
                <br />
            </form>
        </div>
    )
}

export default TambahProjectPage
