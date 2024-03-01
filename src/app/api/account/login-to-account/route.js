import connectToDB from "@/db";
import Account from "@/models/Account";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();

    const { pin, accountId, uid } = await req.json();
    // uid -> id of user login with github
    // accountId -> id of user which create account out of 4

    const getCurrentAccount = await Account.findOne({ _id: accountId, uid });

    if (!getCurrentAccount) {
      return NextResponse.json({
        success: false,
        message: "Account not found",
      });
    }

    const checkPin = await compare(pin, getCurrentAccount.pin);

    if (checkPin) {
      return NextResponse.json({
        success: true,
        message: "Welcome to Netflix",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Incorrect PIN ! , please try again",
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
