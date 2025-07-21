"use client"

import Image from "next/image"
import type { Product } from "./types"

interface ProductItemProps {
  product: Product
  canEdit: boolean
  onQuantityChange?: (productId: string, newQuantity: number) => void
}

export default function ProductItem({ product, canEdit, onQuantityChange }: ProductItemProps) {
  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, product.quantity + change)
    if (onQuantityChange) {
      onQuantityChange(product.id, newQuantity)
    }
  }

  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
      <Image
        src={product.thumbnail || "/placeholder.svg"}
        alt={product.name}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{product.name}</h4>
        {product.description && (
          <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span>Qty:</span>
              {canEdit ? (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={product.quantity <= 1}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 transition-colors duration-200"
                    aria-label="Decrease quantity"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-8 text-center font-medium">{product.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors duration-200"
                    aria-label="Increase quantity"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              ) : (
                <span className="font-medium">{product.quantity}</span>
              )}
            </div>
            <span>${product.price.toFixed(2)} each</span>
          </div>
          <div className="text-sm sm:text-base font-semibold text-gray-900">${product.totalPrice.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
