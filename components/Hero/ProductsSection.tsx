"use client";
import { Star, ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart } from "@/redux/cartSlice";
import Link from "next/link";
import { addToWishlist, removeFromWishlist } from "@/redux/wishlist";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  isNew?: boolean;
  isSale?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: "Adventure Pro Water Bottle",
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.9,
    reviewCount: 1247,
    image: "/placeholder.svg?height=300&width=300&text=Adventure+Pro+Bottle",
    badge: "Best Seller",
    isSale: true,
  },
  {
    id: 2,
    name: "Urban Classic Tumbler",
    price: 29.99,
    rating: 4.8,
    reviewCount: 892,
    image: "/placeholder.svg?height=300&width=300&text=Urban+Classic+Tumbler",
    isNew: true,
  },
  {
    id: 3,
    name: "Eco Warrior Bottle",
    price: 34.99,
    rating: 4.9,
    reviewCount: 2156,
    image: "/placeholder.svg?height=300&width=300&text=Eco+Warrior+Bottle",
    badge: "Eco-Friendly",
  },
  {
    id: 4,
    name: "Sport Elite Flask",
    price: 44.99,
    originalPrice: 54.99,
    rating: 4.7,
    reviewCount: 634,
    image: "/placeholder.svg?height=300&width=300&text=Sport+Elite+Flask",
    isSale: true,
  },
  {
    id: 5,
    name: "Minimalist Steel Bottle",
    price: 32.99,
    rating: 4.8,
    reviewCount: 1089,
    image: "/placeholder.svg?height=300&width=300&text=Minimalist+Steel+Bottle",
  },
  {
    id: 6,
    name: "Travel Companion Mug",
    price: 24.99,
    rating: 4.6,
    reviewCount: 567,
    image: "/placeholder.svg?height=300&width=300&text=Travel+Companion+Mug",
    isNew: true,
  },
  {
    id: 7,
    name: "Premium Insulated Bottle",
    price: 49.99,
    rating: 4.9,
    reviewCount: 1834,
    image:
      "/placeholder.svg?height=300&width=300&text=Premium+Insulated+Bottle",
    badge: "Premium",
  },
  {
    id: 8,
    name: "Kids Fun Water Bottle",
    price: 19.99,
    rating: 4.7,
    reviewCount: 423,
    image: "/placeholder.svg?height=300&width=300&text=Kids+Fun+Bottle",
  },
];
const ProductsSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlist = useSelector((state: RootState) => state.wishlist.WishList);
  const wishlistIds = new Set(wishlist.map((item) => item.id));

  const handleAddToCart = (product: Product) => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    );
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-current"
                : star - 0.5 <= rating
                ? "text-yellow-400 fill-current opacity-50"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our premium collection of water bottles designed for every
            lifestyle and adventure.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => {
            const isInWishlist = wishlistIds.has(product.id);

            const handleWishlist = () => {
              if (isInWishlist) {
                dispatch(removeFromWishlist(product.id));
              } else {
                dispatch(addToWishlist({ ...product, quantity: 1, addedDate: new Date()  }));
              }
            };

            return (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Product Badge */}
                {(product.badge || product.isNew || product.isSale) && (
                  <div className="absolute top-3 left-3 z-10">
                    {product.isSale && (
                      <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-1">
                        SALE
                      </span>
                    )}
                    {product.isNew && (
                      <span className="inline-block bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full mb-1">
                        NEW
                      </span>
                    )}
                    {product.badge && (
                      <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlist}
                  className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors duration-200 ${
                      isInWishlist
                        ? "text-red-500 fill-current"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                    fill={isInWishlist ? "currentColor" : "none"}
                  />
                </button>

                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-t-2xl">
                  <Image
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={300}
                    height={300}
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-6">
                  {/* Rating */}
                  <div className="flex items-center justify-between mb-2">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-500">
                      ({product.reviewCount})
                    </span>
                  </div>

                  {/* Product Name */}
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors duration-200">
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="text-sm font-medium text-red-500">
                        Save $
                        {(product.originalPrice - product.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-teal-600 text-white py-2.5 px-2 text-[13px] sm:text-[15px] rounded-xl font-medium hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group-hover:bg-teal-700"
                    >
                      <ShoppingCart className="w-4 h-4 inline mr-2" />
                      Add to Cart
                    </button>

                    <Link
                      href="/product-detail"
                      className="w-full border-2 border-gray-200 text-gray-700 py-2.5 px-2 rounded-xl font-medium hover:border-teal-600 hover:text-teal-600 transition-all duration-300 block text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400/0 via-teal-400/0 to-teal-400/0 group-hover:from-teal-400/10 group-hover:via-teal-400/5 group-hover:to-teal-400/10 transition-all duration-500 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-teal-600 hover:text-teal-600 hover:bg-teal-50 transition-all duration-300 transform hover:scale-105">
            Load More Products
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Custom CSS for line-clamp */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default ProductsSection;
