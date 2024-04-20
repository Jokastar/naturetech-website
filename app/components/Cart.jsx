"use client"; 
import { useCart } from '../context/cartContext'
import MenuProductCard from './MenuProductCard';
import Link from 'next/link';

function Cart() {
  const {items, clearCart, totalAmount} = useCart(); 
  return (
    <>
        <div>Cart</div>
        <div className='cart-dropdown'>
            {items === 0 ? "No product in cart" : items.map(item =>(
                <MenuProductCard product={item} key={item.name}/>
            ))}
        </div>
        <p>{totalAmount}</p> 
        <button onClick={clearCart} className='text-red-600'> Clear cart</button>  
        <Link href="/checkout">
        <button>Checkout</button>
        </Link>
        
    </> 
  )
}

export default Cart