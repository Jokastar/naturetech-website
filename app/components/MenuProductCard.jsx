"use client"
import { useCart } from '../context/cartContext';
import Image from 'next/image';
import { formattedCurrency } from '../lib/currencyFormat';

const QuantityBtn = ({ sign, onClick, productId, size }) => (
  <button
    onClick={() => onClick(productId, size)}
    className='w-[16px] h-[16px] flex items-center justify-center bg-[var(--black)] text-[var(--light-gray)] text-xs rounded-full'
  >
   <span className='text-xs'>{sign}</span>
  </button>
);

const MenuProductCard = ({ product, setTotalQuantity }) => {
  const { increaseQuantity, removeItem, decreaseQuantity } = useCart();

  const handleRemoveItem = (productId, size) => {
    removeItem(productId, size);
    setTotalQuantity(prev => prev - product.quantity);
  };

  const handleIncreaseItemQuantity = (productId, size) => {
    increaseQuantity(productId, size);
    setTotalQuantity(prev => prev + 1);
  };

  const handleDecreaseQuantity = (productId, size) => {
    decreaseQuantity(productId, size);
    setTotalQuantity(prev => prev - 1);
  };

  return (
    <div className="item border-b border-b-1 border-b-[var(--light-gray)] border-t border-t-1 border-t-[var(--light-gray)] my-4 py-2 text-[var(--light-gray)] text-[11px]">
      <div className='flex justify-between'>
        <div>
          <h2 className="product-title font-medium">{product.name}</h2>
          <p className="product-size my-2">Size {product.size}</p>
          <p className="product-price my-2">{formattedCurrency(product.priceInCents)}</p>
        </div>
        <Image src={product.productImageMiniature} alt={product.name} width={60} height={60} />
      </div>
      
      <div className='flex justify-between'>
      <div className='flex items-center justify-between'>
        <div className="product-quantity flex gap-3 my-2">
          <label htmlFor="quantity">Quantity</label>
          <div className='quantity-btn flex items-center justify-evenly'>
            <QuantityBtn sign={"+"} onClick={handleIncreaseItemQuantity} productId={product._id} size={product.size} />
            <p className='w-[16px] h-[16px] flex items-center justify-center'>{product.quantity}</p>
            <QuantityBtn sign={"-"} onClick={handleDecreaseQuantity} productId={product._id} size={product.size} />
          </div>
        </div>
      </div>
      <button className='text-red-600 hover:text-red-400' onClick={() => handleRemoveItem(product._id, product.size)}>Remove</button>
      </div>
    </div>
  );
}


export default MenuProductCard; 