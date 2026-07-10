import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/foodService";
import {
  addToCart,
  getCartData,
  removeQtyFromCart,
  clearCartItems,
} from "../service/cartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [foodLoading, setFoodLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");

  const increaseQty = async (foodId) => {
    setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
    await addToCart(foodId, token);
  };

  const decreaseQty = async (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0,
    }));
    await removeQtyFromCart(foodId, token);
  };

  const removeFromCart = async (foodId) => {
    // Remove all qty one by one via the backend so cart stays in sync on refresh
    const qty = quantities[foodId] || 0;
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[foodId];
      return updated;
    });
    for (let i = 0; i < qty; i++) {
      await removeQtyFromCart(foodId, token);
    }
  };

  const loadCartData = async (token) => {
    const items = await getCartData(token);
    if (items) setQuantities(items);
  };

  const contextValue = {
    foodList,
    foodLoading,
    increaseQty,
    decreaseQty,
    quantities,
    removeFromCart,
    token,
    setToken,
    setQuantities,
    loadCartData,
  };

  useEffect(() => {
    async function loadData() {
      try {
        setFoodLoading(true);
        const data = await fetchFoodList();
        setFoodList(data);
      } catch (error) {
        console.error("Failed to load food list:", error);
      } finally {
        setFoodLoading(false);
      }

      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
