import React from 'react';

function FormHeaderStock({ register }) {
    return (
        <>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                {/* Tanggal Nota */}
                <div className="flex gap-x-4 items-center">
                    <label htmlFor="tanggalNota" className="w-[25%] text-2xl font-bold">Tanggal Nota</label>
                    <input
                        type="text"
                        id="tanggalNota"
                        {...register("tanggalNota", { required: "Tanggal Nota wajib diisi" })}
                        className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                        placeholder="Input"
                    />
                </div>

                {/* Supplier */}
                <div className="flex gap-x-4 items-center">
                    <label htmlFor="supplier" className="w-[25%] text-2xl font-bold">Supplier</label>
                    <input
                        type="text"
                        id="supplier"
                        {...register("supplier", { required: "Supplier wajib diisi" })}
                        className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                        placeholder="Input"
                    />
                </div>

                {/* No Surat Jalan */}
                <div className="flex gap-x-4 items-center">
                    <label htmlFor="noSuratJalan" className="w-[25%] text-2xl font-bold">No Surat Jalan</label>
                    <input
                        type="text"
                        id="noSuratJalan"
                        {...register("noSuratJalan", { required: "No Surat Jalan wajib diisi" })}
                        className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                        placeholder="Input"
                    />
                </div>

                {/* No SPB */}
                <div className="flex gap-x-4 items-center">
                    <label htmlFor="noSpb" className="w-[25%] text-2xl font-bold">No SPB</label>
                    <input
                        type="text"
                        id="noSpb"
                        {...register("noSpb", { required: "No SPB wajib diisi" })}
                        className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                        placeholder="Input"
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-6">
                <button type="submit" className="bg-[#65558f] text-white px-4 py-3 rounded font-bold text-xl rounded-lg hover:bg-purple-700">
                    Save
                </button>
            </div>
        </>
    );
}

export default FormHeaderStock;
