import { characterImages } from "@/lib/constants";
import { prisma } from "@/services/prisma";
import { getSlippiPlayerData } from "@/services/slippi";
import { Prisma } from "@prisma/client";

// 1a. Seed Characters.
// 1b. Fetch connect codes from existing db.
// 2. For each connect code, fetch data from slippi.gg.
// 3. Insert current data into db, also populate 'past' data columns.
async function main(): Promise<void> {
  const characterNames = Array.from(characterImages.keys());
  let updateObjects: Prisma.CharacterCreateInput[] = [];
  characterNames.forEach((ch, i) => {
    updateObjects.push({
      id: ch,
      name: ch,
    });
  });

  try {
    await prisma.character.createMany({ data: updateObjects });
    console.log("characters created...");
  } catch (err) {
    console.error(err);
    return;
  }

  try {
    const res = await fetch("https://sacslippi.com/api/players");
    const data = await res.json();
    const currentPlayerMap = new Map();
    const connectCodes = data.map((player: any) => {
      currentPlayerMap.set(player.connect_code, player.player_tag);
    });

    let updatePlayerObjects = [];
    for (let [cc, currPlayerTag] of currentPlayerMap) {
      let playerData = await getSlippiPlayerData(cc);

      if (playerData) {
        const player = await prisma.player.findUnique({
          where: {
            connectCode: cc,
          },
        });

        if (player) {
          continue;
        }

        const { displayName } = playerData.getConnectCode.user;
        const { code: connectCode } =
          playerData.getConnectCode.user.connectCode;
        const {
          ratingOrdinal,
          wins,
          losses,
          dailyGlobalPlacement,
          dailyRegionalPlacement,
          characters,
        } = playerData.getConnectCode.user.rankedNetplayProfile;
        const playerUpdateObj: Prisma.PlayerCreateInput = {
          playerTag: currPlayerTag,
          slippiTag: displayName,
          connectCode: connectCode,
          currentRank: 0,
          pastRank: 0,
          wins: wins,
          losses: losses,
          currentRating: parseFloat(ratingOrdinal),
          pastRating: parseFloat(ratingOrdinal),
          dailyGlobalPlacement: dailyGlobalPlacement,
          dailyRegionalPlacement: dailyRegionalPlacement,
          characters: {
            create: characters.map((c) => {
              return {
                gameCount: c.gameCount,
                character: {
                  connect: {
                    id: c.character,
                  },
                },
              };
            }),
          },
        };
        updatePlayerObjects.push(playerUpdateObj);
      }
    }

    try {
      for (let update of updatePlayerObjects) {
        await prisma.player.create({ data: update });
        console.log(`created ${update.playerTag}`);
      }
    } catch (err) {
      console.error(`Error creating new players, ${err}`);
      return;
    }

    // Then go through each player, and set their rank.
    const newPlayers = await prisma.player.findMany({});
    if (!newPlayers) return;

    const sortedPlayers = newPlayers
      ?.map((player) => ({
        ...player,
        currentRating: player.currentRating ?? null,
      }))
      .sort((a, b) => {
        if (b.currentRating === null && a.currentRating === null) {
          return 0;
        }
        if (a.currentRating === null) {
          return 1;
        }
        if (b.currentRating === null) {
          return -1;
        }
        return b.currentRating - a.currentRating;
      });

    try {
      console.log("Updating current ranks...");
      for (let [index, update] of sortedPlayers.entries()) {
        await prisma.player.update({
          where: {
            connectCode: update?.connectCode ?? undefined,
          },
          data: {
            currentRank: index + 1,
            pastRank: index + 1,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  } catch (err) {
    return console.error(err);
  }

  console.log("Finished seed!");
}

main();
