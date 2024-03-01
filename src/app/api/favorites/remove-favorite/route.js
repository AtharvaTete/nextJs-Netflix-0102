import connectToDB from "@/db";
import Favorites from "@/models/favorite";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("id");
    // const accountID = 

    if (!uid) {
      return NextResponse.json({
        success: false,
        message: "Favorite item ID is required",
      });
    }

    const deleteFavoriteItem = await Favorites.findByIdAndDelete(uid);

    if (deleteFavoriteItem) {
      return NextResponse.json({
        success: true,
        message: "Remove to Favorite",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Something went wrong to delete the account",
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
