'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';

const CouponSchema = Yup.object().shape({
  code: Yup.string().required('Coupon code is required'),
  discountType: Yup.string().required('Select a discount type'),
  value: Yup.number().positive().required('Enter a discount value'),
  discountValue: Yup.number().positive().optional(),
  minOrderValue: Yup.number().positive().optional(),
  validUntil: Yup.string().required('Select a validity period'),
});

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(CouponSchema),
  });
  const calculateExpiryDate = (validUntil) => {
        const currentDate = new Date();
        if (validUntil === '1day') {
          return new Date(currentDate.setDate(currentDate.getDate() + 1));
        } else if (validUntil === '1week') {
          return new Date(currentDate.setDate(currentDate.getDate() + 7));
        } else if (validUntil === '1month') {
          return new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        }
        return currentDate;
      };

  const onSubmit = async (data) => {
        const validUntil = calculateExpiryDate(data.validUntil);
    try {
      const response = await axios.post('/api/coupons',{ ...data, validUntil });
      setCoupons((prev) => [...prev, response.data]);
      reset();
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Create a Coupon</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Coupon Code</label>
          <input
            {...register('code')}
            className="w-full p-2 border rounded"
            placeholder="E.g., FLAT40"
          />
          <p className="text-red-500 text-sm">{errors.code?.message}</p>
        </div>
        <div>
          <label className="block font-medium">Discount Type</label>
          <select {...register('discountType')} className="w-full p-2 border rounded">
            <option value="">Select</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Flat</option>
          </select>
          <p className="text-red-500 text-sm">{errors.discountType?.message}</p>
        </div>
        <div>
          <label className="block font-medium">Value</label>
          <input
            {...register('value')}
            type="number"
            className="w-full p-2 border rounded"
            placeholder="E.g., 40 for 40% or 500 for Rs.500"
          />
          <p className="text-red-500 text-sm">{errors.value?.message}</p>
        </div>
        <div>
        <div>
          <label className="block font-medium">Validity Period</label>
          <select {...register('validUntil')} className="w-full p-2 border rounded">
            <option value="">Select</option>
            <option value="1day">1 Day</option>
            <option value="1week">1 Week</option>
            <option value="1month">1 Month</option>
          </select>
          <p className="text-red-500 text-sm">{errors.validUntil?.message}</p>
        </div>
          <label className="block font-medium">Maximum Discount (optional)</label>
          <input
            {...register('maxDiscount')}
            type="number"
            className="w-full p-2 border rounded"
            placeholder="E.g., 200 for Upto Rs.200"
          />
        </div>
        <div>
          <label className="block font-medium">Minimum Order Value (optional)</label>
          <input
            {...register('minOrderValue')}
            type="number"
            className="w-full p-2 border rounded"
            placeholder="E.g., 1000"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Coupon
        </button>
      </form>
      <h2 className="text-xl font-bold mt-6">Existing Coupons</h2>
      <ul className="space-y-2">
        {coupons.map((coupon) => (
          <li key={coupon.id} className="p-4 bg-white shadow rounded">
            <p><strong>Code:</strong> {coupon.code}</p>
            <p><strong>Discount:</strong> {coupon.discountType === 'percentage' ? `${coupon.value}%` : `Rs.${coupon.value}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
