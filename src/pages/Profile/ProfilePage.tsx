import React, { Fragment, useEffect, useState } from 'react'
import { PasswordFormData, ProfileData } from '../../interface';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/storeRedux';
import axios from 'axios';
import { Card, CardContent, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';


function ProfilePage() {
    const API_URL = import.meta.env.VITE_API_URL;
    const token = useSelector((state: RootState) => state.localStorage.value);
    const schema = Joi.object({
        "oldPassword": Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])')).messages({
            'string.empty': 'Old Password harus diisi',
            'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
        }),
        "newPassword": Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])')).messages({
            'string.empty': 'New Password harus diisi',
            'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
        })
    })
    const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormData>({
        resolver: joiResolver(schema)
    });
    const [profileData, setProfileData] = useState<ProfileData>();
    const [error, setError] = useState("");

    const onSubmitPassword = async (data: PasswordFormData) => {
        try {
            await axios.put(`${API_URL}/api/users/profile/password`, { old_password: data.oldPassword, new_password: data.newPassword }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            reset();
        } catch (error) {
            console.error('Error updating password:', error);
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.message);
            }
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/users/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProfileData(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data.message);
                }
            }
        };

        fetchProfileData();
    }, [token]);

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
                <div className="text-center mb-12 bg-[#65558f] rounded-lg py-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Profile Settings
                    </h1>
                    <p className="mt-2 text-lg text-white">
                        Manage your account information and password
                    </p>
                </div>

                <Card className="overflow-hidden shadow-lg rounded-2xl bg-white">
                    <CardContent className="p-8">
                        {/* Profile Information Section */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-semibold text-[#65558f] mb-6 pb-2 border-b border-gray-200">
                                Personal Information
                            </h2>
                            <div className="grid gap-6">
                                <div className="flex items-center">
                                    <div className="w-40 text-sm font-medium text-gray-500">Username</div>
                                    <div className="flex-1 text-lg font-medium text-gray-900">{profileData?.username}</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-40 text-sm font-medium text-gray-500">Name</div>
                                    <div className="flex-1 text-lg font-medium text-gray-900">{profileData?.nama}</div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-40 text-sm font-medium text-gray-500">Role</div>
                                    <div className="flex-1">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-[#65558f]">
                                            {profileData?.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-40 text-sm font-medium text-gray-500">Email</div>
                                    <div className="flex-1 text-lg font-medium text-gray-900">{profileData?.email}</div>
                                </div>
                            </div>
                        </div>

                        {/* Password Change Section */}
                        <div className="mt-10">
                            <h2 className="text-2xl font-semibold text-[#65558f] mb-6 pb-2 border-b border-gray-200">
                                Change Password
                            </h2>
                            <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-6">
                                <div>
                                    <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        id="oldPassword"
                                        {...register("oldPassword")}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                    />
                                    {errors.oldPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.oldPassword.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        {...register("newPassword")}
                                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#65558f] focus:border-transparent"
                                    />
                                    {errors.newPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-[#65558f] hover:bg-[#544a7d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#65558f] transition-colors duration-200"
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default ProfilePage
