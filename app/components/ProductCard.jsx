"use client"; 

import React, { useState } from 'react';
import Link from 'next/link';
import { formattedCurrency } from '../lib/currencyFormat';


function ProductCard({ product }) {
  return (
    <Link href={`/shop/${product._id}`}>
      <div className="text-[var(--light-gray)] hover:bg-[var(--green)] hover:text-white transition-background ease-out duration-200 p-4 font-test-sohne-mono text-sm">
        <img src={product.frontProductImageUrl} alt={product.name} className="w-full object-cover rotate-180" />
        <div className="flex flex-col justify-center items-center gap-3">
          <p>{product.name}</p>
          <p>{formattedCurrency(product.priceInCents)}</p>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;

