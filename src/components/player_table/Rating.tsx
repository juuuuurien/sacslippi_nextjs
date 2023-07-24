import React from "react";
import { TableCell } from "../ui/table";

type RatingProps = {
  rating: number | null;
  pastRating: number | null;
};

const formatRating = (rating: number | null) => {
  return rating ? (Math.round(rating * 100) / 100).toPrecision(6) : 0;
};

// TODO: Put icon if the rating has dropped or rose.
const Rating = ({ rating, pastRating }: RatingProps) => {
  return <TableCell className="text-right">{formatRating(rating)}</TableCell>;
};

export default Rating;
