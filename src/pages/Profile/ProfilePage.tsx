import React, { Fragment, useEffect, useState } from 'react'
import { PasswordFormData, ProfileData } from '../../interface';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import axios from 'axios';
import { IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


function ProfilePage() {
    const token = useSelector((state: RootState) => state.localStorage.value);
    const role = localStorage.getItem('role');
    const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormData>();
    const [profileData, setProfileData] = useState<ProfileData>();
    const [error, setError] = useState("");

    const onSubmitPassword = async (data: PasswordFormData) => {
        try {
            await axios.put('http://localhost:6347/api/users/profile/password', { old_password: data.oldPassword, new_password: data.newPassword }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            reset();
        } catch (error) {
            console.error('Error updating password:', error);
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('http://localhost:6347/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setError(error.response.data.message);
            }
        };

        fetchProfileData();
    }, [token]);

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
            <div>
                {/* Header Halaman */}
                <div className="mb-12 mt-6">
                    <h2 className="text-4xl font-bold text-[#65558f] mb-2 mx-12">Profile</h2>
                </div>

                <div className="border-2 rounded-lg h-[80vh] shadow-2xl mx-12">
                    <div className="container mx-auto px-12 py-12">
                        {/* Header Data Profile */}
                        <div className="mb-6">
                            <h3 className="text-3xl text-[#65558f] font-semibold mb-4 border-b-2 border-gray-300 pb-2">Data Profile</h3>
                        </div>

                        {/* Informasi Profil */}
                        <div className="mb-8">
                            <div className="flex gap-x-4 mb-4">
                                <label className="w-[25%] text-2xl font-bold">Username</label>
                                <span className="text-xl font-medium text-gray-700">{profileData?.username}</span>
                            </div>
                            <div className="flex gap-x-4 mb-4">
                                <label className="w-[25%] text-2xl font-bold">Nama</label>
                                <span className="text-xl font-medium text-gray-700">{profileData?.nama}</span>
                            </div>
                            <div className="flex gap-x-4 mb-4">
                                <label className="w-[25%] text-2xl font-bold">Role</label>
                                <span className="text-xl font-medium text-gray-700">{profileData?.role}</span>
                            </div>
                            <div className="flex gap-x-4 mb-4">
                                <label className="w-[25%] text-2xl font-bold">Email</label>
                                <span className="text-xl font-medium text-gray-700">{profileData?.email}</span>
                            </div>
                        </div>

                        {/* Header Ubah Password */}
                        <div className="mb-6">
                            <h3 className="text-3xl font-semibold text-[#65558f] mb-4 border-b-2 border-gray-300 pb-2">Ubah Password</h3>
                        </div>

                        {/* Formulir Ganti Password */}
                        <form onSubmit={handleSubmit(onSubmitPassword)}>
                            {/* Password Lama */}
                            <div className="flex gap-x-4 mb-4">
                                <label htmlFor="oldPassword" className="w-[25%] text-2xl font-bold">Old Password</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    {...register("oldPassword", { required: "Old password is required" })}
                                    className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                                />
                                {errors.oldPassword && <span className="text-red-500 text-sm">{errors.oldPassword.message}</span>}
                            </div>

                            {/* Password Baru */}
                            <div className="flex gap-x-4 mb-4">
                                <label htmlFor="newPassword" className="w-[25%] text-2xl font-bold">New Password</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    {...register("newPassword", {
                                        required: "New password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters" },
                                    })}
                                    className="border-2 border-gray-300 rounded px-2 py-2 w-full"
                                />
                                {errors.newPassword && <span className="text-red-500 text-sm">{errors.newPassword.message}</span>}
                            </div>

                            {/* Tombol Submit */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-[#65558f] text-white px-4 py-3 rounded-lg mt-4 font-bold text-xl"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePage
