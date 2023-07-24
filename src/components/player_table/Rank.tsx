import React from "react";
import { TableCell } from "../ui/table";

type RankProps = {
  rank: number | null;
};

const Rank = ({ rank }: RankProps) => {
  return <TableCell className="font-medium">{rank}</TableCell>;
};

export default Rank;
