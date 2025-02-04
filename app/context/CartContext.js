import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        calculateSubTotal(parsedCart);
      }
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
      localStorage.removeItem('cart'); 
    }
  }, []);

  const saveCart = (newCart) => {
    try {
      localStorage.setItem('cart', JSON.stringify(newCart));
      calculateSubTotal(newCart);
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  };

  const calculateSubTotal = (cart) => {
    const total = Object.values(cart).reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    setSubTotal(total);
  };

  const addToCart = (id, name, quantity, price, size, color) => {
    const newCart = { ...cart };
    if (newCart[id]) {
      newCart[id].quantity += quantity;
    } else {
      newCart[id] = { name, quantity, price, size, color };
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (id) => {
    const newCart = { ...cart };
    if (newCart[id]) {
      if (newCart[id].quantity > 1) {
        newCart[id].quantity--;
      } else {
        delete newCart[id]; 
      }
      setCart(newCart);
      saveCart(newCart);
    }
  };

  const clearCart = () => {
    setCart({});
    setSubTotal(0);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{ cart, subTotal, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);