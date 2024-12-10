import React from 'react';

function FormHeaderStock({ register }) {
    return (
        <div className="bg-white shadow-xl border-2 rounded-xl p-8">
            {/* <h2 className="text-3xl font-bold text-gray-800 mb-6">Form Input Stock</h2> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                {/* Tanggal Nota */}
                <div className="flex flex-col gap-y-2">
                    <label htmlFor="tanggalNota" className="text-lg font-semibold text-gray-700">
                        Tanggal Nota
                    </label>
                    <input
                        type="text"
                        id="tanggalNota"
                        {...register("tanggalNota", { required: "Tanggal Nota wajib diisi" })}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Masukkan tanggal nota"
                    />
                </div>

                {/* Supplier */}
                <div className="flex flex-col gap-y-2">
                    <label htmlFor="supplier" className="text-lg font-semibold text-gray-700">
                        Supplier
                    </label>
                    <input
                        type="text"
                        id="supplier"
                        {...register("supplier", { required: "Supplier wajib diisi" })}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Masukkan supplier"
                    />
                </div>

                {/* No Surat Jalan */}
                <div className="flex flex-col gap-y-2">
                    <label htmlFor="noSuratJalan" className="text-lg font-semibold text-gray-700">
                        No Surat Jalan
                    </label>
                    <input
                        type="text"
                        id="noSuratJalan"
                        {...register("noSuratJalan", { required: "No Surat Jalan wajib diisi" })}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Masukkan no surat jalan"
                    />
                </div>

                {/* No SPB */}
                <div className="flex flex-col gap-y-2">
                    <label htmlFor="noSpb" className="text-lg font-semibold text-gray-700">
                        No SPB
                    </label>
                    <input
                        type="text"
                        id="noSpb"
                        {...register("noSpb", { required: "No SPB wajib diisi" })}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Masukkan no SPB"
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-8">
                <button
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition duration-200"
                >
                    Simpan
                </button>
            </div>
        </div>
    );
}

export default FormHeaderStock;
