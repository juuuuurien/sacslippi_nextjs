import React, { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Player } from "@prisma/client";
import { Button } from "../ui/button";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import Spinner from "../global/Spinner";
import Rating from "./Rating";
import SlippiTag from "./SlippiTag";
import Rank from "./Rank";
const NEXT_PUBLIC_PUSHER_APP_KEY = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;

const PlayerTable = () => {
  const queryClient = useQueryClient();
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  const [countup, setCountup] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isLoading, isFetching, isRefetching, data } = useQuery({
    queryKey: ["playerData"],
    queryFn: async () => {
      const data = await (await fetch(`/api/players`)).json();
      return data;
    },
  });

  const easeInOutQuad = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const handleCountup = (to: number, from: number, duration: number) => {
    if (countup !== from) {
      setCountup(from);
    }
    // Calculate the total count to increase.
    const totalCount = to - from;

    // Start time
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      let progress = Math.min(elapsedTime / duration, 1);

      // Apply the easing function
      progress = easeInOutQuad(progress);

      setCountup((prev) => {
        const newValue = Math.floor(from + progress * totalCount);

        if (newValue >= to) {
          clearInterval(interval);
          return to;
        }

        return newValue;
      });
    }, 16); // ~60fps
  };

  useEffect(() => {
    // Setup Pusher
    if (!NEXT_PUBLIC_PUSHER_APP_KEY) {
      alert("NEXT_PUBLIC_PUSHER_APP_KEY not set");
      return;
    }
    const pusher = new Pusher(NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: "us3",
    });

    let channel = pusher.subscribe("sync-player-data");
    channel.bind("sync-event", function (data: any) {
      console.log("Sync event detected... ", data);
      if (data.message === "Ending sync...") {
        setIsSyncing(false);
        queryClient.invalidateQueries(["playerData"]);
      }

      if (data.message === "Starting sync...") {
        setIsSyncing(true);
      }
    });
  }, [queryClient]);

  return (
    <div className="w-full min-h-full py-20 lg:max-w-4xl">
      {/* 
        TODO: 
            x Move each data cell into it's own component. Maybe animate numbers going up or something?
            x Install that animation library to animate on data change. Animate icons after moving rows?
            - Implement cron and pusher event.
            - Implement Unranked and Doing Placements rank logic. (Maybe just unranked.)
            - Actually design something in Figma lol.
            - Import assets (icons and portraits)
      */}
      <div className="flex flex-row w-full justify-between">
        <Button
          onClick={async () => {
            queryClient.invalidateQueries(["playerData"]).then(() => {
              alert("Invalidated");
            });
          }}
          size="sm"
        >
          <UpdateIcon className="mr-2" /> Test Query Invalidation
        </Button>
        <Button onClick={() => handleCountup(122, 0, 2000)} size="sm">
          <UpdateIcon className="mr-2" /> {`Countup ${countup ? countup : 0}`}{" "}
        </Button>
        <Button
          onClick={async () => {
            await (await fetch("/api/cron")).json();
          }}
          size="sm"
        >
          <UpdateIcon className="mr-2" /> Test Pusher
        </Button>
        <div>{`Countup Test - ${countup}`}</div>
        {isSyncing && (
          <div>
            <span>Syncing in progress...</span>
          </div>
        )}
      </div>
      {isLoading ? (
        <Spinner className={"fill-slate-600"} />
      ) : (
        data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>Player Tag</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody ref={parent}>
              {data.data.map((player: Player) => (
                <TableRow key={player.connectCode}>
                  <Rank rank={player.currentRank} />
                  <SlippiTag tag={player.slippiTag} />
                  <Rating
                    rating={player.currentRating}
                    pastRating={player.pastRating}
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}
    </div>
  );
};

export default PlayerTable;
