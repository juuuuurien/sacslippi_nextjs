export const dynamic = "force-dynamic";
import { prisma } from "@/services/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  // Update player past ratings and past rank daily.

  try {
    const currentPlayers = await prisma.player.findMany({
      orderBy: {
        currentRank: "asc",
      },
    });

    let promises = [];
    for await (let player of currentPlayers) {
      let promise = prisma.player.update({
        where: {
          id: player.id,
        },
        data: {
          pastRank: player.currentRank,
          pastRating: player.currentRating,
        },
      });
      promises.push(promise);
    }

    await Promise.allSettled(promises);
  } catch (err) {
    console.error(err);
  }

  return NextResponse.json({
    status: 200,
    error: false,
    data: { status: 200, message: "Successfully synced daily player data." },
    message: "Successfully synced daily player data.",
  });
}
