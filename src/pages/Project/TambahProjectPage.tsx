import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CustomerData, ProjectData } from '../../interface';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import { IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function TambahProjectPage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<ProjectData>();
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
            <div>
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
            </div>
            <div className="mb-12 mt-6">
                <h2 className="text-4xl font-bold text-[#65558f] mb-6 text-center">Tambah Project Baru</h2>
            </div>
            <div className="border-2 rounded-lg shadow-2xl mx-12">
                <div className="container mx-auto px-12 py-12">
                    {/* Formulir untuk Menambah Project */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Nama Project */}
                        <div className="flex flex-col gap-y-4 mb-6">
                            <label htmlFor="namaProject" className="text-xl font-bold">Nama Project</label>
                            <input
                                type="text"
                                id="namaProject"
                                {...register("nama")}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                            />
                            {errors.nama && <span className="text-red-500 text-sm">{String(errors.nama.message)}</span>}
                        </div>

                        {/* Customer */}
                        <div className="flex flex-col gap-y-4 mb-6">
                            <label htmlFor="customer" className="text-xl font-bold">Customer</label>
                            <select
                                id="customer"
                                {...register("id_customer")}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                            >
                                <option hidden value="">Pilih Customer</option>
                                {customer.map((customer: CustomerData) => (
                                    <option key={customer.id} value={customer.id}>{customer.nama}</option>
                                ))}
                            </select>
                            {errors.id_customer && <span className="text-red-500 text-sm">{errors.id_customer.message}</span>}
                        </div>

                        {/* Tanggal Mulai */}
                        <div className="flex flex-col gap-y-4 mb-6">
                            <label htmlFor="tanggalMulai" className="text-xl font-bold">Tanggal Mulai</label>
                            <input
                                type="date"
                                id="tanggalMulai"
                                {...register("start")}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                            />
                            {errors.start && <span className="text-red-500 text-sm">{errors.start.message}</span>}
                        </div>

                        {/* Deadline */}
                        <div className="flex flex-col gap-y-4 mb-6">
                            <label htmlFor="deadline" className="text-xl font-bold">Deadline</label>
                            <input
                                type="date"
                                id="deadline"
                                {...register("deadline")}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                            />
                            {errors.deadline && <span className="text-red-500 text-sm">{errors.deadline.message}</span>}
                        </div>

                        {/* Alamat Pengiriman */}
                        <div className="flex flex-col gap-y-4 mb-6">
                            <label htmlFor="alamatPengiriman" className="text-xl font-bold">Alamat Pengiriman</label>
                            <input
                                type="text"
                                id="alamatPengiriman"
                                {...register("alamat_pengiriman")}
                                className="border-2 border-gray-300 rounded px-4 py-2 w-full"
                            />
                            {errors.alamat_pengiriman && <span className="text-red-500 text-sm">{errors.alamat_pengiriman.message}</span>}
                        </div>

                        {/* Tombol Submit */}
                        <div className="flex justify-end">
                            <button type="submit" className="bg-[#65558f] text-white px-6 py-3 rounded-lg font-bold text-lg">
                                Tambah Project
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default TambahProjectPage;
