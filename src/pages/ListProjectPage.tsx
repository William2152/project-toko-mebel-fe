import React from 'react';

function ListProjectPage() {
    return (
        <>
            <div className="mb-12 mt-6">
                <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">List Project</h2>
            </div>
            <div className="border-2 rounded-lg shadow-2xl mx-12 bg-white">
                <div className="container mx-auto px-8 py-8">
                    {/* Pencarian */}
                    <div className="mb-6 flex justify-end">
                        <input
                            type="text"
                            placeholder="Cari Proyek..."
                            className="border-2 border-gray-300 rounded px-4 py-2 w-1/3 text-sm focus:outline-none focus:ring-2 focus:ring-[#65558f]"
                        />
                    </div>

                    {/* Tabel */}
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-[#65558f] text-white text-left">
                                <th className="p-4 text-sm font-medium w-16">No</th>
                                <th className="p-4 text-sm font-medium">Nama Proyek</th>
                                <th className="p-4 text-sm font-medium">Tipe</th>
                                <th className="p-4 text-sm font-medium">Penanggung Jawab</th>
                                <th className="p-4 text-sm font-medium">Tanggal Mulai</th>
                                <th className="p-4 text-sm font-medium w-32">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Contoh Data */}
                            {[1, 2, 3].map((item, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                                        } hover:bg-gray-200 transition`}
                                >
                                    <td className="p-4 text-sm text-gray-700">{index + 1}</td>
                                    <td className="p-4 text-sm text-gray-700">
                                        Proyek {index + 1}
                                    </td>
                                    <td className="p-4 text-sm text-gray-700">Tipe A</td>
                                    <td className="p-4 text-sm text-gray-700">
                                        Penanggung Jawab {index + 1}
                                    </td>
                                    <td className="p-4 text-sm text-gray-700">2024-12-07</td>
                                    <td className="p-4">
                                        <button
                                            className="bg-[#65558f] text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition"
                                        >
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default ListProjectPage;
