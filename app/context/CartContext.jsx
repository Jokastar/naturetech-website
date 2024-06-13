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
    const amount = items.reduce((total, item) => total + (item.priceInCents * item.quantity), 0);
    setTotalAmount(amount);
  }, [items]);


  // Method to add an item to the cart
  const addItem = (itemToAdd, selectedSize, selectedQuantity) => {
    // Check if the item with the exact same id and size is already in the items list
    const existingItem = items.find(item => item._id === itemToAdd._id && item.size === selectedSize);
  
    if (!existingItem) {
      // If there is no existing item with the same id and size, add a new item
      const newItem = { ...itemToAdd, size: selectedSize, quantity: selectedQuantity };
      setItems(prevItems => [...prevItems, newItem]);
    } else {
      // If there is an existing item with the same id and size, increase its quantity
      setItems(prevItems => {
        return prevItems.map(item =>
          item._id === existingItem._id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        );
      });
    }
  };
  
  // Method to remove an item from the cart
   const removeItem = (itemId) => {
    console.log(itemId)
    setItems(prevItems => prevItems.filter(item => item._id !== itemId)); 
  }; 

  // Method to clear the cart
  const clearCart = () => {
    setItems([]);
  };

  // Method to increase product quantity
  const increaseQuantity = (itemId) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Method to decrease product quantity
  const decreaseQuantity = (itemId) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
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
