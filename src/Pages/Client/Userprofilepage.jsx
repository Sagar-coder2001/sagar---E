import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { selectUserInfo, updateUserAsync } from '../../Features/Userslice';
import Layout from '../../Components/Client/Layout/Layout'
import Protected from './Protected';
import ScrollTop from '../../Components/Client/Common/Scolltop';

export default function UserProfile() {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);
  const [selectedEditIndex, setSelectedEditIndex] = useState(-1);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const bgcolor = useSelector((state) => state.theme.value)
  const txtcolor = useSelector((state) => state.theme.textcolor)


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleEdit = (addressUpdate, index) => {
    const newUser = { ...userInfo, address: [...userInfo.address] }; // for shallow copy issue
    newUser.address.splice(index, 1, addressUpdate);
    dispatch(updateUserAsync(newUser));
    setSelectedEditIndex(-1);
  };
  const handleRemove = (e, index) => {
    const newUser = { ...userInfo, address: [...userInfo.address] }; // for shallow copy issue
    newUser.address.splice(index, 1);
    dispatch(updateUserAsync(newUser));
  };

  const handleEditForm = (index) => {
    setSelectedEditIndex(index);
    const address = userInfo.address[index];
    setValue('name', address.name);
    setValue('email', address.email);
    setValue('city', address.city);
    setValue('state', address.state);
    setValue('pinCode', address.pinCode);
    setValue('country', address.country);
    setValue('street', address.street);
  };

  const handleAdd = (address) => {
    const newUser = { ...userInfo, address: [...userInfo.address, address] };
    dispatch(updateUserAsync(newUser));
    setShowAddAddressForm(false);
  };

  return (
    <Layout>
      <Protected>
        <ScrollTop />
        <div>
          <div className="max-w-full px-4 sm:px-6 lg:px-8 pt-20" style={{ backgroundColor: bgcolor, color: txtcolor }}>
            <div className="shadow-lg rounded-2xl px-4 py-5 sm:px-6 md:px-8 lg:px-10 my-4 sm:my-6 sm:mx-4 md:mx-8 border-t-4 border-red-500 w-full max-w-3xl mx-auto mt-5 shadow-amber-300">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                {/* Name: {userInfo ? userInfo.address[0].name : 'New User'} */}
                Welcome Back!
              </h1>

              <div className="text-sm sm:text-base md:text-lg mb-4">
                <span className="font-semibold ">Email Address:</span>
                <span className="ml-2 text-blue-700 break-words">{userInfo.email}</span>
              </div>

              {userInfo.role === 'admin' && (
                <div className="text-sm sm:text-base md:text-lg">
                  <span className="font-semibold text-gray-900">Role:</span>
                  <span className="ml-2 text-red-700 capitalize">{userInfo.role}</span>
                </div>
              )}
            </div>


            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
              <button
                onClick={(e) => {
                  setShowAddAddressForm(true);
                  setSelectedEditIndex(-1);
                }}
                type="submit"
                className="rounded-md my-5 bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add New Address
              </button>
              {showAddAddressForm ? (
                <form
                  className="max-w-4xl mx-auto bg-[#FDFAF6] shadow-xl rounded-2xl p-6 sm:p-10"
                  noValidate
                  onSubmit={handleSubmit((data) => {
                    handleAdd(data);
                    reset();
                  })}
                >
                  <div className="space-y-10">
                    <div className="border-b border-gray-200 pb-8">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Personal Information</h2>
                      <p className="mt-1 text-sm text-gray-600">Use a permanent address where you can receive mail.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Full Name */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          {...register('name', { required: 'Name is required' })}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                      </div>

                      {/* Email */}
                      <div className="col-span-1 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          {...register('email', { required: 'Email is required' })}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                          type="text"
                          {...register('country', { required: 'Country is required' })}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800"
                        />
                        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                      </div>

                      {/* Street Address */}
                      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700">Street Address</label>
                        <input
                          type="text"
                          {...register('street', { required: 'Street is required' })}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800"
                        />
                        {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                          type="text"
                          {...register('city', { required: 'City is required' })}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800"
                        />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">State / Province</label>
                        <input
                          type="text"
                          {...register('state', { required: 'State is required' })}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800"
                        />
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                      </div>

                      {/* Postal Code */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                        <input
                          type="text"
                          {...register('pinCode', { required: 'Postal code is required' })}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 outline-none text-gray-800"
                        />
                        {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode.message}</p>}
                      </div>
                    </div>

                    <div className="flex justify-end mt-8">
                      <button
                        type="submit"
                        className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                      >
                        Add Address
                      </button>
                    </div>
                  </div>
                </form>

              ) : null}

              <p className="mt-4 text-lg font-semibold">Your Addresses:</p>

              {
                userInfo?.address && userInfo.address.length > 0 ? (
                  userInfo.address.map((address, index) => {
                    return (
                      <div key={index}>
                        {selectedEditIndex === index ? (
                          <form
                            className="bg-white shadow-md rounded-xl px-6 py-8"
                            noValidate
                            onSubmit={handleSubmit((data) => {
                              handleEdit(data, index);
                              reset();
                            })}
                          >
                            <h2 className="text-xl font-bold text-gray-800 mb-2">Edit Address</h2>
                            <p className="text-sm text-gray-500 mb-6">Use a permanent address where you can receive mail.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                  {...register('name', { required: 'Name is required' })}
                                  className="mt-1 w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                  type="email"
                                  {...register('email', { required: 'Email is required' })}
                                  className="mt-1 p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Country</label>
                                <input
                                  {...register('country', { required: 'Country is required' })}
                                  className="mt-1 w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">State / Province</label>
                                <input
                                  {...register('state', { required: 'State is required' })}
                                  className="mt-1 p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input
                                  {...register('city', { required: 'City is required' })}
                                  className="mt-1 w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                                <input
                                  {...register('pinCode', { required: 'PIN Code is required' })}
                                  className="mt-1 w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode.message}</p>}
                              </div>

                              <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-700">Street Address</label>
                                <input
                                  {...register('street', { required: 'Street is required' })}
                                  className="mt-1 w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                                {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}
                              </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-4">
                              <button
                                type="button"
                                onClick={() => setSelectedEditIndex(-1)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
                              >
                                Save Changes
                              </button>
                            </div>
                          </form>
                        ) : null}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-md rounded-xl px-6 py-4 mt-5">
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">{address.name}</h3>
                            <p className="text-sm text-gray-600">{address.street}</p>
                            <p className="text-sm text-gray-600">{address.city}, {address.state}, {address.pinCode}</p>
                            <p className="text-sm text-gray-600">{address.country}</p>
                          </div>

                          <div className="flex gap-4 mt-4 sm:mt-0">
                            <button
                              onClick={() => handleEditForm(index)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => handleRemove(e, index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )

                  })
                )
                  : ''
              }


            </div>
          </div>
        </div>
      </Protected>

    </Layout>
  );
}