import React from 'react';

function TambahProductProjectPage() {
    return (
        <>
            <div className="mb-12 mt-6">
                <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">
                    Tambah Produk ke Proyek
                </h2>
            </div>
            <div className="border-2 rounded-lg h-auto shadow-2xl mx-12 bg-white">
                <div className="container mx-auto px-12 py-12">
                    <form>
                        {/* Nama Proyek */}
                        <div className="flex flex-col gap-y-2 mb-6">
                            <label
                                htmlFor="namaProyek"
                                className="text-xl font-semibold text-gray-700"
                            >
                                Nama Proyek
                            </label>
                            <select
                                id="namaProyek"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                <option value="">Pilih Proyek</option>
                            </select>
                        </div>

                        {/* Tipe Proyek */}
                        <div className="flex flex-col gap-y-2 mb-6">
                            <label
                                htmlFor="tipeProyek"
                                className="text-xl font-semibold text-gray-700"
                            >
                                Tipe Proyek
                            </label>
                            <select
                                id="tipeProyek"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                <option value="">Pilih Tipe</option>
                            </select>
                        </div>

                        {/* Nama Produk */}
                        <div className="flex flex-col gap-y-2 mb-6">
                            <label
                                htmlFor="namaProduk"
                                className="text-xl font-semibold text-gray-700"
                            >
                                Nama Produk
                            </label>
                            <input
                                type="text"
                                id="namaProduk"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                placeholder="Masukkan nama produk"
                            />
                        </div>

                        {/* List Penanggung Jawab */}
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                            List Penanggung Jawab
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            <div className="flex flex-col gap-y-2">
                                <label
                                    htmlFor="penanggungJawab"
                                    className="text-lg font-medium text-gray-700"
                                >
                                    Penanggung Jawab
                                </label>
                                <input
                                    type="text"
                                    id="penanggungJawab"
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Masukkan nama penanggung jawab"
                                />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <label
                                    htmlFor="karyawan1"
                                    className="text-lg font-medium text-gray-700"
                                >
                                    Karyawan 1
                                </label>
                                <input
                                    type="text"
                                    id="karyawan1"
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Masukkan nama karyawan 1"
                                />
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <label
                                    htmlFor="karyawan2"
                                    className="text-lg font-medium text-gray-700"
                                >
                                    Karyawan 2
                                </label>
                                <input
                                    type="text"
                                    id="karyawan2"
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Masukkan nama karyawan 2"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-[#65558f] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition focus:ring-2 focus:ring-purple-500"
                        >
                            Tambah Produk
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default TambahProductProjectPage;
