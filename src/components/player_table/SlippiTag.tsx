import React from "react";
import { TableCell } from "../ui/table";

type SlippiTagProps = {
  tag: string | null;
};

const SlippiTag = ({ tag }: SlippiTagProps) => {
  return <TableCell className="font-medium">{tag}</TableCell>;
};

export default SlippiTag;
