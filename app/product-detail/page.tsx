"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Plus,
  Minus,
  MapPin,
  Check,
  X,
} from "lucide-react"

interface ProductData {
  id: number
  title: string
  price: number
  originalPrice: number
  discount: number
  category: string
  description: string
  rating: number
  reviewCount: number
  inStock: boolean
  stockCount: number
  seller: string
  images: string[]
  specifications: { [key: string]: string }
  features: string[]
  shippingInfo: {
    freeShipping: boolean
    deliveryDays: string
    returnPolicy: string
  }
}

const ProductDetailPage = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedTab, setSelectedTab] = useState("description")
  const [pincode, setPincode] = useState("")
  const [pincodeChecked, setPincodeChecked] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [showMobileActions, setShowMobileActions] = useState(false)

  // Sample product data
  const product: ProductData = {
    id: 1,
    title: "Premium Wireless Bluetooth Headphones with Active Noise Cancellation",
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    category: "Electronics > Audio > Headphones",
    description:
      "Experience premium sound quality with our flagship wireless headphones featuring advanced active noise cancellation technology. Perfect for music lovers, professionals, and travelers who demand the best audio experience.",
    rating: 4.5,
    reviewCount: 1247,
    inStock: true,
    stockCount: 15,
    seller: "TechStore Official",
    images: [
      "/placeholder.svg?height=600&width=600&text=Main+Headphones+View",
      "/placeholder.svg?height=600&width=600&text=Side+View",
      "/placeholder.svg?height=600&width=600&text=Folded+View",
      "/placeholder.svg?height=600&width=600&text=Case+View",
      "/placeholder.svg?height=600&width=600&text=Color+Options",
    ],
    specifications: {
      Brand: "AudioTech Pro",
      Model: "AT-WH1000XM5",
      Connectivity: "Bluetooth 5.2, 3.5mm Jack",
      "Battery Life": "30 hours with ANC",
      "Charging Time": "3 hours (Quick charge: 10 min = 5 hours)",
      Weight: "250g",
      "Driver Size": "40mm",
      "Frequency Response": "4Hz - 40kHz",
      Impedance: "16 ohms",
      Warranty: "2 years",
    },
    features: [
      "Industry-leading Active Noise Cancellation",
      "30-hour battery life with quick charge",
      "Premium comfort with soft ear cushions",
      "High-resolution audio support",
      "Touch controls and voice assistant",
      "Foldable design for easy portability",
    ],
    shippingInfo: {
      freeShipping: true,
      deliveryDays: "2-4 business days",
      returnPolicy: "30-day return policy",
    },
  }

  // Handle scroll for mobile sticky actions
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowMobileActions(scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
    setImageLoading(true)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity)
    }
  }

  const checkPincode = () => {
    if (pincode.length === 6) {
      setPincodeChecked(true)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
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
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="hover:text-blue-600 cursor-pointer">Home</span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-blue-600 cursor-pointer">Electronics</span>
            <ChevronRight className="w-4 h-4" />
            <span className="hover:text-blue-600 cursor-pointer">Audio</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {imageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              )}
              <Image
                src={product.images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.title}
                fill
                className={`object-cover transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setImageLoading(false)}
                priority
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index
                      ? "border-blue-600 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product view ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {renderStars(product.rating)}
                <span className="text-sm font-medium text-gray-900">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              </div>
              <p className="text-sm text-green-600 font-medium">
                You save ${(product.originalPrice - product.price).toFixed(2)}
              </p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">In Stock</span>
                  <span className="text-gray-500">({product.stockCount} available)</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-600" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Sold by</p>
              <p className="font-medium text-gray-900">{product.seller}</p>
            </div>

            {/* Shipping Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    {product.shippingInfo.freeShipping ? "Free Shipping" : "Paid Shipping"}
                  </p>
                  <p className="text-sm text-gray-600">Delivery in {product.shippingInfo.deliveryDays}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">{product.shippingInfo.returnPolicy}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600">2 year warranty included</p>
              </div>
            </div>

            {/* Pincode Checker */}
            <div className="space-y-2">
              <p className="font-medium text-gray-900">Check delivery availability</p>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={6}
                  />
                </div>
                <button
                  onClick={checkPincode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Check
                </button>
              </div>
              {pincodeChecked && (
                <p className="text-sm text-green-600 flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Delivery available in your area
                </p>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-50 transition-colors duration-200"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-50 transition-colors duration-200"
                    disabled={quantity >= product.stockCount}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-all duration-200 transform hover:scale-[1.02]">
                  Buy Now
                </button>
                <button className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-yellow-500 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-full py-3 px-6 rounded-lg font-medium border-2 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center ${
                    isWishlisted
                      ? "border-red-500 text-red-500 bg-red-50"
                      : "border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500"
                  }`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? "fill-current" : ""}`} />
                  {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                    selectedTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {selectedTab === "description" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedTab === "specifications" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === "reviews" && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-600">Reviews section coming soon...</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Currently showing {product.reviewCount} reviews with average rating of {product.rating}/5
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Actions */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden transition-transform duration-300 ${
          showMobileActions ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex space-x-3">
          <button className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-medium">Buy Now</button>
          <button className="flex-1 bg-yellow-400 text-gray-900 py-3 px-4 rounded-lg font-medium flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
