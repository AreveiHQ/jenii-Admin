// src/app/upload-category/page.js
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const CategorySchema = Yup.object().shape({
  name: Yup.string().required('Category name is required'),
  parentCategory: Yup.string().required('Parent category is required'),
  image: Yup.mixed().required('Image is required'),
  bannerImages: Yup.mixed().required('At least one banner image is required'),
});

export default function UploadCategory() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(CategorySchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('parentCategory', data.parentCategory);
    formData.append('image', data.image[0]);
    Array.from(data.bannerImages).forEach((file) => {
      formData.append('bannerImages', file);
    });

    try {
      const response = await axios.post('/api/categories', formData);
      if (response.status === 200) {
        alert('Category is added successfully!');
        // router.push('/'); // Redirect to homepage or wherever necessary
      } else {
        alert(response.data.message || 'Error occurred');
      }
    } catch (error) {
      console.error('Error uploading category:', error);
      alert('Server error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Upload New Category</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Category Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Parent Category</label>
          <input
            type="text"
            {...register('parentCategory')}
            className="w-full px-3 py-2 border rounded-md"
          />
          {errors.parentCategory && <p className="text-red-500 text-sm">{errors.parentCategory.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            {...register('image')}
            className="w-full px-3 py-2 border rounded-md"
            accept="image/*"
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Banner Images</label>
          <input
            type="file"
            {...register('bannerImages')}
            className="w-full px-3 py-2 border rounded-md"
            accept="image/*"
            multiple
          />
          {errors.bannerImages && <p className="text-red-500 text-sm">{errors.bannerImages.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md"
        >
          {isSubmitting ? 'Uploading...' : 'Upload Category'}
        </button>
      </form>
    </div>
  );
}
