export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { pusher } from "@/services/pusher";

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
  try {
    pusher.trigger("sync-player-data", "sync-event", {
      message: "Starting sync...",
    });
    // Add error handling to the trigger data.

    // From connect codes, pull data from slippi.gg
    // Move all the current data into past data
    // Add any new characters that may have been played.
    // Update ranks.
    // Update changed values.
    await timeout(5000);

    pusher.trigger("sync-player-data", "sync-event", {
      message: "Ending sync...",
    });

    return NextResponse.json({
      status: 200,
      error: false,
      data: { status: 200, message: "Successfully synced data." },
      message: "Successfully synced data.",
    });
  } catch (e) {
    return NextResponse.json({
      status: 500,
      error: true,
      data: null,
      message: "Error syncing data. " + e,
    });
  }
}
