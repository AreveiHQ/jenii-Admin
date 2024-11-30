import { NextResponse } from 'next/server';
import Product, { OfflineProduct } from '@/models/productModel';
import { uploadToCloudinary } from '@/utils/cloudinary';
import Category from '@/models/category';
import { connectToDB } from '@/db';

function calculatedDiscount(price, discountedPrice) {
  const discount = ((price - discountedPrice) / price) * 100;
  return Math.ceil(discount);
}

// Get all products
export async function GET() {
  await connectToDB();
  try {
    const products = await Product.find();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Add a new product
export async function POST(request) {
  await connectToDB();
  try {
    const formData = await request.formData();
    const imageFiles = formData.getAll('images'); // Assumes the key for images is 'images'
    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const discountPrice = formData.get('discountPrice');
    const category = formData.get('category');
    const subCategory = formData.get('subCategory');
    const collection = formData.get('collection');
    const metal = formData.get('metal');
    const stock = formData.get('stock');
    const mode = formData.get('mode');
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

    if (!imageFiles.length || !name || !price || !category || !subCategory) {
      return NextResponse.json({ message: 'Please fill required fields' }, { status: 400 });
    }

    const isExist = await Category.findOne({ name: subCategory, parentCategory: category });
    if (!isExist) {
      return NextResponse.json({ message: 'Invalid Category' }, { status: 403 });
    }
    if (price <= 0 || discountPrice < 0) {
      return NextResponse.json({ message: 'Invalid price or discounted price values' }, { status: 403 });
    }

    // Upload all image files to Cloudinary
    const uploadPromises = imageFiles.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer()); // Convert file to Buffer
      return uploadToCloudinary(buffer, '/product'); // Use the function to upload the Buffer
    });

    const results = await Promise.all(uploadPromises);
    const images = results.map((result) => result.secure_url);

    // Now create and save the product in the database
    const discountPercent = calculatedDiscount(price, discountPrice);

    if (mode && mode === "offline") {
      const product = new OfflineProduct({
        images,
        name,
        description,
        price,
        discountPrice,
        discountPercent,
        category: { name: subCategory, id: isExist._id },
        collection,
        metal,
        stock,
        slug
      });

      const newProduct = await product.save();
      return NextResponse.json(newProduct, { status: 201 });
    } else {
      const product = new Product({
        images,
        name,
        description,
        price,
        discountPrice,
        discountPercent,
        category: { name: subCategory, id: isExist._id },
        collection,
        metal,
        stock,
        slug
      });

      const newProduct = await product.save();
      return NextResponse.json(newProduct, { status: 201 });
    }
  } catch (error) {
    console.error('Error uploading product:', error);
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}


