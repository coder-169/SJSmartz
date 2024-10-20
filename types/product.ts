import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      _id?: string;
      addresses: [
        {
          postal_code: string;
          address_line: string;
          city: string;
          state: string;
        },
      ];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    _id?: string;
  }
}

export type Product = {
  _id: string;
  title: string;
  category: string;
  description: string;
  noOfReviews: number;
  rating: number;
  variants: {
    color: string;
    stock: number;
    image: number;
    price: number;
    discount: number;
    _id: string;
  }[];
  images: string[];
  slug: string;
  price:number;
};

export type ProductTabs = {
  additionalInfo: ProductAdditionalInfo;
  reviews: ProductReviews;
};

export type ProductAdditionalInfo = {
  details: ProductDetails;
  specifications: ProductSpecifications;
};

type ProductDetails = string[];

type ProductSpecifications = {
  label: string;
  items: { label: string; value: string }[];
}[];

export type ProductReviews = {
  id: number;
  profile: {
    image: {
      src: string;
      alt: string;
    };
    name: string;
  };
  rating: number;
  comment: string;
}[];
