"use client"; 
import { useState, useEffect } from 'react';
import { useCart } from '../context/cartContext'
import MenuProductCard from './MenuProductCard';
import Link from 'next/link';

function Cart() {
  const {items, clearCart, totalAmount} = useCart(); 
  const [totalQuantity, setTotalQuantity] = useState(0); 
  useEffect(() => {
    const initialTotalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(initialTotalQuantity);
  }, [items]);
  return (
    <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn m-1 bg-black text-white relative">Cart<span className='bg-red-500 text-white w-[14px] h-[14px] text-center rounded-[50%] absolute top-1 right-1 text-[8px] auto'>{totalQuantity}</span></div>
          <div tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box min-w-[400px] min-h-[50vh] relative">
              {items.length === 0 ? <p className='text-center m-auto'>No product in cart</p>: <CartContent totalAmount={totalAmount} clearCart={clearCart} items={items} setTotalQuantity={setTotalQuantity}/>}
          </div>
</div>
  )
}

function CartContent({totalAmount, clearCart, items, setTotalQuantity}){
  return(
    <>
    {items.map(item =>(<MenuProductCard product={item} key={item.name} setTotalQuantity={setTotalQuantity}/>))}

  <div className='flex flex-col w-full justify-center'>
  <div className='flex justify-between items-center font-medium my-2'><p >TOTAL</p><p>${totalAmount}</p></div> 
      <button onClick={clearCart} className='text-white p-2 bg-red-500 rounded-md text-center my-2 hover:bg-red-300'> Clear cart</button>  
      <Link href="/checkout" className='bg-black text-white rounded-md p-2 text-center'>Checkout</Link>
    </div>
    </>
  )
}

export default Cart; 