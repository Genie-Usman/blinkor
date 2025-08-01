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
  },[]);

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

  const generateCartKey = (id, size, color) => `${id}_${size}_${color}`;

  const addToCart = (id, name, quantity, price, size, color, variants = []) => {
    const key = `${id}_${size}_${color}`
    const selectedVariant = Array.isArray(variants) 
      ? variants.find(variant => variant.size === size && variant.color === color) 
      : null;
    
    const variantImage = selectedVariant ? selectedVariant.image : ""
  
    setCart((prevCart) => {
      const newCart = { ...prevCart }
  
      if (newCart[key]) {
        newCart[key] = {
          ...newCart[key],
          quantity: newCart[key].quantity + quantity,
        };
      } else {
        newCart[key] = {
          id,
          name,
          quantity,
          price,
          size,
          color,
          image: variantImage,
        }
      }
  
      saveCart(newCart)
      return newCart
    })
  }

  const buyNow = async (id, name, quantity, price, size, color, variants = []) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const key = generateCartKey(id, size, color)
    const selectedVariant = Array.isArray(variants) 
    ? variants.find(variant => variant.size === size && variant.color === color) 
    : null;
  
  const variantImage = selectedVariant ? selectedVariant.image : ""
    setCart(() => {
      const newCart = {};
      newCart[key] = { id, name, quantity, price, size, color, image: variantImage }

      saveCart(newCart);
      return newCart;
    });
  }

  const removeFromCart = (id, size, color) => {
    const key = generateCartKey(id, size, color);
    setCart((prevCart) => {
      const newCart = { ...prevCart };

      if (newCart[key]) {
        if (newCart[key].quantity > 1) {
          newCart[key] = { ...newCart[key], quantity: newCart[key].quantity - 1 };
        } else {
          delete newCart[key];
        }

        saveCart(newCart);
      }

      return newCart;
    });
  };


  const clearCart = () => {
    setCart({});
    setSubTotal(0);
    localStorage.removeItem('cart');
  };

  const itemCount = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0); 

  return (
    <CartContext.Provider value={{ cart, subTotal, addToCart, removeFromCart, clearCart, buyNow, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
