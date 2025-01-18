"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "../../sanity/lib/client"; // Ensure Sanity client is configured
import { urlFor } from "@/sanity/lib/image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";


// Product Interface
interface Product {
  id: string |number;
   _id: string;
   slug: { current: string };
   name: string;
   price: number;
   image: SanityImageSource[];
}

const NewCeramics = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch Products from Sanity
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const results = await client.fetch(
          `*[_type == "product"]{
            _id,
            slug,
            name,
            price,
            description,
            features,
            dimensions,
            image
          }`
        );
        setProducts(results);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
  };

  if (products.length === 0) {
    return <p className="text-center mt-10">Loading products...</p>;
  }

  return (
    <section className="py-16 px-5 mx-auto mt-16 mb-8 bg-light-grey w-full max-w-[1440px]">
      <h2 className="text-17xl font-headings-h1 text-left mb-5 text-dark-primary">New Ceramics</h2>

      {/* Slider for Small Screens */}
      <div className="block sm:hidden relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="min-w-full flex flex-col items-center justify-center"
            >
           <Image
                                 src={urlFor(product.image).url()}
                                 alt={product.name}
                                 width={500}
                                 height={500}
                                 className="object-cover rounded-t-lg w-full h-[350px]"
                                  />
              <div className="p-4 text-center">
                <h3 className="font-body-medium text-lg mb-2 text-primary">{product.name}</h3>
                <p className="text-slategray-100">£{product.price}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 transform -translate-y-1/2  text-white rounded-full p-3 z-10 shadow-md"
        >
          ◀
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2  text-white rounded-full p-3 z-10 shadow-md"
        >
          ▶
        </button>
      </div>

      {/* Grid Layout for Larger Screens */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
  <Link
    href={product.slug ? `/products/${product.slug.current}` : '#'}
    key={product.slug?.current || product.id}
  >
    
    <Image
                         src={urlFor(product.image).url()}
                         alt={product.name}
                         width={500}
                         height={500}
                         className="object-cover rounded-t-lg w-full h-[350px]"
                          />

<div className="p-4 text-center">
                <h3 className="font-body-medium text-lg mb-2 text-primary">{product.name}</h3>
                <p className="text-slategray-100">£{product.price}</p>
              </div>
  </Link>
))}
      </div>

      <div className="text-center mt-8">
        <Link href="./listing">
          <button className="px-6 py-2 text-dark-primary bg-white hover:bg-dark-primary hover:text-white transition-colors duration-300">
            View Collection
          </button>
        </Link>
      </div>
    </section>
  );
};

export default NewCeramics;
