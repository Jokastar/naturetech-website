"use client"; 
import { useState, useEffect, useRef} from 'react';
import { useCart } from '../context/cartContext'
import MenuProductCard from './MenuProductCard';
import Link from 'next/link';

function Cart() {
  const {items, clearCart, totalAmount} = useCart(); 
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const cartRef = useRef(null);

  const toggleCart = () => {

    setIsCartOpen(!isCartOpen);
    if (cartRef.current) {
      cartRef.current.classList.toggle('open');
    }

  };


  useEffect(() => {
    const initialTotalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    setTotalQuantity(initialTotalQuantity);
  }, [items]);


  return (
    <>
    <div className='relative'>
      <div className='w-[20px] h-[20px] bg-[var(--green)] text-white rounded-[60%] flex justify-center items-center absolute top-[-15px] left-[25px] text-[10px]'>
        <span>{totalQuantity}</span>
      </div>
      <div onClick={toggleCart} className='cursor-pointer'>Cart</div>
    </div>
    <div ref={cartRef} className='cart-modal absolute top-0 right-0 min-h-[100vh] bg-[var(--light-gray)] w-[500px]'>
    <div className='flex justify-end p-4'>
    <div className='w-[20px] h-[20px] bg-black text-white rounded-[60%] flex justify-center items-center text-[10px] cursor-pointer' onClick={toggleCart}>
        <span>X</span>
      </div>
    </div>
      {totalQuantity ? <CartContent items={items} totalAmount={totalAmount} clearCart={clearCart} setTotalQuantity={setTotalQuantity}/> : <div className='flex items-center justify-center h-full'><p>No product in the cart</p></div>}
    </div>
    </>
  )
}

function CartContent({totalAmount, clearCart, items, setTotalQuantity}){
  return(
    <>
    {items?.map(item =>(<MenuProductCard product={item} key={item.name} setTotalQuantity={setTotalQuantity}/>))}

  <div className='flex flex-col w-full justify-center'>
  <div className='flex justify-between items-center font-medium my-2'><p >TOTAL</p><p>${totalAmount}</p></div> 
      <button onClick={clearCart} className='text-white p-2 bg-red-500 rounded-md text-center my-2 hover:bg-red-300'> Clear cart</button>  
      <Link href="/checkout" className='bg-black text-white rounded-md p-2 text-center'>Checkout</Link>
    </div>
    </>
  )
}

export default Cart; 