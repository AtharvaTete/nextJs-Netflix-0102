import connectToDB from "@/db";
import Favorites from "@/models/favorite";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("id");
    const accountID = searchParams.get("accountID");

    const getAllFavorites = await Favorites.find({ uid, accountID });

    if (getAllFavorites) {
      return NextResponse.json({
        success: true,
        data: getAllFavorites,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
