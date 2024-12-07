import React from "react";
import ImagesGallery from "./ImagesGallery";
import Product from "@/models/Product";
import { Review } from "@/types/product";
import Image from "next/image";
import { formattedDate } from "@/lib/utils";
import { FaUser } from "react-icons/fa6";

// Dummy data for reviews
// const reviews = [
//   {
//     id: 1,
//     name: "John Doe",
//     date: "November 25, 2024",
//     rating: 5,
//     review: "This product is amazing! Exceeded all my expectations.",
//     image:
//       "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/bb72005305afd9613c91351437429384-1617962329634/29093727-5750-41bf-899c-7e5ea650850f.jpg",
//     images: [
//       "https://res.cloudinary.com/dk7lbaz1v/image/upload/v1732378864/image_wtaowf.jpg",
//       "https://res.cloudinary.com/dk7lbaz1v/image/upload/v1732378865/image_mw7bz8.jpg",
//       "https://res.cloudinary.com/dk7lbaz1v/image/upload/v1732378865/image_ficg2p.jpg",
//     ],
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     date: "November 22, 2024",
//     rating: 4,
//     review: "Good quality, but the delivery was a bit delayed.",
//     image:
//       "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/bb72005305afd9613c91351437429384-1617962329634/29093727-5750-41bf-899c-7e5ea650850f.jpg",
//     images: [],
//   },
//   {
//     id: 3,
//     name: "Mark Lee",
//     date: "November 20, 2024",
//     rating: 5,
//     review: "Absolutely love it! Would definitely recommend.",
//     image:
//       "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto,t_profile_small/v1/attachments/profile/photo/bb72005305afd9613c91351437429384-1617962329634/29093727-5750-41bf-899c-7e5ea650850f.jpg",
//     images: [],
//   },
// ];

// Reusable star rating component
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${i < rating ? "text-yellow-500" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ))}
  </div>
);

// Main Review Section Component
const ReviewSection = ({ reviews, rating }: { reviews?: Review[]; rating: number }) => {
  return (
    <div className="space-y-12 bg-gray-50 px-4 py-12">
      {/* Style 1: Classic Card Style */}

      {/* Style 2: Minimal List Style */}
      <h2 className="mb-4 text-2xl font-bold">Reviews</h2>
      <section>
        <div className="mx-auto flex w-3/4 items-center justify-center gap-8 py-12">
          <div className="text-yellow-500">
            <h3 className="flex gap-1 text-8xl font-bold ">
              {rating}/<span className="">5</span>
            </h3>
            <span className="text-sm text-gray-400 ">
              ({reviews?.length}) Reviews
            </span>
          </div>
          {/* <div className="ml-4 w-2/3 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-xs">50</span>
              <StarRating rating={5} />
              <div className="relative h-2 w-1/4 rounded-sm bg-gray-200 before:absolute before:left-0 before:top-0 before:h-full before:w-[55%] before:rounded-sm  before:bg-yellow-500"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-xs">50</span>
              <StarRating rating={4} />
              <div className="relative h-2 w-1/4 rounded-sm bg-gray-200 before:absolute before:left-0 before:top-0 before:h-full before:w-[45%] before:rounded-sm  before:bg-yellow-500"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-xs">50</span>
              <StarRating rating={3} />
              <div className="relative h-2 w-1/4 rounded-sm bg-gray-200 before:absolute before:left-0 before:top-0 before:h-full before:w-[75%] before:rounded-sm  before:bg-yellow-500"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-xs">50</span>
              <StarRating rating={2} />
              <div className="relative h-2 w-1/4 rounded-sm bg-gray-200 before:absolute before:left-0 before:top-0 before:h-full before:w-[85%] before:rounded-sm  before:bg-yellow-500"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-xs">50</span>
              <StarRating rating={1} />
              <div className="relative h-2 w-1/4 rounded-sm bg-gray-200 before:absolute before:left-0 before:top-0 before:h-full before:w-[37%] before:rounded-sm  before:bg-yellow-500"></div>
            </div>
          </div> */}
        </div>
        <ul className="space-y-4">
          {reviews?.map((review) => (
            <li
              key={review._id}
              className="flex w-full items-start justify-between space-x-4 rounded-lg border bg-white p-4"
            >
              <div className="flex items-center gap-4">
                {(!review.avatar || review.avatar === '') ? <FaUser size={36} /> :
                  <Image
                    width={36}
                    height={36}
                    src={review.avatar}
                    alt={`${review.name} Review`}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                }
                <div>
                  <StarRating rating={rating} />
                  <p className="mt-1 text-gray-600">{review.comment}</p>
                  <p className="mt-2 text-sm font-semibold">{review.name}</p>
                  <p className="text-xs text-gray-500">{formattedDate(review.createdAt)}</p>
                </div>
              </div>
              {review.images.length > 0 && <div className="">
                <ImagesGallery images={review.images} />
              </div>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ReviewSection;
