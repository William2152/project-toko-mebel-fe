import React from 'react'

function FormHeaderStock({ register }: any) {
    return (
        <>
            {/* Header Nota */}
            <div className="flex justify-start gap-x-10 items-center p-4">
                {/* Tanggal Nota */}
                <div className="flex flex-col items-start bg-[#bcaaa4] p-4 rounded">
                    <label htmlFor="tanggalNota" className="text-sm font-semibold">Tanggal Nota</label>
                    <input
                        type="text"
                        id="tanggalNota"
                        {...register("tanggalNota")}
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
                        {...register("supplier")}
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
                        {...register("noSuratJalan")}
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
                        {...register("noSpb")}
                        className="mt-1 border border-gray-300 rounded px-2 py-1"
                        placeholder="Input"
                    />
                </div>

                {/* Save Button */}
                <button type='submit' className="bg-purple-500 text-white px-6 py-2 rounded-full hover:bg-purple-700">
                    Save
                </button>
            </div>
        </>
    )
}

export default FormHeaderStock
