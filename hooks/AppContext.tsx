"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AppContext = createContext({
  cartItems: [],
  addToCart: (product: object) => {},
  loadCart: () => {},
  incrementQty: (productId: string) => {},
  decrementQty: (productId: string) => {},
  removeFromCart: (productId: string) => {},
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartItems, setCartItems] = useState([]);
  const addToCart = (product: object) => {
    let items = localStorage.getItem("sjsmartz-cart-items")
      ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
      : [];
    const { title, color, image, qty, discount, price, stock, _id } =
      product as any;

    for (let index = 0; index < items.length; index++) {
      if (items[index]._id === _id) {
        items[index].qty++;
        return toast.success("Quantity Updated");
      }
    }

    items.push({ id: title, title, color, image, qty, discount, price, _id });

    toast.success("Item added to cart");
    localStorage.setItem("sjsmartz-cart-items", JSON.stringify(items));
    setCartItems(items);
  };
  const loadCart = () => {
    let items = localStorage.getItem("sjsmartz-cart-items")
      ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
      : [];
    setCartItems(items);
  };
  const incrementQty = (productId: string) => {
    let items = localStorage.getItem("sjsmartz-cart-items")
      ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
      : [];
    items.map((item: any) => {
      if (item.id === productId) item.qty++;
    });
    localStorage.setItem("sjsmartz-cart-items", JSON.stringify(items));
    setCartItems(items);
  };
  const removeFromCart = (productId: string) => {
    let items = localStorage.getItem("sjsmartz-cart-items")
      ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
      : [];
    const newItems = items.filter((item: any) => item.id !== productId);
    localStorage.setItem("sjsmartz-cart-items", JSON.stringify(newItems));
    setCartItems(newItems);
  };
  const decrementQty = (productId: string) => {
    let items = localStorage.getItem("sjsmartz-cart-items")
      ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
      : [];
    items.map((item: any) => {
      if (item.id === productId && item.qty > 1) item.qty--;
    });
    localStorage.setItem("sjsmartz-cart-items", JSON.stringify(items));
    setCartItems(items);
  };
  useEffect(() => {
    loadCart();
  }, []);
  return (
    <AppContext.Provider
      value={{
        addToCart,
        cartItems,
        loadCart,
        incrementQty,
        decrementQty,
        removeFromCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};
export default AppContextProvider;
