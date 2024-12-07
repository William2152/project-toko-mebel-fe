function MasterBahanPage() {
    return (
        <>
            {/* Header */}
            <div className="mb-12 mt-6">
                <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">
                    Master Bahan
                </h2>
            </div>

            {/* Form Container */}
            <div className="flex justify-between">
                {/* Tambah Nama Bahan */}
                <div className="border-2 rounded-lg w-[40%] shadow-2xl mx-12 bg-white text-[#65558f]">
                    <div className="container mx-auto px-8 py-8">
                        <h3 className="text-2xl font-bold mb-6">Tambah Nama Bahan</h3>
                        <form>
                            <div className="mb-4">
                                <label
                                    htmlFor="namaBahan"
                                    className="block text-lg font-medium text-gray-700 mb-2"
                                >
                                    Nama Bahan
                                </label>
                                <input
                                    type="text"
                                    id="namaBahan"
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Masukkan nama bahan"
                                />
                            </div>
                            <button
                                type="button"
                                className="bg-[#65558f] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                            >
                                Tambah Bahan
                            </button>
                        </form>
                    </div>
                </div>

                {/* Tambah Satuan Bahan */}
                <div className="border-2 rounded-lg w-[60%] shadow-2xl mx-12 bg-white">
                    <div className="container mx-auto px-8 py-8">
                        <h3 className="text-2xl font-bold mb-6 text-[#65558f]">Tambah Satuan Bahan</h3>
                        <form>
                            <div className="mb-4">
                                <label
                                    htmlFor="satuanBahan"
                                    className="block text-lg font-medium text-gray-700 mb-2"
                                >
                                    Satuan Bahan
                                </label>
                                <input
                                    type="text"
                                    id="satuanBahan"
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Masukkan satuan bahan"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="satuanTerkecil"
                                    className="block text-lg font-medium text-gray-700 mb-2"
                                >
                                    Satuan Terkecil Bahan
                                </label>
                                <input
                                    type="text"
                                    id="satuanTerkecil"
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Masukkan satuan terkecil bahan"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="konversi"
                                    className="block text-lg font-medium text-gray-700 mb-2"
                                >
                                    Satuan Bahan ke Satuan Terkecil Bahan
                                </label>
                                <input
                                    type="number"
                                    id="konversi"
                                    className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    placeholder="Masukkan nilai konversi"
                                />
                            </div>
                            <button
                                type="button"
                                className="bg-[#65558f] text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                            >
                                Tambah Satuan
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MasterBahanPage;
