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
        const desktopbanner = formData.get("desktopbanner");
        const mobilebanner = formData.get("mobilebanner");
        if ( desktopbanner?.type.startsWith("/image") && mobilebanner?.type.startsWith("/image")) {
            return NextResponse.json({ message: "Invalid image type" }, { status: 400 });
        }
        if ( !links && !section) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const desktopBuffer = Buffer.from(await desktopbanner.arrayBuffer()); // Convert file to Buffer
        const uploadedDesktopImage = await uploadToCloudinary(desktopBuffer, '/slides'); // Upload to Cloudinary
        const mobileBuffer = Buffer.from(await mobilebanner.arrayBuffer()); // Convert file to Buffer
        const uploadedMoblieImage = await uploadToCloudinary(mobileBuffer, '/slides'); // Upload to Cloudinary
        const home = await Home.create({ desktopBannerImage: uploadedDesktopImage.secure_url,mobileBannerImage: uploadedMoblieImage.secure_url, links, section });

        if (!home) {
            return NextResponse.json({ message: "Slide not added" }, { status: 500 });
        }

        return NextResponse.json({ message: "Slide added successfully", home }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: err.message,error:err }, { status: 500 });
    }
}
