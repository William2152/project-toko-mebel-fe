import React from 'react'

function TambahProductProjectPage() {
    return (
        <div>
            <form>
                <div>
                    <label htmlFor="">Nama Proyek</label>
                    <select name="" id="">
                        <option value=""></option>
                    </select>
                </div>
                <div className='flex gap-x-4'>
                    <label htmlFor="">Nama Produk</label>
                    <input type="text" name="" id="" className="mt-1 border border-gray-300 rounded px-2 py-1" />
                    <label htmlFor="">Tim</label>
                    <select name="" id="" className="mt-1 border border-gray-300 rounded px-2 py-1">
                        <option value=""></option>
                    </select>
                    <button>Add</button>
                </div>
            </form>
        </div>
    )
}

export default TambahProductProjectPage
