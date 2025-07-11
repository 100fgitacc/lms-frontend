import React, { useEffect, useState } from "react";
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti";

function RatingStars({ Review_Count, Star_Size }) {
  const [starCount, SetStarCount] = useState({
    full: 0,
    half: 0,
    empty: 5,
  });

 useEffect(() => {
  console.log("Review_Count:", Review_Count);
  const wholeStars = Math.floor(Review_Count) || 0;
  const hasHalfStar = !Number.isInteger(Review_Count) && Review_Count > wholeStars;

  SetStarCount({
    full: wholeStars,
    half: hasHalfStar ? 1 : 0,
    empty: 5 - wholeStars - (hasHalfStar ? 1 : 0),
  });
}, [Review_Count]);

  return (
    <div className="flex gap-1 text-yellow-100">
      {[...Array(starCount.full)].map((_, i) => (
        <TiStarFullOutline key={`full-${i}`} size={Star_Size || 20} />
      ))}
      {[...Array(starCount.half)].map((_, i) => (
        <TiStarHalfOutline key={`half-${i}`} size={Star_Size || 20} />
      ))}
      {[...Array(starCount.empty)].map((_, i) => (
        <TiStarOutline key={`empty-${i}`} size={Star_Size || 20} />
      ))}
    </div>
  );
}

export default RatingStars;
