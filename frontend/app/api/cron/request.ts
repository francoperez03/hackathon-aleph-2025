import { NextResponse } from "next/server";

export default async function handler() {
  try {
    

    return NextResponse.json({
      data: "ok",
    });
  } catch (error: any) {
    console.log({ error });

    return NextResponse.json({
      error: error.message,
    });
  }
}
