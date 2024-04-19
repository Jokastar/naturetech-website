import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Image from 'next/image';

    const MenuProductCard = ({ product }) => {
      const [quantity, setQuantity] = useState(1);  // Default quantity is 1
      const {removeItem} = useCart(); 
    
      // Function to increase quantity + should not be greater that product qte
      const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
      };
    
      // Function to decrease quantity
      const decreaseQuantity = () => {
        if (quantity > 1) {
          setQuantity(prevQuantity => prevQuantity - 1);
        } else{
            removeItem(product.id)
        }
      };

    
     
  return (
    <div className="item">
      <Image src={product.imgSrc} alt={product.title} width={60} height={60}/>
      <h2 className="product-title">{product.title}</h2>
      <p className="product-price">Price: ${product.price.toFixed(2)}</p>
      <div className="product-quantity">
        <label htmlFor="quantity">Quantity:</label>
        <input 
          type="number" 
          id="quantity" 
          name="quantity" 
          value={quantity} 
          onChange={handleQuantityChange} 
          min="0" 
        />
      </div>
    </div>
  );
}


export default MenuProductCard; 