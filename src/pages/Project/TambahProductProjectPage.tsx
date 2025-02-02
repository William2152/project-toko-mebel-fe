import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import { useForm } from 'react-hook-form';
import { KaryawanData, ProjectData, ProyekProdukData } from '../../interface';
import axios from 'axios';
import { Card, CardContent, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';

function TambahProductProjectPage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = useSelector((state: RootState) => state.localStorage.value);
    const schema = Joi.object({
        id_proyek: Joi.string().required().messages({
            'string.empty': 'Proyek Harus Diisi',
        }),
        tipe: Joi.string().required().messages({
            'string.empty': 'Tipe Produk Harus Diisi',
        }),
        id_penanggung_jawab: Joi.number().required().messages({
            'number.base': 'Penanggung Jawab Harus Diisi',
        }),
        id_karyawan1: Joi.number().required().messages({
            'number.base': 'Karyawan 1 Harus Diisi',
        }),
        id_karyawan2: Joi.number().required().messages({
            'number.base': 'Karyawan 2 Harus Diisi',
        }),
        nama_produk: Joi.string().required().messages({
            'string.empty': 'Nama Produk Harus Diisi',
        }),
        qty: Joi.number().required().greater(0).messages({
            'number.greater': 'Jumlah Produk harus lebih besar dari 0',
            'number.base': 'Jumlah Produk Harus Diisi',
        }),
    })
    const { handleSubmit, register, reset, formState: { errors } } = useForm<ProyekProdukData>({
        resolver: joiResolver(schema)
    });
    const [error, setError] = useState('');
    const [proyek, setProyek] = useState([]);
    const [ketua, setKetua] = useState([]);
    const [member, setMember] = useState([]);

    const onSubmit = async (data: ProyekProdukData) => {
        console.log(data)
        try {
            await axios.post(`${API_URL}/api/proyek/produk`, {
                id_proyek: data.id_proyek,
                tipe: data.tipe,
                id_penanggung_jawab: data.id_penanggung_jawab,
                id_karyawan1: data.id_karyawan1,
                id_karyawan2: data.id_karyawan2,
                nama_produk: data.nama_produk,
                qty: data.qty
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            reset();
            setError('Berhasil Menambahkan Produk');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
        }
    };

    const fetchProyek = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/proyek`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProyek(response.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
        }
    }

    const fetchKetua = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/karyawan?role=ketua`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setKetua(response.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
        }
    }

    const fetchMember = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/karyawan?role=member`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMember(response.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
        }
    }

    useEffect(() => {
        fetchProyek();
        fetchKetua();
        fetchMember();
    }, [])

    return (
        <>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError("")}
                message={error}
                action={
                    <Fragment>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => setError("")}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Fragment>
                }
            />

            <div className="max-w mx-auto">
                <div className="text-center mb-8 bg-[#65558f] rounded-lg py-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Tambah Produk ke Proyek
                    </h1>
                    <p className="mt-2 text-lg text-white">
                        Isi informasi produk dan tentukan penanggung jawab
                    </p>
                </div>

                <Card className="overflow-hidden shadow-lg rounded-xl bg-white">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama Proyek */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Proyek
                                    </label>
                                    <select
                                        {...register('id_proyek')}
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm
                                                 focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                    >
                                        <option hidden value="">Pilih Proyek</option>
                                        {proyek.map((proyek: ProjectData) => (
                                            <option key={proyek.id} value={proyek.id}>{proyek.nama}</option>
                                        ))}
                                    </select>
                                    {errors.id_proyek && (
                                        <p className="text-red-500 text-sm">{errors.id_proyek.message}</p>
                                    )}
                                </div>

                                {/* Tipe Proyek */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tipe Proyek
                                    </label>
                                    <select
                                        {...register('tipe')}
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm
                                                 focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                    >
                                        <option hidden value="">Pilih Tipe</option>
                                        <option value="kayu">Kayu</option>
                                        <option value="finishing">Finishing</option>
                                        <option value="resin">Resin</option>
                                    </select>
                                    {errors.tipe && (
                                        <p className="text-red-500 text-sm">{errors.tipe.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nama Produk */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nama Produk
                                    </label>
                                    <input
                                        type="text"
                                        {...register('nama_produk')}
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm
                                                 focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                        placeholder="Masukkan nama produk"
                                    />
                                    {errors.nama_produk && (
                                        <p className="text-red-500 text-sm">{errors.nama_produk.message}</p>
                                    )}
                                </div>

                                {/* Quantity */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        {...register('qty')}
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm
                                                 focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                        placeholder="Masukkan jumlah produk"
                                    />
                                    {errors.qty && (
                                        <p className="text-red-500 text-sm">{errors.qty.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Penanggung Jawab Section */}
                            <div className="pt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b">
                                    Penanggung Jawab
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Penanggung Jawab */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Penanggung Jawab Utama
                                        </label>
                                        <select
                                            {...register('id_penanggung_jawab')}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm
                                                     focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                        >
                                            <option hidden value="">Pilih Penanggung Jawab</option>
                                            {ketua.map((ketua: KaryawanData) => (
                                                <option key={ketua.id} value={ketua.id}>{ketua.nama}</option>
                                            ))}
                                        </select>
                                        {errors.id_penanggung_jawab && (
                                            <p className="text-red-500 text-sm">{errors.id_penanggung_jawab.message}</p>
                                        )}
                                    </div>

                                    {/* Karyawan 1 */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Karyawan 1
                                        </label>
                                        <select
                                            {...register('id_karyawan1')}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm
                                                     focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                        >
                                            <option hidden value="">Pilih Karyawan 1</option>
                                            {member.map((member: KaryawanData) => (
                                                <option key={member.id} value={member.id}>{member.nama}</option>
                                            ))}
                                        </select>
                                        {errors.id_karyawan1 && (
                                            <p className="text-red-500 text-sm">{errors.id_karyawan1.message}</p>
                                        )}
                                    </div>

                                    {/* Karyawan 2 */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Karyawan 2
                                        </label>
                                        <select
                                            {...register('id_karyawan2')}
                                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm
                                                     focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                        >
                                            <option hidden value="">Pilih Karyawan 2</option>
                                            {member.map((member: KaryawanData) => (
                                                <option key={member.id} value={member.id}>{member.nama}</option>
                                            ))}
                                        </select>
                                        {errors.id_karyawan2 && (
                                            <p className="text-red-500 text-sm">{errors.id_karyawan2.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-6">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-6 py-3 bg-[#65558f] text-white rounded-lg font-medium
                                             hover:bg-[#544a7d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#65558f]
                                             transition-colors duration-200 flex items-center justify-center"
                                >
                                    Tambah Produk
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default TambahProductProjectPage;
