import React from 'react'

function FormInputBarang({ register, namaBahan, satuan }: any) {
    console.log(namaBahan);
    console.log(register);

    return (
        <>
            {/* Tambah barang */}
            <div className="flex justify-start gap-x-10 items-center p-4">
                {/* Nama Barang */}
                <div className="flex flex-col items-start p-4 rounded">
                    <label htmlFor="">Nama Bahan</label>
                    <select className='mt-1 border border-gray-300 rounded px-2 py-1 w-[200px]'
                        {...register("namaBahan")} name='namaBahan'>
                        <option value="" hidden>Pilih Bahan</option>
                        {namaBahan.map((bahan: any) => {
                            return (
                                <option value={bahan.nama}>{bahan.nama}</option>
                            )
                        })}
                    </select>
                </div>
                {/* Jumlah Barang */}
                <div className="flex flex-col items-start p-4 rounded">
                    <label htmlFor="">Jumlah Bahan</label>
                    <input type="number" className='mt-1 border border-gray-300 rounded px-2 py-1' {...register("jumlahBahan")} min={0} name="jumlahBahan" />
                </div>
                {/* Satuan */}
                <div className="flex flex-col items-start p-4 rounded">
                    <label htmlFor="">Satuan</label>
                    <select
                        className='mt-1 border border-gray-300 rounded px-2 py-1 w-[200px]'
                        {...register("satuan")}
                        name="satuan">
                        <option value="" hidden>Pilih Satuan</option>
                        {satuan.map((s: any) => {
                            return (
                                <option value={s.nama}>{s.nama}</option>
                            )
                        })}
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
