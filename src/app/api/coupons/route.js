import { connectToDB } from "@/db";
import Coupon from "@/models/couponModel";

export async function POST(req) {
  await connectToDB();
  const { code, discountType, discountValue, validUntil, minimumOrderValue, usageLimit } =
    await req.json();

  try {
    const newCoupon = new Coupon({
      code,
      discountType,
      discountValue,
      validUntil,
      minimumOrderValue,
      usageLimit,
    });
    await newCoupon.save();
    return new Response(JSON.stringify(newCoupon), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create coupon",error }), { status: 400 });
  }
}

export async function PATCH(req) {
  await connectToDB();
  const { code } = await req.json();

  try {
    const coupon = await Coupon.findOne({ code });
    if (!coupon || coupon.usedCount >= coupon.usageLimit) {
      return new Response(JSON.stringify({ error: "Invalid or expired coupon" }), { status: 400 });
    }

    coupon.usedCount += 1;
    await coupon.save();
    return new Response(JSON.stringify(coupon), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update coupon" }), { status: 400 });
  }
}
