"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Lock, Gift, Tag } from "lucide-react"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store";
import { decreaseQuantity, increaseQuantity, removeFromCart } from "@/redux/cartSlice"
import Link from "next/link"

interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  quantity: number
  image: string
  category: string
  inStock: boolean
}

const CartPageAlternative = () => {

     const products = useSelector(
    (state: RootState) => state.cart.items
  );

const dispatch = useDispatch();


  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)



  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true)
    }
  }

  const subtotal = products.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const promoDiscount = promoApplied ? subtotal * 0.1 : 0
  const tax = (subtotal - promoDiscount) * 0.08
  const shipping = subtotal > 100 ? 0 : 15.0
  const total = subtotal - promoDiscount + tax + shipping

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-4xl font-light text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-500 text-lg mb-8">Start adding some items to get started</p>
            <Link href="/" className="bg-black text-white px-8 py-3 rounded-none hover:bg-gray-800 transition-colors duration-300 font-medium">
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-8 mb-8">
          <button className="flex items-center text-gray-600 hover:text-black mb-6 transition-colors duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to shopping
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-light text-gray-900">Shopping Bag</h1>
              <p className="text-gray-500 mt-2">{products.length} items</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-2xl font-light">${total.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Total (incl. tax)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            {products.map((item, index) => (
              <div
                key={item.id}
                className="group border-b border-gray-100 pb-8 last:border-b-0"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.15}s both`,
                }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <div className="relative">
                    <div className="w-full md:w-40 h-48 md:h-40 bg-gray-50 overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={160}
                        height={160}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        {/* <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{item.category}</p> */}
                        <h3 className="text-xl font-light text-gray-900">{item.name}</h3>
                      </div>
                      <button
                         onClick={() => dispatch(removeFromCart(item.id))}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-lg font-medium">${item.price.toFixed(2)}</span>
                      {item.price && (
                        <>
                          <span className="text-gray-400 line-through">${item.price.toFixed(2)}</span>
                          {/* <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            SAVE ${(item.originalPrice - item.price).toFixed(2)}
                          </span> */}
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300">
                        <button
                        
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                        //   disabled={!item.inStock}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-12 h-10 flex items-center justify-center font-medium border-x border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                        //   disabled={!item.inStock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-lg font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 sticky top-8">
              <h2 className="text-xl font-light mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2 flex items-center">
                    <Gift className="w-4 h-4 mr-1" />
                    Promo code applied!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span>-${promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Free Shipping Progress */}
              {shipping > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Free shipping at $100</span>
                    <span>${(100 - subtotal).toFixed(2)} to go</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2">
                    <div
                      className="bg-black h-2 transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Checkout Button */}
              <button className="w-full bg-black text-white py-4 mb-4 hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.02] font-medium tracking-wide">
                SECURE CHECKOUT
              </button>

              {/* Security Info */}
              <div className="text-center text-xs text-gray-500">
                <div className="flex items-center justify-center mb-2">
                  <Lock className="w-3 h-3 mr-1" />
                  <span>256-bit SSL encryption</span>
                </div>
                <p>Your information is protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default CartPageAlternative
