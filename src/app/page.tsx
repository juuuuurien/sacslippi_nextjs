"use client";
import PlayerTable from "@/components/player_table/PlayerTable";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Main() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <PlayerTable />
      </main>
    </QueryClientProvider>
  );
}
