import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.player.findMany({
      orderBy: [{ currentRank: "asc" }],
    });

    return NextResponse.json({
      status: 200,
      error: false,
      data: data,
      message: "Successfully retrieved player data.",
    });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      error: true,
      data: null,
      message: "Error retrieving player data. " + e,
    });
  }
}
