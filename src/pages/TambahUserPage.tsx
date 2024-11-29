import React from 'react'
import { useForm } from 'react-hook-form'

function TambahUserPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <div className='container mx-auto px-5'>
            {/* Halaman Deskripsi */}
            <div className='mb-6'>
                <h2 className='text-2xl font-bold text-[#65558f] mb-2'>Tambah Pengguna Baru</h2>
            </div>

            {/* Formulir untuk Menambah Pengguna */}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Name Input */}
                <div className='flex gap-x-4'>
                    <label htmlFor="name" className='w-[30%]'>Nama Lengkap</label>
                    <input
                        type="text"
                        id="name"
                        {...register("name", { required: "Nama Lengkap is required" })}
                        className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>
                <br />

                {/* Username Input */}
                <div className='flex gap-x-4'>
                    <label htmlFor="username" className='w-[30%]'>Username</label>
                    <input
                        type="text"
                        id="username"
                        {...register("username", { required: "Username is required" })}
                        className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                </div>
                <br />

                {/* Email Input */}
                <div className='flex gap-x-4'>
                    <label htmlFor="email" className='w-[30%]'>Email</label>
                    <input
                        type="email"
                        id="email"
                        {...register("email", { required: "Email is required", pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email" } })}
                        className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>
                <br />

                {/* Password Input */}
                <div className='flex gap-x-4'>
                    <label htmlFor="password" className='w-[30%]'>Password</label>
                    <input
                        type="password"
                        id="password"
                        {...register("password", { required: "Password is required" })}
                        className="mt-1 border border-gray-300 rounded px-2 py-1 w-full"
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>
                <br />

                {/* Submit Button */}
                <div className='flex flex-col h-full'>
                    <button type="submit" className="self-end bg-[#65558f] text-white px-4 py-2 rounded mt-4">
                        Tambah User
                    </button>
                </div>
                <br />
            </form>
        </div>
    )
}

export default TambahUserPage
