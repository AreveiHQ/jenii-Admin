// src/app/api/slides/add/route.js
import { connectToDB } from "@/db"
import Home from "@/models/homePageModel";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { NextResponse } from "next/server";


export async function POST(req) {
    await connectToDB();
    try {
        const formData = await req.formData();
        console.log(formData)
        const links = formData.get("links");
        const section = formData.get("section");
        const slideImage = formData.get("slideImage");
        if (!slideImage || !links || !section) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const imageBuffer = Buffer.from(await slideImage.arrayBuffer()); // Convert file to Buffer
        const uploadedImage = await uploadToCloudinary(imageBuffer, '/slides'); // Upload to Cloudinary
        const home = await Home.create({ images: uploadedImage.secure_url, links, section });

        if (!home) {
            return NextResponse.json({ message: "Slide not added" }, { status: 500 });
        }

        return NextResponse.json({ message: "Slide added successfully", home }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: err.message,error:err }, { status: 500 });
    }
}
