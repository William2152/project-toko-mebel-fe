import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CustomerData, ProjectData } from '../../interface';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import { Card, CardContent, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';

function TambahProjectPage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const schema = Joi.object({
        nama: Joi.string().required().messages({
            'string.empty': 'Nama Project Harus Diisi',
        }),
        id_customer: Joi.string().required().messages({
            'string.empty': 'Customer Harus Diisi',
        }),
        start: Joi.string().required().messages({
            'string.empty': 'Tanggal Mulai Harus Diisi',
        }),
        deadline: Joi.string().required().messages({
            'string.empty': 'Tanggal Deadline Harus Diisi',
        }),
        alamat_pengiriman: Joi.string().required().messages({
            'string.empty': 'Alamat Pengiriman Harus Diisi',
        }),
    })
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProjectData>({
        resolver: joiResolver(schema)
    });
    const [error, setError] = useState('');
    const [customer, setCustomer] = useState([]);

    const onSubmit = async (data: ProjectData) => {
        console.log(data);
        try {
            await axios.post('http://localhost:6347/api/proyek', {
                nama: data.nama,
                id_customer: data.id_customer,
                start: data.start,
                deadline: data.deadline,
                alamat_pengiriman: data.alamat_pengiriman
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            reset();
            setError('Berhasil Menambahkan Project');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
        }
    };

    const fetchCustomer = async () => {
        try {
            const response = await axios.get('http://localhost:6347/api/customer', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCustomer(response.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
        }
    };

    useEffect(() => {
        fetchCustomer();
    }, []);

    return (
        <>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                message={error}
                action={
                    <Fragment>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={() => setError('')}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Fragment>
                }
            />

            <div className="max-w mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-[#65558f] tracking-tight">
                        Tambah Project Baru
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">
                        Isi detail informasi project baru di bawah ini
                    </p>
                </div>

                <Card className="overflow-hidden shadow-lg rounded-xl bg-white">
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Nama Project */}
                            <div className="space-y-2">
                                <label htmlFor="namaProject" className="block text-sm font-medium text-gray-700">
                                    Nama Project
                                </label>
                                <input
                                    type="text"
                                    id="namaProject"
                                    {...register("nama")}
                                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm shadow-sm transition-colors
                                             focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                    placeholder="Masukkan nama project"
                                />
                                {errors.nama && <p className="text-red-500 text-sm mt-1">{String(errors.nama.message)}</p>}
                            </div>

                            {/* Customer Selection */}
                            <div className="space-y-2">
                                <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                                    Customer
                                </label>
                                <select
                                    id="customer"
                                    {...register("id_customer")}
                                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm shadow-sm
                                             focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                >
                                    <option hidden value="">Pilih Customer</option>
                                    {customer.map((customer: CustomerData) => (
                                        <option key={customer.id} value={customer.id}>{customer.nama}</option>
                                    ))}
                                </select>
                                {errors.id_customer && <p className="text-red-500 text-sm mt-1">{errors.id_customer.message}</p>}
                            </div>

                            {/* Date Fields Container */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Start Date */}
                                <div className="space-y-2">
                                    <label htmlFor="tanggalMulai" className="block text-sm font-medium text-gray-700">
                                        Tanggal Mulai
                                    </label>
                                    <input
                                        type="date"
                                        id="tanggalMulai"
                                        {...register("start")}
                                        className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm shadow-sm
                                                 focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                    />
                                    {errors.start && <p className="text-red-500 text-sm mt-1">{errors.start.message}</p>}
                                </div>

                                {/* Deadline */}
                                <div className="space-y-2">
                                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                                        Deadline
                                    </label>
                                    <input
                                        type="date"
                                        id="deadline"
                                        {...register("deadline")}
                                        className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm shadow-sm
                                                 focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                    />
                                    {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>}
                                </div>
                            </div>

                            {/* Alamat Pengiriman */}
                            <div className="space-y-2">
                                <label htmlFor="alamatPengiriman" className="block text-sm font-medium text-gray-700">
                                    Alamat Pengiriman
                                </label>
                                <textarea
                                    id="alamatPengiriman"
                                    {...register("alamat_pengiriman")}
                                    rows={3}
                                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm shadow-sm
                                             focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                    placeholder="Masukkan alamat pengiriman lengkap"
                                />
                                {errors.alamat_pengiriman && <p className="text-red-500 text-sm mt-1">{errors.alamat_pengiriman.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-6 py-3 bg-[#65558f] text-white rounded-lg font-medium text-sm
                                             hover:bg-[#544a7d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#65558f]
                                             transition-colors duration-200 flex items-center justify-center"
                                >
                                    Tambah Project
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

export default TambahProjectPage;
