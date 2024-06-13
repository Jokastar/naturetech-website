"use client"; 
import { useState, useEffect, useRef} from 'react';
import { useCart } from '../context/cartContext'
import MenuProductCard from './MenuProductCard';
import Link from 'next/link';
import { formattedCurrency } from '../lib/currencyFormat';

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
    <div ref={cartRef} className='cart-modal absolute top-0 right-0 h-[100vh] bg-[var(--dark-gray)] text-[var(--light-gray)] w-[500px] p-4 overflow-y-scroll'>
    <div className='flex justify-between items-end w-full'>
      <p>Cart</p>
    <div className='w-[18px] h-[18px] bg-black text-white rounded-[60%] flex justify-center items-center text-[8px] cursor-pointer' onClick={toggleCart}>
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
  <p onClick={clearCart} className='text-red-600 my-2 hover:text-red-400 cursor-pointer text-[10px]'> Clear cart</p>
  <div className='flex justify-between items-center font-medium  my-2 text-[1rem]'><p >TOTAL</p><p>{formattedCurrency(totalAmount)}</p></div> 
      <Link href="/checkout" className='bg-[var(--green)] text-white px-2 py-3 text-center font-test-sohne-breit'>Checkout</Link> 
    </div>
    </>
  )
}

export default Cart; 