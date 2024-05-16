"use client"; 

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
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
        return <div>{error}</div>;
    }

    return (
        <>
        <div className='grid grid-cols-3 gap-2'>
            {products.map(product => (
                <ProductCard product={product} key={product.name}/>
            ))}
        </div>
        </>
        
    );
}

export default ShopPage;
