export type SlippiPlayerData = {
  getConnectCode: {
    user: {
      displayName: string;
      connectCode: {
        code: string;
      };
      rankedNetplayProfile: {
        id: string;
        ratingOrdinal: string;
        ratingUpdateCount: number;
        wins: number;
        losses: number;
        dailyGlobalPlacement: number;
        dailyRegionalPlacement: number;
        continent: string;
        characters: {
          id: string;
          character: string;
          gameCount: number;
        }[];
      };
    };
  };
};

export async function getSlippiPlayerData(
  cc: string
): Promise<SlippiPlayerData | null> {
  if (!cc) {
    console.error("No connect code provided.");
    return null;
  }

  const slippiQuery = `fragment userProfilePage on User {
        displayName
        connectCode {
            code
            }
        rankedNetplayProfile {
                id
                ratingOrdinal
                ratingUpdateCount
                wins
                losses
                dailyGlobalPlacement
                dailyRegionalPlacement
                continent
                characters {
                        id
                        character
                        gameCount
                    }
            }
    }
    query AccountManagementPageQuery($cc: String!) {
        getConnectCode(code: $cc) {
                user {
                        ...userProfilePage
                    }
            }
    }`;

  const { data } = await (
    await fetch("https://gql-gateway-dot-slippi.uc.r.appspot.com/graphql", {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operationName: "AccountManagementPageQuery",
        query: slippiQuery,
        variables: {
          cc: cc,
        },
      }),
    })
  ).json();

  return data;
}
