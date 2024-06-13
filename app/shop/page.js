"use client"; 

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import { getProducts } from '../admin/products/_actions/products';

function ShopPage() {
    const [products, setProducts] = useState([]); 
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getAllProducts(){
            try {
                const products = await getProducts(); 

                if (!products || products.length === 0) {
                    setError("No products available");
                }
                
                setProducts(products);
                
            } catch (e) {
                console.log(e);
                setError(e.message); 
            }
        }

        getAllProducts(); 
    }, []); 

    if(error) {
        return (
            <>
            <Header/>
            <div className="flex justify-center items-center h-[100vh] text-white">{error}</div>;
            </>
        )
    }

    return (
        <>
        <Header/>
        <div className='grid grid-cols-3 gap-2 pt-[72px]'>
            {products.map(product => (
                <ProductCard product={product} key={product.name}/>
            ))}
        </div>
        </>
        
    );
}

export default ShopPage;
