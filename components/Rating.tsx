import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Rating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - (fullStars + hasHalfStar); // Ensure no negative values
  let stars = [];
  stars = hasHalfStar
    ? [
        ...Array(fullStars).fill(<FaStar className="text-yellow-500" />),
        <FaStarHalfAlt key={8} className="text-yellow-500" />,
        ...Array(emptyStars).fill(<FaRegStar className="text-yellow-500" />),
      ]
    : [
        ...Array(fullStars).fill(<FaStar className="text-yellow-500" />),
        ...Array(emptyStars).fill(<FaRegStar className="text-yellow-500" />),
      ];

  return <div className="flex space-x-1">{stars}</div>;
};

export default Rating;
