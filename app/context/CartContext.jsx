"use client"; 

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Calculate total amount whenever items change
  useEffect(() => {
    const amount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    setTotalAmount(amount);
  }, [items]);

  // Method to add an item to the cart
  const addItem = (item) => {
    setItems(prevItems => [...prevItems, { ...item, quantity: 1 }]);
  };

  // Method to remove an item from the cart
  const removeItem = (itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Method to clear the cart
  const clearCart = () => {
    setItems([]);
  };

  // Method to get total amount
  const getTotalAmount = () => {
    return totalAmount;
  };

  // Method to increase product quantity
  const increaseQuantity = (itemId) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Method to decrease product quantity
  const decreaseQuantity = (itemId) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      );
      return updatedItems.filter(item => item.quantity > 0);  // Remove items with quantity <= 0
    });
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalAmount, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
