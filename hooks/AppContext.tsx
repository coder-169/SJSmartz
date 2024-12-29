"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const AppContext = createContext({
  cartItems: [],
  addToCart: (product: { qty: number }) => { },
  loadCart: () => { },
  incrementQty: (productId: string) => { },
  decrementQty: (productId: string) => { },
  removeFromCart: (productId: string) => { },
  checkCartSelectedItems: () => { },
  calculateSubtotal: (items: { price: number, qty: number, check: boolean, discount: number, freeDelivery: boolean }[]) => { },
  subTotal: 0,
  total: 0,
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const calculateSubtotal = (items: { price: number, qty: number, check: boolean, discount: number, freeDelivery: boolean }[]) => {
    if (items) {
      let val = 0;
      let val2 = 0;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.check) {
          val += Math.round(item.price - (item.discount / 100 * item.price)) * item.qty;
          if (!item.freeDelivery)
            val2 += Math.round(item.price - (item.discount / 100 * item.price)) * item.qty + item.qty * 200;
        }
      }
      setSubtotal(val);
      setTotal(val2);
    } else {
      const cartItems = localStorage.getItem("sjsmartz-cart-items")
        ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
        : [];
      let val = 0;
      let val2 = 0;
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];
        if (item.check) {
          val += Math.round(item.price - (item.discount / 100 * item.price)) * item.qty;
          if (item.freeDelivery) {
            val2 += Math.round(item.price - (item.discount / 100 * item.price)) * item.qty ;

          } else {
            val2 += Math.round(item.price - (item.discount / 100 * item.price)) * item.qty + item.qty * 200;

          }
        }
      }
      setSubtotal(val);
      setTotal(val2);
    }

  };
  const addToCart = (product: { qty: number }) => {
    let items = localStorage.getItem("sjsmartz-cart-items")
      ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
      : [];

    const { title, color, image, qty, discount, price, stock, _id, freeDelivery } =
      product as any;
      if(stock === 0)
        return toast.error("Out of stock");
    for (let index = 0; index < items.length; index++) {
      if (items[index]._id === _id) {
        if (items[index].qty > 5)
          return toast.error("You can only order 5 items at a time");
        if (product.qty + items[index].qty > 5)
          return toast.error("You can only order 5 items at a time");
        items[index].qty += product.qty;
        localStorage.setItem("sjsmartz-cart-items", JSON.stringify(items));
        return toast.success("Quantity Updated");
      }
    }

    items.push({ title, color, image, qty, discount, price, _id, check: true, freeDelivery });

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
  const checkCartSelectedItems = () => {
    let items = localStorage.getItem("sjsmartz-cart-items")
      ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
      : [];
    const newItems = items.filter((item: { check: boolean }) => item.check)
    return newItems
  };
  const incrementQty = (productId: string) => {
    let items = localStorage.getItem("sjsmartz-cart-items")
      ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
      : [];
    items.map((item: any) => {
      if (item.qty >= 5) return;
      if (item._id === productId) item.qty++;
    });
    localStorage.setItem("sjsmartz-cart-items", JSON.stringify(items));
    setCartItems(items);
  };
  const removeFromCart = (productId: string) => {
    let items = localStorage.getItem("sjsmartz-cart-items")
      ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
      : [];
    const newItems = items.filter((item: any) => item._id !== productId);
    localStorage.setItem("sjsmartz-cart-items", JSON.stringify(newItems));
    setCartItems(newItems);
  };
  const decrementQty = (productId: string) => {
    let items = localStorage.getItem("sjsmartz-cart-items")
      ? JSON.parse(localStorage.getItem("sjsmartz-cart-items")!)
      : [];
    items.map((item: any) => {
      if (item._id === productId && item.qty > 1) item.qty--;
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
        checkCartSelectedItems, calculateSubtotal, subTotal, total
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
