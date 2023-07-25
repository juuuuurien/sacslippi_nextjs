export const dynamic = "force-dynamic";
import { prisma } from "@/services/prisma";
import { pusher } from "@/services/pusher";
import { SlippiPlayerData, getSlippiPlayerData } from "@/services/slippi";
import { connect } from "http2";
import { NextResponse } from "next/server";

async function handlePlayerUpdate(slippiData: SlippiPlayerData) {
  try {
    const { displayName } = slippiData.getConnectCode.user;
    const { code: connectCode } = slippiData.getConnectCode.user.connectCode;
    const {
      ratingOrdinal,
      wins,
      losses,
      dailyGlobalPlacement,
      dailyRegionalPlacement,
      characters,
    } = slippiData.getConnectCode.user.rankedNetplayProfile;

    console.log("Updating player...");
    const player = await prisma.player.findUnique({
      where: {
        connectCode: connectCode,
      },
    });

    if (!player) {
      console.warn("Didn't find player, " + connectCode);
      return;
    }

    const updatedPlayer = await prisma.player.update({
      where: {
        id: player?.id,
      },
      data: {
        slippiTag: displayName,
        wins: wins,
        losses: losses,
        currentRating: parseFloat(ratingOrdinal),
        dailyGlobalPlacement: dailyGlobalPlacement,
        dailyRegionalPlacement: dailyRegionalPlacement,
      },
    });
    console.log("Done.");

    console.log("Updating Characters...");
    // Update gamecounts for player's characters.
    for await (let char of characters) {
      const existingChar = await prisma.character.findUnique({
        where: {
          name: char.character,
        },
      });

      const charOnPlayer = await prisma.charactersOnPlayers.findFirst({
        where: {
          playerId: player.id,
          characterId: existingChar?.id,
        },
      });

      if (char.gameCount === charOnPlayer?.gameCount) {
        console.log(`Skipping ${char}`);
        continue;
      }

      if (charOnPlayer) {
        await prisma.charactersOnPlayers.update({
          where: {
            id: charOnPlayer.id,
          },
          data: {
            gameCount: char.gameCount,
          },
        });
      } else {
        await prisma.charactersOnPlayers.create({
          data: {
            playerId: player.id,
            characterId: char.id,
            gameCount: char.gameCount,
          },
        });
      }
    }

    console.log("Done.");
  } catch (err) {
    console.error("Error updating player, --- ", err);
  }
}

async function syncMeUpDaddy() {
  console.log("Retrieving Codes");
  const connectCodes = Array.from(await prisma.player.findMany({})).map((c) => {
    return c.connectCode;
  });

  const promises: Promise<SlippiPlayerData | null>[] = [];

  for (let cc of connectCodes) {
    if (!cc) return;
    promises.push(getSlippiPlayerData(cc));
  }

  let slippiDataArray = await Promise.all(promises);

  console.log("Done.");

  let playerPromises = [];
  for (let slippiData of slippiDataArray) {
    if (!slippiData) continue;
    playerPromises.push(handlePlayerUpdate(slippiData));
  }
  await Promise.all(playerPromises);

  // Now Update ranks...
  console.log("Updating ranks...");

  const updatedPlayers = await prisma.player.findMany({
    orderBy: {
      currentRating: "desc",
    },
  });

  console.log("Done. Finished.");

  for await (let [i, updPlayer] of updatedPlayers.entries()) {
    await prisma.player.update({
      where: { id: updPlayer.id },
      data: {
        currentRank: i + 1,
      },
    });
  }

  return;
}

export async function GET() {
  pusher.trigger("sync-player-data", "sync-event", {
    message: "Starting sync...",
  });

  await syncMeUpDaddy();

  pusher.trigger("sync-player-data", "sync-event", {
    message: "Ending sync...",
  });

  return NextResponse.json({
    status: 200,
    error: false,
    data: { status: 200, message: "Successfully synced data." },
    message: "Successfully synced data.",
  });
}
