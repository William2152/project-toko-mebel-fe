import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import { useForm } from 'react-hook-form';
import { KaryawanData, ProjectData, ProyekProdukData } from '../../interface';
import axios from 'axios';
import { IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';

function TambahProductProjectPage() {
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
            await axios.post("http://localhost:6347/api/proyek/produk", {
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
            const response = await axios.get("http://localhost:6347/api/proyek", {
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
            const response = await axios.get("http://localhost:6347/api/karyawan?role=ketua", {
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
            const response = await axios.get("http://localhost:6347/api/karyawan?role=member", {
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
            <div>
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
            </div>
            <div className="mb-12 mt-6">
                <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">
                    Tambah Produk ke Proyek
                </h2>
            </div>
            <div className="border-2 rounded-lg h-auto shadow-2xl mx-12 bg-white">
                <div className="container mx-auto px-12 py-12">
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                                {...register('id_proyek')}
                            >
                                <option hidden value="">Pilih Proyek</option>
                                {proyek.map((proyek: ProjectData) => (
                                    <option key={proyek.id} value={proyek.id}>{proyek.nama}</option>
                                ))}
                            </select>
                            {errors.id_proyek && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.id_proyek.message}
                                </p>
                            )}
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
                                {...register('tipe')}
                            >
                                <option hidden value="">Pilih Tipe</option>
                                <option value="kayu">Kayu</option>
                                <option value="finishing">Finishing</option>
                                <option value="resin">Resin</option>
                            </select>
                            {errors.tipe && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.tipe.message}
                                </p>
                            )}
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
                                {...register('nama_produk')}
                            />
                            {errors.nama_produk && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.nama_produk.message}
                                </p>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="flex flex-col gap-y-2 mb-6">
                            <label
                                htmlFor="quantity"
                                className="text-xl font-semibold text-gray-700"
                            >
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="quantity"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                placeholder="Masukkan jumlah produk"
                                {...register('qty')}
                            />
                            {errors.qty && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.qty.message}
                                </p>
                            )}
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
                                <select
                                    id="penanggungJawab"
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    {...register('id_penanggung_jawab')}
                                >
                                    <option hidden>Penanggung Jawab</option>
                                    {ketua.map((ketua: KaryawanData) => (
                                        <option key={ketua.id} value={ketua.id}>{ketua.nama}</option>
                                    ))}
                                </select>
                                {errors.id_penanggung_jawab && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.id_penanggung_jawab.message}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <label
                                    htmlFor="karyawan1"
                                    className="text-lg font-medium text-gray-700"
                                >
                                    Karyawan 1
                                </label>
                                <select
                                    id="karyawan1"
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    {...register('id_karyawan1')}
                                >
                                    <option hidden>Karyawan 1</option>
                                    {member.map((member: KaryawanData) => (
                                        <option key={member.id} value={member.id}>{member.nama}</option>
                                    ))}
                                </select>
                                {errors.id_karyawan1 && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.id_karyawan1.message}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-y-2">
                                <label
                                    htmlFor="karyawan2"
                                    className="text-lg font-medium text-gray-700"
                                >
                                    Karyawan 2
                                </label>
                                <select
                                    id="karyawan2"
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                    {...register('id_karyawan2')}
                                >
                                    <option hidden>Karyawan 2</option>
                                    {member.map((member: KaryawanData) => (
                                        <option key={member.id} value={member.id}>{member.nama}</option>
                                    ))}
                                </select>
                                {errors.id_karyawan2 && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.id_karyawan2.message}
                                    </p>
                                )}
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
