import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      _id?: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      credits: number;
      username: string;
      password: string;
      profileImage: string;
      isVerified: boolean;
      addresses: [
        {
          area: string;
          address_line: string;
          city: string;
          state: string;
          _id: string;
          address_name: string;
        },
      ];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    _id?: string;
  }
}

export type Order = {
  _id: string;
  userId: string;
  title: string;
  category: string;
  description: string;
  noOfReviews: number;
  totalPayment: number;
  products: {
    id: string;
    title: string;
    color: string;
    image: string;
    qty: number;
    price: number;
    discount: number;
    _id: string;
  }[];
  address: {
    address_line: string;
    city: string;
    area: string;
    state: string;
  };
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  deliveryDate: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  payment: string;
};
export type Refer = {
  _id: string;
  username: string;
  credits: number;
  createdAt: string;
  status: string;
};

export type Review = {
  _id: string;
  email: string;
  name: string;
  createdAt: string;
  avatar: string;
  images: string[];
  rating: number;
  comment: string;
};
export type Product = {
  _id: string;
  title: string;
  category: string;
  subCategory: string;
  description: string;
  noOfReviews: number;
  rating: number;
  freeDelivery:boolean;
  discount: number;
  createdAt: string;
  variants: Variant[];
  reviews: Review[];
  images: string[];
  slug: string;
  price: number;
};
export type Variant = {
  color: string;
  stock: number;
  image: string;
  price: number;
  discount: number;
  _id: string;
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
