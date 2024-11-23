import React from 'react'

function FormInputBarang({ register }: any) {
    return (
        <>
            {/* Tambah barang */}
            <div className="flex justify-start gap-x-10 items-center p-4">
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
                <button type='submit' className="bg-purple-500 text-white mt-4 px-6 py-2 rounded-full hover:bg-purple-700">
                    Tambah Barang
                </button>
            </div>
        </>
    )
}

export default FormInputBarang
