"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ChevronRight,
  Star,
  Package,
  AlertCircle,
  ArrowLeft,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { addToCart } from "@/redux/cartSlice";
import {removeFromWishlist} from '@/redux/wishlist'
import Link from "next/link";

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  discount?: number;
  addedDate: string;
}

const WishlistPage = () => {
  const products = useSelector((state: RootState) => state.wishlist.WishList);

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "Premium Wireless Bluetooth Headphones",
      price: 299.99,
      originalPrice: 399.99,
      image: "/placeholder.svg?height=400&width=400&text=Wireless+Headphones",
      category: "Electronics",
      rating: 4.5,
      reviewCount: 1247,
      inStock: true,
      discount: 25,
      addedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Organic Cotton Comfortable T-Shirt",
      price: 45.0,
      originalPrice: 60.0,
      image: "/placeholder.svg?height=400&width=400&text=Cotton+T-Shirt",
      category: "Clothing",
      rating: 4.3,
      reviewCount: 892,
      inStock: true,
      discount: 25,
      addedDate: "2024-01-12",
    },
    {
      id: 3,
      name: "Professional Leather Laptop Bag",
      price: 189.99,
      originalPrice: 249.99,
      image: "/placeholder.svg?height=400&width=400&text=Laptop+Bag",
      category: "Accessories",
      rating: 4.7,
      reviewCount: 456,
      inStock: false,
      discount: 24,
      addedDate: "2024-01-10",
    },
    {
      id: 4,
      name: "Smart Fitness Watch with Heart Rate Monitor",
      price: 199.99,
      image: "/placeholder.svg?height=400&width=400&text=Fitness+Watch",
      category: "Electronics",
      rating: 4.4,
      reviewCount: 1089,
      inStock: true,
      addedDate: "2024-01-08",
    },
    {
      id: 5,
      name: "Eco-Friendly Yoga Mat with Carrying Strap",
      price: 79.99,
      originalPrice: 99.99,
      image: "/placeholder.svg?height=400&width=400&text=Yoga+Mat",
      category: "Sports",
      rating: 4.6,
      reviewCount: 234,
      inStock: true,
      discount: 20,
      addedDate: "2024-01-05",
    },
    {
      id: 6,
      name: "Minimalist Ceramic Coffee Mug Set",
      price: 34.99,
      image: "/placeholder.svg?height=400&width=400&text=Coffee+Mug+Set",
      category: "Home",
      rating: 4.2,
      reviewCount: 167,
      inStock: true,
      addedDate: "2024-01-03",
    },
  ]);

  const dispatch = useDispatch<AppDispatch>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);



//   const renderStars = (rating: number) => {
//     return (
//       <div className="flex items-center">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             className={`w-3 h-3 ${
//               star <= rating
//                 ? "text-yellow-400 fill-current"
//                 : star - 0.5 <= rating
//                 ? "text-yellow-400 fill-current opacity-50"
//                 : "text-gray-300"
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };

  const categories = [
    "all",
    ...Array.from(
      new Set(wishlistItems.map((item) => item.category.toLowerCase()))
    ),
  ];

  const filteredAndSortedItems = products
    .filter(
      (item) =>
        filterCategory === "all" || item.name.toLowerCase() === filterCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return (
            new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
          );
      }
    });

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="hover:text-teal-600 cursor-pointer">Home</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Wishlist</span>
            </nav>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your wishlist is empty
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Save items you love by clicking the heart icon. We&apos;ll keep them
              safe here for you.
            </p>
            <Link href="/" className="inline-flex items-center px-8 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-all duration-200 transform hover:scale-105">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="hover:text-teal-600 cursor-pointer">Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {filteredAndSortedItems.length}{" "}
                {filteredAndSortedItems.length === 1 ? "item" : "items"} saved
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === "grid"
                      ? "bg-teal-100 text-teal-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === "list"
                      ? "bg-teal-100 text-teal-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>

                {/* Filter by Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all"
                          ? "All Categories"
                          : category.charAt(0).toUpperCase() +
                            category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wishlist Items */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* {item.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      {item.discount}% OFF
                    </div>
                  )} */}{" "}
                  55
                  <button
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                    className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    {/* <span className="text-xs text-gray-500 uppercase tracking-wide">{item.category}</span> */}
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {item.name}
                    </span>
                    <div className="flex items-center space-x-1">
                      {/* {renderStars(item.rating)} */}5
                      {/* <span className="text-xs text-gray-500">({item.reviewCount})</span> */}
                      77
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors duration-200">
                    {item.name}
                  </h3>

                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.price}
                    </span>
                    {item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.price}
                      </span>
                    )}
                  </div>

                  {/* <div className="flex items-center space-x-2 mb-3">
                    {item.inStock ? (
                      <div className="flex items-center text-green-600 text-sm">
                        <Package className="w-4 h-4 mr-1" />
                        In Stock
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Out of Stock
                      </div>
                    )}
                  </div> */}

                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        dispatch(
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                          })
                        )
                      }
                      className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                    <button
                    
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:border-teal-600 hover:text-teal-600 transition-colors duration-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Product Image */}
                  <div className="relative w-full sm:w-48 h-48 bg-gray-100 overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    {/* {item.discount && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        {item.discount}% OFF
                      </div>
                    )} */}
                    {/* {!item.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium">Out of Stock</span>
                      </div>
                    )} */}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          {/* <span className="text-sm text-gray-500 uppercase tracking-wide">{item.category}</span> */}
                          <span className="text-sm text-gray-500 uppercase tracking-wide">
                            {item.name}
                          </span>
                          <div className="flex items-center space-x-1">
                            {/* {renderStars(item.rating)} */}
                            {/* <span className="text-sm text-gray-500">({item.reviewCount})</span> */}{" "}
                            77
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-teal-600 transition-colors duration-200">
                          {item.name}
                        </h3>

                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl font-bold text-gray-900">
                            ${item.price}
                          </span>
                          {item.price && (
                            <span className="text-lg text-gray-500 line-through">
                              ${item.price}
                            </span>
                          )}
                        </div>

                        {/* <div className="flex items-center space-x-2 mb-4">
                          {item.inStock ? (
                            <div className="flex items-center text-green-600">
                              <Package className="w-4 h-4 mr-1" />
                              In Stock
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Out of Stock
                            </div>
                          )}
                        </div> */}

                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() =>
                              dispatch(
                                addToCart({
                                  id: item.id,
                                  name: item.name,
                                  price: item.price,
                                  image: item.image,
                                })
                              )
                            }
                            // disabled={!item.inStock}
                            className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </button>
                          <button
           
                            // disabled={!item.inStock}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-teal-600 hover:text-teal-600 transition-colors duration-200 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            View Details
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => dispatch(removeFromWishlist(item.id))}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 ml-4"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAndSortedItems.length === 0 && wishlistItems.length > 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No items match your filters
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters to see more items.
            </p>
            <button
              onClick={() => {
                setFilterCategory("all");
                setSortBy("newest");
              }}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default WishlistPage;
