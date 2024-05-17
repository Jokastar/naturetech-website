"use client"
import { useCart } from '../context/cartContext';
import Image from 'next/image';

    const MenuProductCard = ({ product, setTotalQuantity }) => {
      const {increaseQuantity,removeItem, decreaseQuantity} = useCart(); 

      const handleRemoveItem = (productId) =>{
        removeItem(product._id)
        setTotalQuantity(prev => prev -= product.quantity); 
      }

      const handleIncreaseIteQuantity = (productId) =>{
        increaseQuantity(productId);
        setTotalQuantity(prev => prev + 1);
      }
      const handleDecreaseQuantity = (productId) =>{
        decreaseQuantity(productId);
        setTotalQuantity(prev => prev - 1);

      }
     
  return (
    <div className="item bg-gray-200 rounded-md p-2 mb-2">
      <div className='flex items-center justify-between'>
        <div>
          <h2 className="product-title font-medium">{product.name}</h2>
          <p className="product-price my-2">${product.priceInCents}</p>
        </div>
      <Image src={product.imagePath} alt={product.name} width={60} height={60}/>
      </div>
      <div className='flex items-center justify-between'>
      <div className="product-quantity flex gap-2">
        <label htmlFor="quantity">quantity</label>
        <div className='quantity-btn flex items-center'>
        <QuantityBtn sign={"+"} onClick = {handleIncreaseIteQuantity} productId={product._id}/>
        <p className='w-[24px] h-[24px] flex items-center justify-center'>{product.quantity}</p>
        <QuantityBtn sign={"-"} onClick={handleDecreaseQuantity} productId={product._id}/>
      </div>
        </div>
      <button className='text-red-600 hover:text-red-400' onClick={()=>handleRemoveItem(product._id)}>Remove</button>
      </div>
    </div>
  );
}

function QuantityBtn({sign, onClick, productId}){
  return (
    <div 
    className='w-[18px] h-[18px] flex items-center justify-center bg-black rounded-[50%] text-white cursor-pointer'
    onClick={()=>onClick(productId)}
    >
    <p className='text-[12px]'>{sign}</p>
    </div>
  )
}


export default MenuProductCard; 